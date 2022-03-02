// SPDX-License-Identifier: MIT

pragma solidity ^0.8;

import "./interfaces/IBEP20.sol";
import "./lib/Auth.sol";
import "./lib/Pausable.sol";
import "./libraries/SafeMath.sol";
import "./interfaces/IRouter.sol";

contract RFT is IBEP20, Auth, Pausable {
    using SafeMath for uint;

    string constant _name = "Reflecty";
    string constant _symbol = "RFT";
    uint8 constant _decimals = 18;

    uint256 private _totalSupply = 15000000 * (10 ** _decimals);
    uint256 public _maxTxAmount = 50000 * (10 ** _decimals);

    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowances;

    mapping (address => bool) public hasFee;
    mapping (address => bool) public isExempt;

    uint256 public autoLiquidityFee = 2;
    uint256 public stakingFee = 3;
    uint256 public feeDenominator = 100;

    address public autoLiquidityReceiver;
    address public stakingFeeReceiver;

    IRouter public router;
    address private WBNB;
    address public liquifyPair;

    uint256 launchedAt;

    bool public liquifyEnabled = true;
    uint256 public liquifyAmount = 250 * (10 ** _decimals);
    bool private inLiquify;

    modifier liquifying() { inLiquify = true; _; inLiquify = false; }

    constructor (address _router) Auth(msg.sender) {
        router = IRouter(_router);
        WBNB = router.WETH();
        liquifyPair = IFactory(router.factory()).createPair(WBNB, address(this));

        _allowances[address(this)][_router] = 2 ** 256 - 1;
        hasFee[liquifyPair] = true;
        isExempt[msg.sender] = true;
        isExempt[address(this)] = true;

        _balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);

        (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
        if(success){
            return;
        }
    }

    receive() external payable {
        assert(msg.sender == WBNB || msg.sender == address(router));
    }

    modifier migrationProtection(address sender) {
        require(!paused || isAuthorized(sender) || isAuthorized(msg.sender), "PROTECTED"); _;
    }

    function totalSupply() external view override returns (uint256) { return _totalSupply; }
    function decimals() external pure override returns (uint8) { return _decimals; }
    function symbol() external pure override returns (string memory) { return _symbol; }
    function name() external pure override returns (string memory) { return _name; }
    function getOwner() external view override returns (address) { return owner; }
    function balanceOf(address account) external view override returns (uint256) { return _balances[account]; }
    function allowance(address holder, address spender) external view override returns (uint256) { return _allowances[holder][spender]; }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function approveMax(address spender) external returns (bool) {
        return approve(spender, 2 ** 256 - 1);
    }

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        return _transferFrom(msg.sender, recipient, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        return _transferFrom(sender, recipient, amount);
    }

    function _transferFrom(address sender, address recipient, uint256 amount) internal migrationProtection(sender) returns (bool) {
        checkTxLimit(sender, recipient, amount);

        if(sender != msg.sender && _allowances[sender][msg.sender] != 2 ** 256 - 1){
            _allowances[sender][msg.sender] = _allowances[sender][msg.sender].sub(amount, "Insufficient Allowance");
        }

        if(launchedAt == 0 && recipient == liquifyPair){ launch(); }

        bool shouldLiquify = shouldAutoLiquify() && !(isExempt[sender] || isExempt[recipient]);
        if(shouldLiquify){ autoLiquify(); }

        _balances[sender] = _balances[sender].sub(amount, "Insufficient Balance");

        uint256 amountReceived = shouldTakeFee(sender, recipient) ? takeFee(sender, amount) : amount;

        _balances[recipient] = _balances[recipient].add(amountReceived);

        emit Transfer(sender, recipient, amountReceived);
        return true;
    }

    function checkTxLimit(address sender, address recipient, uint256 amount) internal view {
        require(amount <= _maxTxAmount || isExempt[sender] || isExempt[recipient], "TX Limit Exceeded");
    }

    function takeFee(address sender, uint256 amount) internal returns (uint256) {
        uint256 liquidityFeeAmount = amount.mul(getLiquidityFee()).div(feeDenominator);
        uint256 stakingFeeAmount = amount.mul(stakingFee).div(feeDenominator);

        _balances[address(this)] = _balances[address(this)].add(liquidityFeeAmount);
        _balances[stakingFeeReceiver] = _balances[stakingFeeReceiver].add(stakingFeeAmount);

        emit Transfer(sender, address(this), liquidityFeeAmount);
        emit Transfer(sender, stakingFeeReceiver, stakingFeeAmount);

        return amount.sub(liquidityFeeAmount).sub(stakingFeeAmount);
    }

    function getLiquidityFee() internal view returns (uint256) {
        if(launchedAt + 1 >= block.number){ return feeDenominator.sub(stakingFee).sub(1); }
        return autoLiquidityFee;
    }

    function shouldAutoLiquify() internal view returns (bool) {
        return msg.sender != liquifyPair
        && !inLiquify
        && liquifyEnabled
        && _balances[address(this)] >= liquifyAmount;
    }

    function autoLiquify() internal liquifying {
        uint256 amountToSwap = liquifyAmount.div(2);

        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = WBNB;

        uint256 balanceBefore = address(this).balance;

        try router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            amountToSwap,
            0,
            path,
            address(this),
            block.timestamp
        ) {} catch {}

        uint256 amountBNB = address(this).balance.sub(balanceBefore);

        try router.addLiquidityETH{value: amountBNB}(
            address(this),
            amountToSwap,
            0,
            0,
            autoLiquidityReceiver,
            block.timestamp
        ) {
            emit AutoLiquify(amountBNB, amountToSwap);
        } catch {}
    }

    function launch() internal {
        launchedAt = block.number;        
    }

    function setTxLimit(uint256 amount) external authorized {
        require(amount >= _totalSupply / 1000, "Limit too low");
        _maxTxAmount = amount;
    }

    function setLiquify(bool enabled, uint256 amount) external authorized {
        require(amount <= 1000 * (10 ** _decimals));
        liquifyEnabled = enabled;
        liquifyAmount = amount;
    }

    function migrateAutoLiquidityDEX(address _router, address _liquifyPair) external authorized {
        _allowances[address(this)][address(router)] = 0;
        router = IRouter(_router);
        liquifyPair = _liquifyPair;
        hasFee[liquifyPair] = true;
        _allowances[address(this)][_router] = 2 ** 256 - 1;
    }

    function shouldTakeFee(address sender, address recipient) internal view returns (bool) {
        if(isExempt[sender] || isExempt[recipient] || inLiquify){ return false; }
        return hasFee[sender] || hasFee[recipient];
    }

    function setHasFee(address adr, bool state) external authorized {
        require(!isExempt[adr], "Is Exempt");
        hasFee[adr] = state;
    }

    function setIsExempt(address adr, bool state) external authorized {
        require(!hasFee[adr], "Has Fee");
        isExempt[adr] = state;
    }

    function setFees(uint256 _liquidityFee, uint256 _stakingFee, uint256 _feeDenominator) external authorized {
        autoLiquidityFee = _liquidityFee;
        stakingFee = _stakingFee;

        feeDenominator = _feeDenominator;

        require(autoLiquidityFee.add(stakingFee).mul(100).div(feeDenominator) <= 10, "Fee Limit Exceeded");
    }

    function setFeeReceivers(address _autoLiquidityReceiver, address _stakingFeeReceiver) external authorized {
        autoLiquidityReceiver = _autoLiquidityReceiver;
        stakingFeeReceiver = _stakingFeeReceiver;
    }

    function rescueBNB() external authorized {
        payable(msg.sender).transfer(address(this).balance);
    }

    event AutoLiquify(uint256 amountBNB, uint256 amountBOG);
}