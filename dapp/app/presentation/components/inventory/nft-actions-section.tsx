/**
 * @module NFTActionsSection
 * Action buttons and controls for NFT card interactions.
 * Provides export, listing, and cancellation functionality based on NFT state.
 */

import {
  ActionButton,
  ActionsContainer,
  InputContainer,
  PriceInput
} from '@presentation/components/inventory/nft-card.styles'

/**
 * Props for NFTActionsSection component.
 * Controls the display and behavior of NFT action buttons and listing input.
 */
interface NFTActionsSectionProps {
  hasListing: boolean
  showListInput: boolean
  priceInput: string
  isPending: boolean
  listingId?: number
  onExport: () => void
  onList: () => void
  onCancel: () => void
  onShowListInput: (show: boolean) => void
  onPriceInputChange: (value: string) => void
}

/**
 * Renders action buttons for NFT operations including export, list for sale, and cancel listing.
 * Dynamically shows appropriate actions based on NFT listing state and user interactions.
 */
export const NFTActionsSection = ({
  hasListing,
  showListInput,
  priceInput,
  isPending,
  listingId,
  onExport,
  onList,
  onCancel,
  onShowListInput,
  onPriceInputChange
}: NFTActionsSectionProps) => {
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }
  const handleCancelInput = () => {
    onShowListInput(false)
    onPriceInputChange('')
  }
  return (
    <ActionsContainer onClick={handleContainerClick}>
      {!hasListing && (
        <>
          <ActionButton onClick={onExport} disabled={isPending} $variant="primary">
            {isPending ? 'Processing...' : 'Export to Game'}
          </ActionButton>
          {!showListInput ? (
            <ActionButton onClick={() => onShowListInput(true)} disabled={isPending} $variant="secondary">
              List for Sale
            </ActionButton>
          ) : (
            <InputContainer>
              <PriceInput
                type="number"
                step="0.001"
                min="0"
                placeholder="Price in ETH"
                value={priceInput}
                onChange={(e) => onPriceInputChange(e.target.value)}
              />
              <ActionButton onClick={onList} disabled={isPending || !priceInput} $variant="primary">
                {isPending ? 'Processing...' : 'Confirm'}
              </ActionButton>
              <ActionButton onClick={handleCancelInput} disabled={isPending} $variant="secondary">
                Cancel
              </ActionButton>
            </InputContainer>
          )}
        </>
      )}
      {hasListing && (
        <ActionButton onClick={onCancel} disabled={isPending || !listingId} $variant="danger">
          {isPending ? 'Cancelling...' : 'Cancel Listing'}
        </ActionButton>
      )}
    </ActionsContainer>
  )
}
