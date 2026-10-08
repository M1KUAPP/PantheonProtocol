// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {IERC721Metadata} from '@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol';
import {ERC165} from '@openzeppelin/contracts/utils/introspection/ERC165.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {ReentrancyGuard} from '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import {Pausable} from '@openzeppelin/contracts/utils/Pausable.sol';
import {IBurnableNFT} from './IBurnableNFT.sol';

/**
 * @title ExportManager
 * @notice Manages NFT exports from this chain by burning tokens and recording export data.
 * @dev Burns NFTs and stores export records for cross-chain asset migration.
 *      The token is destroyed on this chain and can be re-minted on the target chain.
 */
contract ExportManager is Ownable, ReentrancyGuard, Pausable, ERC165 {
  /**
   * @notice Initializes the export manager with the NFT contract address.
   * @param nft_ Address of the AssetNFT contract to manage exports for.
   */
  constructor(address nft_) Ownable(msg.sender) {
    nft = IERC721(nft_);
    meta = IERC721Metadata(nft_);
    burnable = IBurnableNFT(nft_);
  }

  /// @notice Pauses all export operations. Only callable by owner.
  function pause() external onlyOwner {
    _pause();
  }

  /// @notice Resumes export operations. Only callable by owner.
  function unpause() external onlyOwner {
    _unpause();
  }

  /// @notice Total number of NFTs exported through this contract.
  uint256 public exportCount;
  /// @notice Reference to the burnable NFT interface.
  IBurnableNFT public immutable burnable;
  /// @notice Reference to the ERC721 NFT contract.
  IERC721 public immutable nft;
  /// @notice Reference to the ERC721 metadata interface.
  IERC721Metadata public immutable meta;

  /// @dev Maps token ID to its export record.
  mapping(uint256 => ExportRecord) public exports;
  /// @dev Maps user address to their total export count.
  mapping(address => uint256) public userExportCounts;

  /**
   * @notice Record of an exported NFT containing all relevant data.
   * @dev Stored permanently for cross-chain verification.
   */
  struct ExportRecord {
    address exporter;
    uint256 targetChainId;
    uint256 exportedAt;
    string tokenURI;
  }

  /// @notice Emitted when an NFT is exported and burned.
  event Exported(
    uint256 indexed tokenId,
    address indexed exporter,
    uint256 indexed targetChainId,
    string tokenURI,
    uint256 exportNumber
  );

  /**
   * @notice Returns the number of NFTs a user has exported.
   * @param user Address to query.
   * @return Number of exports by the user.
   */
  function getUserExportCount(address user) external view returns (uint256) {
    return userExportCounts[user];
  }

  /**
   * @notice Exports an NFT to another chain by burning it and recording export data.
   * @dev The NFT is transferred to this contract then burned. Export record is stored permanently.
   * @param tokenId The ID of the token to export.
   * @param targetChainId The chain ID where the NFT will be re-minted.
   */
  function exportToChain(uint256 tokenId, uint256 targetChainId) external whenNotPaused nonReentrant {
    address owner = nft.ownerOf(tokenId);
    require(owner == msg.sender, 'Not owner');

    string memory tokenURI = meta.tokenURI(tokenId);
    nft.transferFrom(msg.sender, address(this), tokenId);
    burnable.burn(tokenId);
    exportCount++;
    userExportCounts[msg.sender]++;
    exports[tokenId] = ExportRecord({
      exporter: msg.sender,
      targetChainId: targetChainId,
      exportedAt: block.timestamp,
      tokenURI: tokenURI
    });

    emit Exported(tokenId, msg.sender, targetChainId, tokenURI, exportCount);
  }

  /// @notice Returns the NFT balance of an address (proxy to NFT contract).
  function balanceOf(address owner) external view returns (uint256) {
    return nft.balanceOf(owner);
  }

  /// @notice Returns the NFT symbol (proxy to NFT contract).
  function symbol() external view returns (string memory) {
    return meta.symbol();
  }

  /// @notice Returns 0 decimals (NFTs are non-divisible).
  function decimals() external pure returns (uint8) {
    return 0;
  }

  /// @inheritdoc ERC165
  function supportsInterface(bytes4 interfaceId) public view override(ERC165) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
