// SPDX-License-Identifier: MIT

pragma solidity ^0.8;

import "../interfaces/IBEP20.sol";
import "../libraries/SafeMath.sol";

/**
 * Implement the basic BEP20 functions
 */
abstract contract BEP20 is IBEP20 {
    using SafeMath for uint256;

    mapping (address => uint256) internal _balances;
    mapping (address => mapping (address => uint256)) internal _allowances;

    uint256 internal _totalSupply = 0;
    
    string internal _name;
    string internal _symbol;
    uint8 internal _decimals = 18;

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }
    
    function name() public view override returns (string memory) {
        return _name;
    }
    
    function symbol() public view override returns (string memory) {
        return _symbol;
    }
    
    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}