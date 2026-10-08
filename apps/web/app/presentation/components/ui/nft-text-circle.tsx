/**
 * Interactive NFT text circle component.
 *
 * Displays a circular text graphic with an arrow that follows
 * the mouse cursor for an engaging visual effect.
 * @module
 */

import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { NFTCircle, NFTText } from '@presentation/components/ui/nft-text-circle.styles'
import NFTTextSrc from '@presentation/media/nft-text.png'
import { useEffect, useRef, useState } from 'react'

/** Interactive circle with mouse-following arrow indicator. */
export const NFTTextCircle = () => {
  const [rotation, setRotation] = useState(0)
  const arrowRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (arrowRef.current) {
        const arrowRect = arrowRef.current.getBoundingClientRect()
        const arrowCenterX = arrowRect.left + arrowRect.width / 2
        const arrowCenterY = arrowRect.top + arrowRect.height / 2
        const deltaX = e.clientX - arrowCenterX
        const deltaY = e.clientY - arrowCenterY
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
        setRotation(angle)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  return (
    <NFTText>
      <NFTCircle $rotation={rotation} ref={arrowRef}>
        <ArrowRightIcon width={25} height={25} color="white" />
      </NFTCircle>
      <img src={NFTTextSrc} alt="" />
    </NFTText>
  )
}
