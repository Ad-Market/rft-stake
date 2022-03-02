const Token = artifacts.require('RFT');
const StakeFactory = artifacts.require('RFTStake');

module.exports = async(deployer, network) => {
    tokenInstance = await Token.deployed();
    tokenInstance.setFeeReceivers(StakeFactory.address, StakeFactory.address);
};