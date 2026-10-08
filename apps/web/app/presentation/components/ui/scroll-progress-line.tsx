/**
 * Animated scroll progress line component.
 *
 * Uses GSAP ScrollTrigger to animate an SVG line path
 * as the user scrolls down the page.
 * @module
 */

import { Ball, Container } from '@presentation/components/ui/scroll-progress-line.styles'
import ScrollProgressLineSvg from '@presentation/components/ui/scroll-progress-line.svg'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef, useState } from 'react'

/** Scroll-animated progress line with ball indicator. */
export const ScrollProgressLine = () => {
  const lineRef = useRef<HTMLDivElement>(null)
  const [isBallVisible, setIsBallVisible] = useState(true)
  const [strokeDasharray, setStrokeDasharray] = useState(0)
  const [strokeDashoffset, setStrokeDashoffset] = useState(0)
  gsap.registerPlugin(ScrollTrigger)
  useLayoutEffect(() => {
    const e = lineRef.current
    const svg = document.getElementsByClassName('svg-path')[0] as SVGPathElement
    const length = svg.getTotalLength()
    setStrokeDasharray(length)
    setStrokeDashoffset(length)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: e,
        start: 'top center',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const draw = length * self.progress
          setStrokeDashoffset(length - draw)
        },
        onToggle: (self) => {
          setIsBallVisible(!self.isActive)
        }
      }
    })
    return () => {
      if (tl) tl.kill()
    }
  }, [])
  return (
    <>
      <Ball $isVisible={isBallVisible} />
      <Container ref={lineRef} $strokeDasharray={strokeDasharray} $strokeDashoffset={strokeDashoffset}>
        <ScrollProgressLineSvg />
      </Container>
    </>
  )
}
