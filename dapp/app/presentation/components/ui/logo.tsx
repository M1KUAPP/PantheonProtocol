/**
 * Application logo component.
 *
 * Displays the branding logo linked to the home page.
 * @module
 */

import { LogoText } from '@presentation/components/ui/logo.styles'
import { Link } from 'react-router'

/** Application logo with home navigation. */
export const Logo = () => {
  return (
    <LogoText>
      <Link to="/">PP.</Link>
    </LogoText>
  )
}
