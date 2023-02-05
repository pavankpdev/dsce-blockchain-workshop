import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import {BigNumber} from "ethers";

describe("Bank", () => {
    async function deployBank() {
        const [owner, otherAccount] = await ethers.getSigners();

        const Bank = await ethers.getContractFactory('Bank');
        const bank = await Bank.deploy();

        return {
            bank,
            owner,
            otherAccount
        }
    }

    describe("Deployment", () => {
        it("Owner address should match deployer", async () => {
            const {bank, owner} = await loadFixture(deployBank);

            expect(await bank.owner()).to.eq(owner.address);
        })
    })

    describe("Deposit", () => {
        it('should increase total funds of the bank', async () => {
            const {bank, owner} = await loadFixture(deployBank);

            const previousTotalFunds = await bank.getTotalFundsInTheBank();

            const amount = ethers.utils.parseEther('10')
            const deposit = await bank.deposit({value: amount});
            await deposit.wait()

            const currentTotalFunds = await bank.getTotalFundsInTheBank();

            expect(
                BigNumber.from(currentTotalFunds)
                    .gt(BigNumber.from(previousTotalFunds)))
                .is.true;
        });

        it("should increase user's balance", async () => {
            const {bank} = await loadFixture(deployBank);

            const previousBalance = await bank.getBalance();

            const amount = ethers.utils.parseEther('10')
            const deposit = await bank.deposit({
                value: amount,
            });
            await deposit.wait()

            const currentBalance = await bank.getBalance();

            expect(
                BigNumber.from(currentBalance)
                    .gt(BigNumber.from(previousBalance)))
                .is.true;
        })
    })

    describe("Withdraw", () => {
        const deposit = async () => {
            const {bank} = await loadFixture(deployBank);

            // Deposit some funds
            const amount = ethers.utils.parseEther('10')
            const deposit = await bank.deposit({value: amount});
            return deposit.wait()
        }


        it('should decrease total funds of the bank', async () => {
            const {bank, owner} = await loadFixture(deployBank);
            await deposit();

            const previousTotalFunds = await bank.getTotalFundsInTheBank();

            const amount = ethers.utils.parseEther('2')
            const withdraw = await bank.withdraw(amount);
            await withdraw.wait()

            const currentTotalFunds = await bank.getTotalFundsInTheBank();

            expect(
                BigNumber.from(currentTotalFunds)
                    .lte(BigNumber.from(previousTotalFunds)))
                .is.true;
        });

        it("should decrease user's balance", async () => {
            const {bank} = await loadFixture(deployBank);
            await deposit();

            const previousBalance = await bank.getBalance();

            const amount = ethers.utils.parseEther('2')
            const withdraw = await bank.withdraw(amount);
            await withdraw.wait()

            const currentBalance = await bank.getBalance();

            console.log(BigNumber.from(currentBalance).toString())
            console.log(BigNumber.from(previousBalance).toString())

            expect(
                BigNumber.from(currentBalance)
                    .lte(BigNumber.from(previousBalance)))
                .is.true;
        })
    })
})