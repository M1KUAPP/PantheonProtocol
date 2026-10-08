import '@nomicfoundation/hardhat-toolbox-viem'
import type { HardhatUserConfig } from 'hardhat/config'

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.28',
    settings: { evmVersion: 'cancun' }
  },
  networks: {
    localhost: {
      chainId: 31337,
      url: 'http://127.0.0.1:8545'
    }
  }
}

export default config
