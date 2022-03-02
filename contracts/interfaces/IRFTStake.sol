// SPDX-License-Identifier: MIT

pragma solidity ^0.8;

interface IRFTStake {

   function stakingToken() external view returns (address);
    function rewardToken() external view returns (address);

    function totalStaked() external view returns (uint256);
    function totalRealised() external view returns (uint256);

    function getTotalRewards() external view returns (uint256);

    function getCumulativeRewardsPerLP() external view returns (uint256);
    function getLastContractBalance() external view returns (uint256);
    function getAccuracyFactor() external view returns (uint256);

    function getStake(address staker) external view returns (uint256);
    function getRealisedEarnings(address staker) external returns (uint256);
    function getUnrealisedEarnings(address staker) external view returns (uint256);

    function stake(uint256 amount) external;
    function stakeAll() external;

    function unstake(uint256 amount) external;
    function unstakeAll() external;

    function realise() external;

    event Realised(address account, uint amount);
    event Compounded(address account, uint amount);
    event Staked(address account, uint amount);
    event Unstaked(address account, uint amount);
    event EarlyWithdrawalPenalty(address account, uint amount);
}

interface IRFTStakeLP{
    function stakingToken() external view returns (address);
    function rewardToken() external view returns (address);
    
    function totalStaked() external view returns (uint256);
    function totalRealised() external view returns (uint256);

    function getTotalRewards() external view returns (uint256);

    function getCumulativeRewardsPerLP() external view returns (uint256);
    function getLastContractBalance() external view returns (uint256);
    function getAccuracyFactor() external view returns (uint256);

    function getStake(address staker) external view returns (uint256);
    function getRealisedEarnings(address staker) external returns (uint256);
    function getUnrealisedEarnings(address staker) external view returns (uint256);

    function stake(uint256 amount) external;
    function stakeFor(address staker, uint256 amount) external;
    function stakeAll() external;

    function unstake(uint256 amount) external;
    function unstakeAll() external;
    
    function realise() external;

    event Realised(address account, uint amount);
    event Staked(address account, uint amount);
    event Unstaked(address account, uint amount);
}