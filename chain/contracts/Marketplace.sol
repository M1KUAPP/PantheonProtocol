// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {IERC721Metadata} from '@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol';
import {IERC2981} from '@openzeppelin/contracts/interfaces/IERC2981.sol';
import {ERC165} from '@openzeppelin/contracts/utils/introspection/ERC165.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {ReentrancyGuard} from '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import {Pausable} from '@openzeppelin/contracts/utils/Pausable.sol';
import {IAssetNFT} from './IAssetNFT.sol';

/**
 * @title Marketplace
 * @notice NFT marketplace contract for listing, buying, and selling game asset NFTs.
 * @dev Supports ERC2981 royalties, escrow-based listings, and batch data queries.
 *      NFTs are held in escrow by the marketplace contract while listed.
 */
contract Marketplace is Ownable, ReentrancyGuard, Pausable, ERC165 {
  /**
   * @notice Initializes the marketplace with the NFT contract address.
   * @param nft_ Address of the AssetNFT contract to trade.
   */
  constructor(address nft_) Ownable(msg.sender) {
    nft = IERC721(nft_);
    meta = IERC721Metadata(nft_);
    royalties = IERC2981(nft_);
    _nextListingId = 1;
  }

  /// @notice Pauses all marketplace operations. Only callable by owner.
  function pause() external onlyOwner {
    _pause();
  }

  /// @notice Resumes marketplace operations. Only callable by owner.
  function unpause() external onlyOwner {
    _unpause();
  }

  /// @dev Counter for generating sequential listing IDs.
  uint256 private _nextListingId;
  /// @notice Current number of active listings.
  uint256 public listingCount;
  /// @notice Reference to the ERC721 NFT contract.
  IERC721 public immutable nft;
  /// @notice Reference to the ERC721 metadata interface.
  IERC721Metadata public immutable meta;
  /// @notice Reference to the ERC2981 royalty interface.
  IERC2981 public immutable royalties;

  /// @dev Maps listing ID to listing data.
  mapping(uint256 => Listing) public listings;
  /// @dev Maps token ID to its current listing ID (0 if not listed).
  mapping(uint256 => uint256) public tokenToListing;

  /// @notice Basic listing data structure.
  struct Listing {
    uint256 id;
    uint256 tokenId;
    address seller;
    uint256 priceWei;
    bool active;
  }

  /// @notice Extended listing data including NFT metadata for UI display.
  struct ListingWithNFTData {
    uint256 listingId;
    uint256 tokenId;
    address seller;
    uint256 price;
    bool active;
    address nftOwner;
    string tokenURI;
    uint256 assetId;
    bool nftExists;
  }

  /// @notice Emitted when an NFT is listed for sale.
  event Listed(
    uint256 indexed listingId,
    uint256 indexed tokenId,
    address indexed seller,
    uint256 priceWei,
    uint256 totalListings
  );
  /// @notice Emitted when a listing is cancelled by the seller.
  event Cancelled(uint256 indexed listingId, uint256 totalListings);
  /// @notice Emitted when an NFT is purchased from a listing.
  event Bought(
    uint256 indexed listingId,
    address indexed buyer,
    uint256 priceWei,
    uint256 royaltyWei,
    uint256 totalListings
  );

  /**
   * @notice Checks if a token is currently listed for sale.
   * @param tokenId The token ID to check.
   * @return True if the token has an active listing.
   */
  function isTokenListed(uint256 tokenId) external view returns (bool) {
    uint256 listingId = tokenToListing[tokenId];

    return listingId > 0 && listings[listingId].active;
  }

  /**
   * @notice Retrieves all active listings for a specific seller with NFT metadata.
   * @param seller Address of the seller to query.
   * @return Array of ListingWithNFTData structs containing listing and NFT information.
   */
  function getUserListingsWithNFTData(address seller) external view returns (ListingWithNFTData[] memory) {
    uint256 totalListings = _nextListingId - 1;
    uint256 userListingCount = 0;

    for (uint256 i = 1; i <= totalListings; i++) {
      if (listings[i].active && listings[i].seller == seller) userListingCount++;
    }

    if (userListingCount == 0) return new ListingWithNFTData[](0);
    uint256[] memory tokenIds = new uint256[](userListingCount);
    Listing[] memory userListings = new Listing[](userListingCount);
    uint256 currentIndex = 0;

    for (uint256 i = 1; i <= totalListings; i++) {
      Listing memory listing = listings[i];
      if (listing.active && listing.seller == seller) {
        tokenIds[currentIndex] = listing.tokenId;
        userListings[currentIndex] = listing;
        currentIndex++;
        if (currentIndex >= userListingCount) {
          break;
        }
      }
    }

    IAssetNFT.NFTData[] memory nftDataArray = IAssetNFT(address(nft)).getBatchNFTData(tokenIds);
    ListingWithNFTData[] memory result = new ListingWithNFTData[](userListingCount);

    for (uint256 i = 0; i < userListingCount; i++) {
      result[i] = ListingWithNFTData({
        listingId: userListings[i].id,
        tokenId: userListings[i].tokenId,
        seller: userListings[i].seller,
        price: userListings[i].priceWei,
        active: userListings[i].active,
        nftOwner: nftDataArray[i].owner,
        tokenURI: nftDataArray[i].tokenURI,
        assetId: nftDataArray[i].assetId,
        nftExists: nftDataArray[i].exists
      });
    }

    return result;
  }

  /**
   * @notice Retrieves all active listings with NFT metadata.
   * @return Array of ListingWithNFTData structs for all active marketplace listings.
   */
  function getAllActiveListingsWithNFTData() external view returns (ListingWithNFTData[] memory) {
    uint256 totalListings = _nextListingId - 1;
    uint256 activeListingCount = 0;

    for (uint256 i = 1; i <= totalListings; i++) {
      if (listings[i].active) activeListingCount++;
    }

    if (activeListingCount == 0) return new ListingWithNFTData[](0);
    uint256[] memory tokenIds = new uint256[](activeListingCount);
    Listing[] memory activeListings = new Listing[](activeListingCount);
    uint256 currentIndex = 0;

    for (uint256 i = 1; i <= totalListings; i++) {
      Listing memory listing = listings[i];
      if (listing.active) {
        tokenIds[currentIndex] = listing.tokenId;
        activeListings[currentIndex] = listing;
        currentIndex++;
        if (currentIndex >= activeListingCount) break;
      }
    }

    IAssetNFT.NFTData[] memory nftDataArray = IAssetNFT(address(nft)).getBatchNFTData(tokenIds);
    ListingWithNFTData[] memory result = new ListingWithNFTData[](activeListingCount);

    for (uint256 i = 0; i < activeListingCount; i++) {
      result[i] = ListingWithNFTData({
        listingId: activeListings[i].id,
        tokenId: activeListings[i].tokenId,
        seller: activeListings[i].seller,
        price: activeListings[i].priceWei,
        active: activeListings[i].active,
        nftOwner: nftDataArray[i].owner,
        tokenURI: nftDataArray[i].tokenURI,
        assetId: nftDataArray[i].assetId,
        nftExists: nftDataArray[i].exists
      });
    }

    return result;
  }

  /**
   * @notice Lists an NFT for sale on the marketplace.
   * @dev Transfers the NFT to the marketplace contract for escrow.
   * @param tokenId The token ID to list.
   * @param priceWei The listing price in wei.
   */
  function list(uint256 tokenId, uint256 priceWei) external whenNotPaused nonReentrant {
    require(tokenToListing[tokenId] == 0, 'Already listed');
    require(nft.ownerOf(tokenId) == msg.sender, 'Not owner');
    require(priceWei > 0, 'Price=0');

    nft.transferFrom(msg.sender, address(this), tokenId);
    uint256 id = _nextListingId++;
    listings[id] = Listing({id: id, tokenId: tokenId, seller: msg.sender, priceWei: priceWei, active: true});
    tokenToListing[tokenId] = id;
    listingCount++;

    emit Listed(id, tokenId, msg.sender, priceWei, listingCount);
  }

  /**
   * @notice Cancels a listing and returns the NFT to the seller.
   * @dev Only the original seller can cancel their listing.
   * @param listingId The ID of the listing to cancel.
   */
  function cancel(uint256 listingId) external whenNotPaused nonReentrant {
    Listing storage l = listings[listingId];
    require(l.active, 'Inactive');
    require(l.seller == msg.sender, 'Not seller');

    l.active = false;
    tokenToListing[l.tokenId] = 0;
    listingCount--;
    nft.safeTransferFrom(address(this), l.seller, l.tokenId);

    emit Cancelled(listingId, listingCount);
  }

  /**
   * @notice Purchases an NFT from an active listing.
   * @dev Handles royalty distribution, seller payment, and NFT transfer.
   * @param listingId The ID of the listing to purchase.
   */
  function buy(uint256 listingId) external payable whenNotPaused nonReentrant {
    Listing storage l = listings[listingId];
    require(l.active, 'Inactive');
    require(msg.value == l.priceWei, 'Bad price');

    l.active = false;
    tokenToListing[l.tokenId] = 0;
    listingCount--;
    (address royaltyReceiver, uint256 royaltyAmount) = royalties.royaltyInfo(l.tokenId, l.priceWei);
    uint256 sellerProceeds = l.priceWei - royaltyAmount;

    if (royaltyAmount > 0 && royaltyReceiver != address(0)) {
      (bool okR, ) = payable(royaltyReceiver).call{value: royaltyAmount}('');
      require(okR, 'Royalty xfer failed');
    }

    (bool okS, ) = payable(l.seller).call{value: sellerProceeds}('');
    require(okS, 'Seller xfer failed');
    nft.safeTransferFrom(address(this), msg.sender, l.tokenId);

    emit Bought(listingId, msg.sender, l.priceWei, royaltyAmount, listingCount);
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
