/**
 * Modal backdrop overlay component.
 *
 * Provides a semi-transparent overlay behind modals that can
 * be clicked to dismiss the modal.
 * @module
 */

import { StyledBackdrop } from '@presentation/components/common/backdrop.styles'

/** Props for the CustomBackdrop component. */
interface BackdropProps {
  readonly onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  readonly children?: React.ReactNode
  readonly className?: string
}

/** Clickable overlay backdrop for modals and dropdowns. */
export const CustomBackdrop = ({ onClick, children, className }: BackdropProps) => {
  return (
    <StyledBackdrop onClick={onClick} className={className}>
      {children}
    </StyledBackdrop>
  )
}
