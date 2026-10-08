/**
 * Recently added NFTs carousel view model.
 *
 * Manages an Embla carousel for displaying the user's most recent NFTs
 * with navigation controls and dot indicators.
 * @module
 */

import type { EnrichedNFTDisplayItem } from '@application/use-cases/nft/enrich-nft-metadata.uc'
import type { EmblaCarouselType } from 'embla-carousel'
import ClassNames from 'embla-carousel-class-names'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

/**
 * Internal hook for carousel prev/next button state.
 * @param emblaApi - The Embla carousel API instance.
 * @returns Button disabled states and click handlers.
 */
const usePrevNextButtons = (emblaApi: EmblaCarouselType | undefined) => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])
  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onSelect])
  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick: useCallback(() => emblaApi?.scrollPrev(), [emblaApi]),
    onNextButtonClick: useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  }
}

/**
 * Internal hook for carousel dot navigation state.
 * @param emblaApi - The Embla carousel API instance.
 * @returns Selected index, snap positions, and dot click handler.
 */
const useDotButton = (emblaApi: EmblaCarouselType | undefined) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const onDotButtonClick = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])
  const onInit = useCallback((emblaApi: EmblaCarouselType) => setScrollSnaps(emblaApi.scrollSnapList()), [])
  const onSelect = useCallback((emblaApi: EmblaCarouselType) => setSelectedIndex(emblaApi.selectedScrollSnap()), [])
  useEffect(() => {
    if (!emblaApi) return
    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onInit, onSelect])
  return { selectedIndex, scrollSnaps, onDotButtonClick }
}

/**
 * Hook that manages the recently added NFTs carousel.
 *
 * Sorts NFTs by token ID (most recent first), limits to 10 items,
 * and provides all carousel navigation state and handlers.
 * @param inventory - The user's full NFT inventory to display.
 * @returns Carousel ref, sorted NFTs, navigation state, and handlers.
 */
export function useRecentlyAddedNFTsViewModel(inventory: EnrichedNFTDisplayItem[]) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false }, [ClassNames()])
  const { prevBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
  const recentNFTs = useMemo(() => {
    return [...inventory].sort((a, b) => b.tokenId - a.tokenId).slice(0, 10)
  }, [inventory])
  const totalPages = useMemo(() => {
    const SLIDES_IN_VIEW = 3
    const totalItems = recentNFTs.length + 1
    if (totalItems <= SLIDES_IN_VIEW) return 1
    return totalItems - SLIDES_IN_VIEW + 1
  }, [recentNFTs.length])
  const adjustedNextBtnDisabled = useMemo(() => selectedIndex >= totalPages - 1, [selectedIndex, totalPages])
  return {
    emblaRef,
    recentNFTs,
    prevBtnDisabled,
    nextBtnDisabled: adjustedNextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
    selectedIndex,
    scrollSnaps: scrollSnaps.slice(0, totalPages),
    onDotButtonClick
  }
}
