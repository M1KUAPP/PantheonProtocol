/**
 * @module ScrollToTop
 * Scroll-to-top button component that appears when users scroll down the page.
 * Provides a floating button to quickly navigate back to the top of the page with smooth scrolling.
 */

import { ArrowUpIcon } from '@heroicons/react/24/outline'
import { ArrowContainer } from '@presentation/components/landing/scroll-to-top.styles'
import { useEffect, useState } from 'react'

/**
 * Floating scroll-to-top button that becomes visible after scrolling 300px.
 * Clicking the button smoothly scrolls the page back to the top.
 */
export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    window.addEventListener('scroll', toggleVisibility)
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])
  const navigateToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  return (
    <ArrowContainer onClick={navigateToTop} $isVisible={isVisible}>
      <ArrowUpIcon />
    </ArrowContainer>
  )
}
