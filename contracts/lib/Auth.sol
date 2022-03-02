// SPDX-License-Identifier: MIT


pragma solidity ^0.8;


abstract contract Auth{

    address owner;

    mapping (address => bool) private authorizations;

    constructor(address _owner){
        owner = _owner;
        authorizations[owner] = true;
    }

    modifier onlyOwner{
        require(isOwner(msg.sender), "Only owner can call this function");
        _;
    }

    modifier authorized{
        require(isAuthorized(msg.sender), "Only authorized users can call this function");
        _;
    }

    function isAuthorized(address _account) public view returns (bool){
        return authorizations[_account];
    }

    function isOwner(address account) private view returns (bool){
        return account == owner;
    }

    function authorize(address _account) external authorized{
        authorizations[_account] = true;
    }

    function revoke(address _account) external onlyOwner{
        authorizations[_account] = false;
    }

    function transferOwnership(address payable adr) public onlyOwner {
        owner = adr;
        authorizations[adr] = true;
        emit OwnershipTransferred(adr);
    }

    event OwnershipTransferred(address owner);
    event Authorized(address adr);
    event Unauthorized(address adr);

}