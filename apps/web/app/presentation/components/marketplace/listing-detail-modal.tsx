/**
 * @module listing-detail-modal
 * Modal component that displays detailed information about a marketplace listing.
 * Allows users to view NFT details, seller information, and purchase the item.
 */

import type { ListingDTO } from '@application/dtos/listing.dto'
import { createAppConfig } from '@config/app-config'
import type { NFTAttribute } from '@core/entities/nft.entity'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CustomBackdrop } from '@presentation/components/common/backdrop'
import { CopyToClipboard } from '@presentation/components/common/copy-to-clipboard'
import {
  BuyButton,
  CloseButton,
  Description,
  ImageColumn,
  InfoBlock,
  InfoColumn,
  InfoGrid,
  InfoLabel,
  InfoValue,
  ModalBody,
  ModalContent,
  ModalHeader,
  PriceContainer,
  PriceValue,
  SellerAddress,
  SellerAvatar,
  SellerDetails,
  SellerInfo,
  SellerLabel,
  Title
} from '@presentation/components/marketplace/listing-detail-modal.styles'
import { useWalletConnectionViewModel } from '@presentation/view-models/wallet/wallet-connection.vm'

type PurchaseState = 'idle' | 'confirming' | 'sold'

/**
 * Props for the ListingDetailModal component.
 * Manages the display and purchase state of a marketplace listing.
 */
interface ListingDetailModalProps {
  listing: ListingDTO | null
  purchaseState: PurchaseState
  isPurchasePending: boolean
  onConfirm: () => void
  onClose: () => void
}

const formatAddress = (address: string): string => {
  if (!address || address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-6)}`
}

/**
 * Modal component for displaying detailed information about a marketplace listing.
 * Shows NFT image, metadata, attributes, seller information, and purchase controls.
 */
export const ListingDetailModal = ({
  listing,
  purchaseState,
  isPurchasePending,
  onConfirm,
  onClose
}: ListingDetailModalProps) => {
  const { address: userAddress, isProperlyConnected } = useWalletConnectionViewModel()
  const appConfig = createAppConfig()
  if (!listing) return null
  const isOwner = isProperlyConnected && userAddress?.toLowerCase() === listing.seller.toLowerCase()
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  const getButtonText = () => {
    if (isOwner) return 'Cannot Buy Own Item'
    if (isPurchasePending) return 'Confirm in Wallet...'
    switch (purchaseState) {
      case 'confirming':
        return 'Confirm'
      case 'sold':
        return 'Sold'
      case 'idle':
      default:
        return 'Buy Now'
    }
  }
  return (
    <CustomBackdrop onClick={handleBackdropClick}>
      <ModalContent>
        <ModalHeader>
          <CloseButton onClick={onClose}>
            <XMarkIcon width={24} height={24} />
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          <ImageColumn>
            <img src={listing.metadata.image_path} alt={listing.metadata.name} />
            <SellerInfo>
              <SellerLabel>Seller</SellerLabel>
              <SellerDetails>
                <SellerAvatar src={appConfig.getAvatarUrl(listing.seller.value)} alt="Seller avatar" />
                <SellerAddress>{formatAddress(listing.seller.value)}</SellerAddress>
                <CopyToClipboard textToCopy={listing.seller.value} />
              </SellerDetails>
            </SellerInfo>
          </ImageColumn>
          <InfoColumn>
            <Title>{listing.metadata.name}</Title>
            <Description>{listing.metadata.description}</Description>
            <InfoGrid>
              <InfoBlock>
                <InfoLabel>Item Type</InfoLabel>
                <InfoValue>{listing.metadata.itemType}</InfoValue>
              </InfoBlock>
              <InfoBlock>
                <InfoLabel>Rarity</InfoLabel>
                <InfoValue>{listing.metadata.rarity}</InfoValue>
              </InfoBlock>
              {listing.metadata.attributes.map((attr: NFTAttribute) => (
                <InfoBlock key={attr.trait_type}>
                  <InfoLabel>{attr.trait_type}</InfoLabel>
                  <InfoValue>{String(attr.value)}</InfoValue>
                </InfoBlock>
              ))}
            </InfoGrid>
            <PriceContainer>
              <InfoLabel>Price</InfoLabel>
              <PriceValue>{listing.formattedPrice} ETH</PriceValue>
              <BuyButton
                onClick={onConfirm}
                $state={purchaseState}
                disabled={isPurchasePending || purchaseState === 'sold' || isOwner}
              >
                {getButtonText()}
              </BuyButton>
            </PriceContainer>
          </InfoColumn>
        </ModalBody>
      </ModalContent>
    </CustomBackdrop>
  )
}
