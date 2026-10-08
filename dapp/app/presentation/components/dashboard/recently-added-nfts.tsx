/**
 * @module RecentlyAddedNFTs
 * Displays a carousel of the user's most recently added NFTs with navigation controls.
 * Includes an "Add NFT" card that links to marketplace and NFT creation pages.
 */

import { ArrowLeftIcon, ArrowRightIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import {
  AddNFTCard,
  AddNFTLink,
  CardDetails,
  CarouselContainer,
  ControlsContainer,
  DotButton,
  DotsContainer,
  EmblaButton,
  EmblaContainer,
  EmblaSlide,
  EmblaViewport,
  ErrorMessage,
  NFTCard,
  NFTImage,
  SectionTitle,
  SectionWrapper
} from '@presentation/components/dashboard/recently-added-nfts.styles'
import type { RecentlyAddedNFTDisplayItem } from '@presentation/view-models/dashboard/dashboard.vm'
import { useRecentlyAddedNFTsViewModel } from '@presentation/view-models/dashboard/recently-added-nfts.vm'

/**
 * Props for RecentlyAddedNFTs component.
 */
interface RecentlyAddedNFTsProps {
  inventory: RecentlyAddedNFTDisplayItem[]
  error?: string | null
}

/**
 * NFT carousel component showing recently added items with Embla carousel navigation.
 * Displays NFT cards with images and token IDs, plus an action card for adding new NFTs.
 */
export const RecentlyAddedNFTs = ({ inventory, error }: RecentlyAddedNFTsProps) => {
  const {
    emblaRef,
    recentNFTs,
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = useRecentlyAddedNFTsViewModel(inventory)
  return (
    <SectionWrapper>
      <SectionTitle>Recently Added NFTs</SectionTitle>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <CarouselContainer>
        <EmblaViewport ref={emblaRef}>
          <EmblaContainer>
            <EmblaSlide>
              <AddNFTCard>
                <PlusCircleIcon width={40} height={40} />
                <AddNFTLink to="/marketplace">Buy NFT</AddNFTLink>
                <AddNFTLink to="/create-nft">Create NFT</AddNFTLink>
              </AddNFTCard>
            </EmblaSlide>
            {recentNFTs.map((nft) => (
              <EmblaSlide key={nft.tokenId}>
                <NFTCard to="/inventory">
                  <NFTImage src={nft.imageUrl} alt={nft.name} />
                  <CardDetails>
                    <h3>{nft.name}</h3>
                    <p>Token ID: #{nft.tokenId}</p>
                  </CardDetails>
                </NFTCard>
              </EmblaSlide>
            ))}
          </EmblaContainer>
        </EmblaViewport>
        <ControlsContainer>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <EmblaButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}>
              <ArrowLeftIcon width={20} height={20} />
            </EmblaButton>
            <EmblaButton onClick={onNextButtonClick} disabled={nextBtnDisabled}>
              <ArrowRightIcon width={20} height={20} />
            </EmblaButton>
          </div>
          <DotsContainer>
            {scrollSnaps.map((_, index) => (
              <DotButton key={index} $isSelected={index === selectedIndex} onClick={() => onDotButtonClick(index)} />
            ))}
          </DotsContainer>
        </ControlsContainer>
      </CarouselContainer>
    </SectionWrapper>
  )
}
