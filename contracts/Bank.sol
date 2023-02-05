// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Bank {
    mapping(address => uint) private balances;
    uint256 private totalFunds;
    address private owner;

    modifier onlyOwner (address caller) {
        require(caller == owner, "Error: caller is not an owner!");
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint amount) public {
        require(balances[msg.sender] >= amount, "Insufficient funds");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }

    function getTotalFundsInTheBank() returns (uint256) {
        return totalFunds;
    }
}