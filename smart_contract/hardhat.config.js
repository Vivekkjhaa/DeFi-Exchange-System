require('@nomiclabs/hardhat-waffle');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.29",
  networks: {
    Cardona: {
      url: 'https://polygonzkevm-cardona.g.alchemy.com/v2/H8xy7obp8dK2CBkDVA5VvAbbZEUXkiuo',
      accounts: ['dc0510f127262eb95ad00e1931a5be459f4bf3931c9fda2db082df0159245503']
    }

  }
};


