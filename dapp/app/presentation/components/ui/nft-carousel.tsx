/**
 * NFT image carousel component for the landing page.
 *
 * Displays a Swiper-based card carousel showcasing NFT artwork
 * with navigation controls and auto-play functionality.
 * @module
 */

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Container, NextButton, PrevButton } from '@presentation/components/ui/nft-carousel.styles'
import abstract0 from '@presentation/media/nfts/abstract-0.png'
import abstract1 from '@presentation/media/nfts/abstract-1.png'
import abstract2 from '@presentation/media/nfts/abstract-2.png'
import abstract3 from '@presentation/media/nfts/abstract-3.png'
import abstract4 from '@presentation/media/nfts/abstract-4.png'
import abstract5 from '@presentation/media/nfts/abstract-5.png'
import abstract6 from '@presentation/media/nfts/abstract-6.png'
import abstract7 from '@presentation/media/nfts/abstract-7.png'
import abstract8 from '@presentation/media/nfts/abstract-8.png'
import abstract9 from '@presentation/media/nfts/abstract-9.png'
import { useRef } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-cards'
import 'swiper/css/navigation'
import { Autoplay, EffectCards, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const NFT_IMAGES = [
  abstract0,
  abstract1,
  abstract2,
  abstract3,
  abstract4,
  abstract5,
  abstract6,
  abstract7,
  abstract8,
  abstract9
]

/** Auto-playing NFT card carousel with navigation arrows. */
export const NFTCarousel = () => {
  const swiperRef = useRef<SwiperType | null>(null)
  return (
    <Container>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        loop={true}
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards, Navigation, Autoplay]}
        className="mySwiper"
      >
        {NFT_IMAGES.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
      <PrevButton onClick={() => swiperRef.current?.slidePrev()}>
        <ArrowLeftIcon width={25} height={25} />
      </PrevButton>
      <NextButton onClick={() => swiperRef.current?.slideNext()}>
        <ArrowRightIcon width={25} height={25} />
      </NextButton>
    </Container>
  )
}
