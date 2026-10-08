// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IBurnableNFT
 * @notice Interface for NFT contracts that support token burning.
 * @dev Implemented by AssetNFT, used by ExportManager to burn tokens during export.
 */
interface IBurnableNFT {
  /**
   * @notice Burns (destroys) a token permanently.
   * @dev Caller must be owner or approved operator.
   * @param tokenId The ID of the token to burn.
   */
  function burn(uint256 tokenId) external;
}
