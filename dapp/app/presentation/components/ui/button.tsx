/**
 * Generic button component with navigation support.
 *
 * Can trigger a click handler or navigate to a route when pressed.
 * @module
 */

import { Btn } from '@presentation/components/ui/button.styles'
import { useNavigate } from 'react-router'

/** Props for the Button component. */
interface ButtonProps {
  text: string
  link?: string
  onClick?: () => void
  disabled?: boolean
}

/** Styled button with optional navigation or click handling. */
export const Button = ({ text, link, onClick, disabled = false }: ButtonProps) => {
  const navigate = useNavigate()
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (link) {
      navigate(link)
    }
  }
  return (
    <Btn onClick={handleClick} disabled={disabled}>
      {text}
    </Btn>
  )
}
