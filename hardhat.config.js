require('@nomicfoundation/hardhat-toolbox');

const ALCHEMY_API_KEY = 'K8UOw3gOxVJ4aXad9-fu4Bywm5vSVukt'

const GOERLI_PRIVATE_KEY = 'b7ee811dcb31937b210db918d7e6ae378077246118a77f250c12ba48f2d0042e';


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.9",
    optimizer: {
      enabled: true,
      runs: 200,
    }
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: {
      goerli: '7WQ8VKX9GV4RKPVCI7C1371M9BADGK9JC2'
    }
  }
};
