/**
 * @module CreateNFTForm
 * NFT creation form component that allows users to mint new game asset NFTs.
 * Handles user input for asset ID and manages the NFT minting transaction flow with wallet integration.
 */

import { Container, FormContainer, Section, TextField } from '@presentation/components/nft/create-nft-form.styles'
import { Button } from '@presentation/components/ui/button'
import { useCreateNFTViewModel } from '@presentation/view-models/nft/create-nft.vm'

/**
 * Form component for creating new NFTs from game asset IDs.
 * Displays transaction status and provides real-time feedback during the minting process.
 */
export const CreateNFTForm = () => {
  const { assetId, isProcessing, isProperlyConnected, isPending, isConfirming, setAssetId, handleCreateNFT } =
    useCreateNFTViewModel()
  const getButtonText = () => {
    if (!isProcessing) return 'Create NFT'
    if (isPending) return 'Confirm in Wallet...'
    if (isConfirming) return 'Confirming...'
    return 'Processing...'
  }
  return (
    <Section id="create-nft">
      <Container>
        <FormContainer>
          <TextField
            type="text"
            placeholder="Enter Game Asset ID..."
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            disabled={isProcessing}
          />
          <Button text={getButtonText()} onClick={handleCreateNFT} disabled={isProcessing || !isProperlyConnected} />
        </FormContainer>
      </Container>
    </Section>
  )
}
