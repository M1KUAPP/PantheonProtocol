// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IAssetNFT
 * @notice Interface for querying batch NFT data from the AssetNFT contract.
 * @dev Used by Marketplace contract to fetch NFT metadata for listings.
 */
interface IAssetNFT {
  /**
   * @notice Data structure containing complete NFT information.
   * @dev Returned by batch query functions for efficient data retrieval.
   */
  struct NFTData {
    uint256 tokenId;
    address owner;
    string tokenURI;
    uint256 assetId;
    bool exists;
  }

  /**
   * @notice Retrieves NFT data for multiple tokens in a single call.
   * @param tokenIds Array of token IDs to query.
   * @return Array of NFTData structs with token information.
   */
  function getBatchNFTData(uint256[] calldata tokenIds) external view returns (NFTData[] memory);
}
