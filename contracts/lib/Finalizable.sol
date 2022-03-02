// SPDX-License-Identifier: MIT

pragma solidity ^0.8;

import "./Auth.sol";

abstract contract Finalizable is Auth {
    bool public isFinalized;

    modifier unfinalized() {
        require(!isFinalized, "FINALIZED"); _;
    }

    modifier finalized() {
        require(isFinalized, "!FINALIZED"); _;
    }

    function finalize() public authorized unfinalized {
        isFinalized = true;
        emit Finalized();
    }

    event Finalized();
}
