// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Bank {
    mapping(address => uint) private balances;
    uint256 private totalFunds;
    address public owner;

    modifier onlyOwner () {
        require(owner == msg.sender, "Error: caller is not an owner!");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
        totalFunds += msg.value;
    }

    function withdraw(uint amount) external {
        require(balances[msg.sender] >= amount, "Insufficient funds");
        balances[msg.sender] -= amount;
        totalFunds -= amount;
        payable(msg.sender).transfer(amount);
    }

    function getBalance() external view returns (uint) {
        return balances[msg.sender];
    }

    function getTotalFundsInTheBank() external view onlyOwner returns (uint256) {
        return totalFunds;
    }
}