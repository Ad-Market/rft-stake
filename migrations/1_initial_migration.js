const Token = artifacts.require('RFT');
const StakeFactory = artifacts.require('RFTStake');

module.exports = async(deployer, network) => {
    deployer.deploy(Token, '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3').then(function() {
      return deployer.deploy(StakeFactory, Token.address, Token.address);
    });
};