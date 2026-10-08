/**
 * Global CSS styles applied to the entire application.
 *
 * Sets up base typography, resets margins/padding, disables text selection,
 * and defines global keyframe animations.
 * @module
 */

import { createGlobalStyle } from 'styled-components'

/** Global styled-components styles for the application. */
const Styles = createGlobalStyle`
  *,*::before,*::after {
    margin: 0;
    padding: 0;
    font-family: Manrope;
    user-select: none;
    user-drag: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export default Styles
