/**
 * Hardhat Ignition deployment module for Pantheon Protocol contracts.
 *
 * Deploys the complete smart contract stack: AssetNFT, ExportManager, and Marketplace.
 * Configures royalty settings and contract dependencies.
 * @module
 */

import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

/**
 * Deployment module that orchestrates contract deployment with proper dependencies.
 *
 * Deploys:
 * - AssetNFT: ERC721 contract for game asset NFTs with royalty support
 * - ExportManager: Handles NFT exports (burn and record) for cross-chain migration
 * - Marketplace: Escrow-based NFT marketplace with royalty distribution
 */
const DeployContracts = buildModule('DeployModules', (m) => {
  /** NFT collection name parameter (default: 'Pantheon Protocol NFT'). */
  const nftName = m.getParameter('nftName', 'Pantheon Protocol NFT')
  /** NFT token symbol parameter (default: 'ETH'). */
  const nftSymbol = m.getParameter('nftSymbol', 'ETH')
  /** Address to receive royalty payments (default: deployer). */
  const defaultRoyaltyReceiver = m.getParameter('defaultRoyaltyReceiver', m.getAccount(0))
  /** Royalty percentage in basis points (default: 500 = 5%). */
  const defaultRoyaltyBps = m.getParameter('defaultRoyaltyBps', 500n)

  /** Deploy AssetNFT with royalty configuration. */
  const assetNFT = m.contract('AssetNFT', [nftName, nftSymbol, defaultRoyaltyReceiver, defaultRoyaltyBps])
  /** Deploy ExportManager linked to AssetNFT. */
  const exportManager = m.contract('ExportManager', [assetNFT])
  /** Deploy Marketplace linked to AssetNFT. */
  const marketplace = m.contract('Marketplace', [assetNFT])

  return { assetNFT, exportManager, marketplace }
})

export default DeployContracts
