/**
 * @module NFTInfoSection
 * Information display section for NFT cards showing key metadata.
 * Displays name, token ID, asset ID, listing price, and locked status.
 */

import {
  InfoLabel,
  InfoRow,
  InfoValue,
  NFTInfo,
  NFTTitle,
  WarningLabel
} from '@presentation/components/inventory/nft-card.styles'

/**
 * Props for NFTInfoSection component.
 * Contains NFT identification and status information for display.
 */
interface NFTInfoSectionProps {
  name: string
  tokenId: number
  assetId?: number
  formattedListingPrice?: string
  isLocked?: boolean
}

/**
 * Renders NFT information including name, IDs, price, and locked warning.
 * Conditionally displays fields based on NFT state and available data.
 */
export const NFTInfoSection = ({ name, tokenId, assetId, formattedListingPrice, isLocked }: NFTInfoSectionProps) => {
  return (
    <>
      <NFTTitle>{name}</NFTTitle>
      <NFTInfo>
        <InfoRow>
          <InfoLabel>Token ID:</InfoLabel>
          <InfoValue>#{tokenId}</InfoValue>
        </InfoRow>
        {assetId && (
          <InfoRow>
            <InfoLabel>Asset ID:</InfoLabel>
            <InfoValue>{assetId}</InfoValue>
          </InfoRow>
        )}
        {formattedListingPrice && (
          <InfoRow>
            <InfoLabel>Price:</InfoLabel>
            <InfoValue>{formattedListingPrice} ETH</InfoValue>
          </InfoRow>
        )}
      </NFTInfo>
      {isLocked && (
        <InfoRow>
          <WarningLabel>This NFT is locked for export to target game</WarningLabel>
        </InfoRow>
      )}
    </>
  )
}
