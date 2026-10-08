// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import {ERC721URIStorage} from '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import {ERC721Royalty} from '@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol';
import {AccessControl} from '@openzeppelin/contracts/access/AccessControl.sol';
import {Pausable} from '@openzeppelin/contracts/utils/Pausable.sol';
import {IBurnableNFT} from './IBurnableNFT.sol';

/**
 * @title AssetNFT
 * @notice ERC721 NFT contract for tokenizing game assets with royalty support.
 * @dev Extends OpenZeppelin's ERC721 with URI storage, royalties, access control, and pausability.
 *      Each NFT is linked to a source game asset ID for cross-game interoperability.
 */
contract AssetNFT is ERC721, ERC721URIStorage, ERC721Royalty, AccessControl, Pausable, IBurnableNFT {
  /**
   * @notice Initializes the NFT contract with name, symbol, and royalty configuration.
   * @param name_ Collection name for the NFT.
   * @param symbol_ Token symbol.
   * @param defaultRoyaltyReceiver Address to receive royalty payments.
   * @param defaultRoyaltyBps Royalty percentage in basis points (e.g., 500 = 5%).
   */
  constructor(
    string memory name_,
    string memory symbol_,
    address defaultRoyaltyReceiver,
    uint96 defaultRoyaltyBps
  ) ERC721(name_, symbol_) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setDefaultRoyalty(defaultRoyaltyReceiver, defaultRoyaltyBps);
    _nextTokenId = 1;
  }

  /// @notice Pauses all minting operations. Only callable by admin.
  function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _pause();
  }

  /// @notice Resumes minting operations. Only callable by admin.
  function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _unpause();
  }

  /// @dev Counter for generating sequential token IDs.
  uint256 private _nextTokenId;

  /// @dev Maps token ID to its source game asset ID.
  mapping(uint256 => uint256) private _assetIdByToken;

  /**
   * @notice Data structure containing complete NFT information.
   * @dev Used by inventory and batch query functions.
   */
  struct NFTData {
    uint256 tokenId;
    address owner;
    string tokenURI;
    uint256 assetId;
    bool exists;
  }

  /// @notice Emitted when a new NFT is minted from a game asset.
  event Minted(uint256 indexed tokenId, address indexed to, uint256 indexed assetId, string tokenURI_);
  /// @notice Emitted when an NFT is burned (destroyed).
  event Burned(uint256 indexed tokenId, address indexed by, uint256 indexed assetId);

  /// @notice Returns the next token ID that will be assigned.
  function nextTokenId() external view returns (uint256) {
    return _nextTokenId;
  }

  /// @notice Returns the total number of NFTs minted (including burned).
  function totalMinted() external view returns (uint256) {
    return _nextTokenId - 1;
  }

  /**
   * @notice Retrieves all NFTs owned by a specific address.
   * @param user The address to query NFTs for.
   * @return Array of NFTData structs containing token information.
   */
  function getUserInventory(address user) external view returns (NFTData[] memory) {
    uint256 totalSupply = _nextTokenId - 1;
    uint256 userBalance = balanceOf(user);
    if (userBalance == 0) return new NFTData[](0);
    NFTData[] memory userNFTs = new NFTData[](userBalance);
    uint256 currentIndex = 0;

    for (uint256 tokenId = 1; tokenId <= totalSupply; tokenId++) {
      address owner = _ownerOf(tokenId);
      if (owner == user) {
        userNFTs[currentIndex] = NFTData({
          tokenId: tokenId,
          owner: owner,
          tokenURI: tokenURI(tokenId),
          assetId: _assetIdByToken[tokenId],
          exists: true
        });
        currentIndex++;
        if (currentIndex >= userBalance) {
          break;
        }
      }
    }

    return userNFTs;
  }

  /**
   * @notice Retrieves NFT data for multiple tokens in a single call.
   * @param tokenIds Array of token IDs to query.
   * @return Array of NFTData structs with token information.
   */
  function getBatchNFTData(uint256[] calldata tokenIds) external view returns (NFTData[] memory) {
    NFTData[] memory nftDataArray = new NFTData[](tokenIds.length);

    for (uint256 i = 0; i < tokenIds.length; i++) {
      uint256 tokenId = tokenIds[i];
      address owner = _ownerOf(tokenId);
      bool exists = owner != address(0);
      nftDataArray[i] = NFTData({
        tokenId: tokenId,
        owner: owner,
        tokenURI: exists ? tokenURI(tokenId) : '',
        assetId: exists ? _assetIdByToken[tokenId] : 0,
        exists: exists
      });
    }

    return nftDataArray;
  }

  /**
   * @notice Mints a new NFT linked to a game asset.
   * @param tokenURI_ IPFS or HTTP URI pointing to token metadata.
   * @param sourceAssetId The game asset ID this NFT represents.
   * @return tokenId The newly minted token's ID.
   */
  function mint(string memory tokenURI_, uint256 sourceAssetId) external whenNotPaused returns (uint256 tokenId) {
    tokenId = _nextTokenId++;
    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, tokenURI_);
    _assetIdByToken[tokenId] = sourceAssetId;

    emit Minted(tokenId, msg.sender, sourceAssetId, tokenURI_);
  }

  /**
   * @notice Burns (destroys) a token permanently.
   * @dev Caller must be owner or approved. Used during NFT export to another chain.
   * @param tokenId The ID of the token to burn.
   */
  function burn(uint256 tokenId) external {
    address owner = _ownerOf(tokenId);
    require(owner != address(0), 'ERC721: nonexistent token');
    require(
      msg.sender == owner || getApproved(tokenId) == msg.sender || isApprovedForAll(owner, msg.sender),
      'Not authorized to burn'
    );

    uint256 assetId = _assetIdByToken[tokenId];
    delete _assetIdByToken[tokenId];
    _burn(tokenId);

    emit Burned(tokenId, msg.sender, assetId);
  }

  /**
   * @notice Returns the game asset ID associated with a token.
   * @param tokenId The token ID to query.
   * @return The source game asset ID.
   */
  function assetIdOf(uint256 tokenId) external view returns (uint256) {
    require(_ownerOf(tokenId) != address(0), 'ERC721: nonexistent token');

    return _assetIdByToken[tokenId];
  }

  /// @inheritdoc ERC721
  function supportsInterface(
    bytes4 interfaceId
  ) public view override(ERC721, ERC721URIStorage, ERC721Royalty, AccessControl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  /// @inheritdoc ERC721URIStorage
  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return ERC721URIStorage.tokenURI(tokenId);
  }
}
