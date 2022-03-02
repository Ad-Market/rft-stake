// SPDX-License-Identifier: MIT

pragma solidity ^0.8;

import "./libraries/SafeMath.sol";
import "./libraries/ReentrancyGuard.sol";
import "./interfaces/IRFTStake.sol";
import "./lib/BEP20.sol";
import "./lib/Auth.sol";
import "./lib/Pausable.sol";

contract RFTStake is IRFTStake, Auth, Pausable, ReentrancyGuard{
    using SafeMath for uint;

    struct Stake {
        uint256 lastStaked;
        uint256 amount;
        uint256 totalExcluded;
        uint256 totalRealised;
    }
    
    address public override stakingToken;
    address public override rewardToken;

    uint256 public override totalRealised;
    uint256 public override totalStaked;

    mapping (address => Stake) public stakes;

    uint256 _accuracyFactor = 10 ** 36;
    uint256 _rewardsPerLP;
    uint256 _lastContractBalance;
    
    uint256 public penaltyTime = 7 days;
    uint256 public penaltyFee = 50; // 0.50%
    uint256 public penaltyFeeDenominator = 10000;
    address public penaltyFeeReceiver = 0x000000000000000000000000000000000000dEaD;

    constructor(address _stakingToken, address _rewardToken) Auth(msg.sender) {
        stakingToken = _stakingToken;
        rewardToken = _rewardToken;
    }

    /**
     * Total rewards realised and to be realised
     */
    function getTotalRewards() external override view returns (uint256) {
        return totalRealised + IBEP20(rewardToken).balanceOf(address(this)).sub(totalStaked);
    }

    /**
     * Total rewards per LP cumulatively, inflated by _accuracyFactor
     */
    function getCumulativeRewardsPerLP() external override view returns (uint256) {
        return _rewardsPerLP;
    }

    /**
     * The last balance the contract had
     */
    function getLastContractBalance() external override view returns (uint256) {
        return _lastContractBalance;
    }

    /**
     * Total amount of transaction fees sent or to be sent to stakers
     */
    function getAccuracyFactor() external override view returns (uint256) {
        return _accuracyFactor;
    }

    /**
     * Returns amount of LP that address has staked
     */
    function getStake(address account) public override view returns (uint256) {
        return stakes[account].amount;
    }

    /**
     * Returns total earnings (realised + unrealised)
     */
    function getRealisedEarnings(address staker) external view override returns (uint256) {
        return stakes[staker].totalRealised; // realised gains plus outstanding earnings
    }

    /**
     * Returns unrealised earnings
     */
    function getUnrealisedEarnings(address staker) external view override returns (uint256) {
        if(stakes[staker].amount == 0){ return 0; }

        uint256 stakerTotalRewards = stakes[staker].amount.mul(getCurrentRewardsPerLP()).div(_accuracyFactor);
        uint256 stakerTotalExcluded = stakes[staker].totalExcluded;

        if(stakerTotalRewards <= stakerTotalExcluded){ return 0; }

        return stakerTotalRewards.sub(stakerTotalExcluded);
    }

    function getCumulativeRewards(uint256 amount) public view returns (uint256) {
        return amount.mul(_rewardsPerLP).div(_accuracyFactor);
    }

    function stake(uint amount) nonReentrant external override {
        require(amount > 0);

        _realise(msg.sender);

        IBEP20(stakingToken).transferFrom(msg.sender, address(this), amount);

        _stake(msg.sender, amount);
    }

    function stakeAll() nonReentrant external override {
        uint256 amount = IBEP20(stakingToken).balanceOf(msg.sender);
        require(amount > 0);

        _realise(msg.sender);

        IBEP20(stakingToken).transferFrom(msg.sender, address(this), amount);

        _stake(msg.sender, amount);
    }

    function unstake(uint amount) nonReentrant external override {
        require(amount > 0);

        _unstake(msg.sender, amount);
    }

    function unstakeAll() nonReentrant external override {
        uint256 amount = getStake(msg.sender);
        require(amount > 0);

        _unstake(msg.sender, amount);
    }

    function realise() nonReentrant external override notPaused {
        _realise(msg.sender);
    }

    function _realise(address staker) internal {
        _updateRewards();

        uint amount = earnt(staker);

        if (getStake(staker) == 0 || amount == 0) {
            return;
        }

        stakes[staker].totalRealised = stakes[staker].totalRealised.add(amount);
        stakes[staker].totalExcluded = stakes[staker].totalExcluded.add(amount);
        totalRealised = totalRealised.add(amount);

        IBEP20(rewardToken).transfer(staker, amount);

        _updateRewards();

        emit Realised(staker, amount);
    }
    
    function earnt(address staker) internal view returns (uint256) {
        if(stakes[staker].amount == 0){ return 0; }

        uint256 stakerTotalRewards = getCumulativeRewards(stakes[staker].amount);
        uint256 stakerTotalExcluded = stakes[staker].totalExcluded;

        if(stakerTotalRewards <= stakerTotalExcluded){ return 0; }

        return stakerTotalRewards.sub(stakerTotalExcluded);
    }

    function _stake(address staker, uint256 amount) internal notPaused {
        require(amount > 0);

        // add to current address' stake
        stakes[staker].lastStaked = block.timestamp;
        stakes[staker].amount = stakes[staker].amount.add(amount);
        stakes[staker].totalExcluded = getCumulativeRewards(stakes[staker].amount);
        totalStaked = totalStaked.add(amount);

        emit Staked(staker, amount);
    }

    function _unstake(address staker, uint256 amount) internal notPaused {
        require(stakes[staker].amount >= amount, "Insufficient Stake");

        _realise(staker); // realise staking gains

        // remove stake
        stakes[staker].amount = stakes[staker].amount.sub(amount);
        stakes[staker].totalExcluded = getCumulativeRewards(stakes[staker].amount);
        totalStaked = totalStaked.sub(amount);

        if(stakes[staker].lastStaked + penaltyTime > block.timestamp){
            uint256 penalty = amount.mul(penaltyFee).div(penaltyFeeDenominator);
            uint256 remaining = amount.sub(penalty);
            
            IBEP20(stakingToken).transfer(staker, remaining);
            IBEP20(stakingToken).transfer(penaltyFeeReceiver, penalty);
            
            emit EarlyWithdrawalPenalty(staker, penalty);
        }else{
            IBEP20(stakingToken).transfer(staker, amount);
        }

        emit Unstaked(staker, amount);
    }

    function _updateRewards() internal  {
        uint tokenBalance = getTokenBalance();

        if(tokenBalance > _lastContractBalance && totalStaked != 0) {
            uint256 newRewards = tokenBalance.sub(_lastContractBalance);
            uint256 additionalAmountPerLP = newRewards.mul(_accuracyFactor).div(totalStaked);
            _rewardsPerLP = _rewardsPerLP.add(additionalAmountPerLP);
        }

        if(totalStaked > 0){ _lastContractBalance = tokenBalance; }
    }

    function getCurrentRewardsPerLP() public view returns (uint256 currentRewardsPerLP) {
        uint tokenBalance = getTokenBalance();

        if(tokenBalance > _lastContractBalance && totalStaked != 0){
            uint256 newRewards = tokenBalance.sub(_lastContractBalance);
            uint256 additionalAmountPerLP = newRewards.mul(_accuracyFactor).div(totalStaked);
            currentRewardsPerLP = _rewardsPerLP.add(additionalAmountPerLP);
        }
    }

    function getTokenBalance() public view returns (uint256 tokenBalance) {
        return IBEP20(rewardToken).balanceOf(address(this)).sub(totalStaked);
    }

    function setAccuracyFactor(uint256 newFactor) external authorized {
        _rewardsPerLP = _rewardsPerLP.mul(newFactor).div(_accuracyFactor); // switch _rewardsPerLP to be inflated by the new factor instead
        _accuracyFactor = newFactor;
    }
    
    function setPenalty(uint256 time, uint256 fee, uint256 denominator, address receiver) external authorized {
        penaltyTime = time;
        penaltyFee = fee;
        penaltyFeeDenominator = denominator;
        penaltyFeeReceiver = receiver;
    }

    function emergencyUnstakeAll() external {
        require(stakes[msg.sender].amount > 0, "No Stake");

        IBEP20(stakingToken).transfer(msg.sender, stakes[msg.sender].amount);
        totalStaked = totalStaked.sub(stakes[msg.sender].amount);
        stakes[msg.sender].amount = 0;
    }

}