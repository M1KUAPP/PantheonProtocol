import { parseAbi } from 'viem'

/**
 * ABI for the AssetNFT ERC-721 smart contract.
 *
 * This contract handles minting game assets as NFTs on the blockchain.
 * It extends standard ERC-721 functionality with game-specific features
 * like source asset ID tracking and batch data retrieval.
 *
 * Key functions:
 * - mint: Creates a new NFT from a game asset
 * - getUserInventory: Retrieves all NFTs owned by a user
 * - getBatchNFTData: Fetches data for multiple NFTs efficiently
 * - assetIdOf: Maps token ID to original game asset ID
 */
export const ASSET_NFT_ABI = parseAbi([
  'function balanceOf(address owner) external view returns (uint256)',
  'function mint(string memory tokenURI_, uint256 sourceAssetId) external returns (uint256 tokenId)',
  'function tokenURI(uint256 tokenId) external view returns (string memory)',
  'function assetIdOf(uint256 tokenId) external view returns (uint256)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function approve(address to, uint256 tokenId) external',
  'function setApprovalForAll(address operator, bool approved) external',
  'function getApproved(uint256 tokenId) external view returns (address)',
  'function isApprovedForAll(address owner, address operator) external view returns (bool)',
  'function totalMinted() external view returns (uint256)',
  'function nextTokenId() external view returns (uint256)',
  'function getUserInventory(address user) external view returns ((uint256 tokenId, address owner, string tokenURI, uint256 assetId, bool exists)[])',
  'function getBatchNFTData(uint256[] calldata tokenIds) external view returns ((uint256 tokenId, address owner, string tokenURI, uint256 assetId, bool exists)[])',
  'event Minted(uint256 indexed tokenId, address indexed to, uint256 indexed assetId, string tokenURI_)',
  'event Burned(uint256 indexed tokenId, address indexed by, uint256 indexed assetId)'
])

/**
 * ABI for the NFT Marketplace smart contract.
 *
 * Enables peer-to-peer trading of NFTs with built-in royalty support.
 * Sellers can list NFTs at a fixed price, and buyers can purchase them
 * directly through the contract.
 *
 * Key functions:
 * - list: Creates a new marketplace listing for an NFT
 * - buy: Purchases a listed NFT (requires ETH payment)
 * - cancel: Removes an active listing
 * - getAllActiveListingsWithNFTData: Fetches all active listings with metadata
 */
export const MARKETPLACE_ABI = parseAbi([
  'function list(uint256 tokenId, uint256 priceWei) external',
  'function cancel(uint256 listingId) external',
  'function buy(uint256 listingId) external payable',
  'function listings(uint256 listingId) external view returns (uint256 id, uint256 tokenId, address seller, uint256 priceWei, bool active)',
  'function tokenToListing(uint256 tokenId) external view returns (uint256)',
  'function isTokenListed(uint256 tokenId) external view returns (bool)',
  'function listingCount() external view returns (uint256)',
  'function getUserListingsWithNFTData(address seller) external view returns ((uint256 listingId, uint256 tokenId, address seller, uint256 price, bool active, address nftOwner, string tokenURI, uint256 assetId, bool nftExists)[])',
  'function getAllActiveListingsWithNFTData() external view returns ((uint256 listingId, uint256 tokenId, address seller, uint256 price, bool active, address nftOwner, string tokenURI, uint256 assetId, bool nftExists)[])',
  'event Listed(uint256 indexed listingId, uint256 indexed tokenId, address indexed seller, uint256 priceWei, uint256 totalListings)',
  'event Cancelled(uint256 indexed listingId, uint256 totalListings)',
  'event Bought(uint256 indexed listingId, address indexed buyer, uint256 priceWei, uint256 royaltyWei, uint256 totalListings)'
])

/**
 * ABI for the Export Manager smart contract.
 *
 * Handles exporting NFTs back to the game system or to other blockchain networks.
 * When an NFT is exported, it is burned on the current chain and can be
 * recreated as a game asset or on the target chain.
 *
 * Key functions:
 * - exportToChain: Initiates the export process for an NFT
 * - exports: Retrieves export details for a token
 * - getUserExportCount: Gets the number of exports by a user
 */
export const EXPORT_MANAGER_ABI = parseAbi([
  'function exportToChain(uint256 tokenId, uint256 targetChainId) external',
  'function exports(uint256 tokenId) external view returns (address exporter, uint256 targetChainId, uint256 exportedAt, string tokenURI)',
  'function exportCount() external view returns (uint256)',
  'function getUserExportCount(address user) external view returns (uint256)',
  'event Exported(uint256 indexed tokenId, address indexed exporter, uint256 indexed targetChainId, string tokenURI, uint256 exportNumber)'
])
