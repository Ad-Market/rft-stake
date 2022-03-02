// SPDX-License-Identifier: MIT


pragma solidity ^0.8;

import "./Auth.sol";

abstract contract Pausable is Auth {

    bool public paused;

    constructor() {
        paused = false;
    }

    modifier notPaused {
        require(isPaused() == false || isAuthorized(msg.sender), "Contract is paused");
        _;
    }

    modifier onlyWhenPaused {
       require(isPaused() == true || isAuthorized(msg.sender), "Contract is active");
        _;
    }

    function pause() notPaused onlyOwner external {
        paused = true;
        emit Paused();
    }

    function unpause() onlyWhenPaused onlyOwner public {
        paused = false;
        emit Unpaused();
    }

    function isPaused() public view returns (bool) {
        return paused;
    }

    event Paused();
    event Unpaused();
}