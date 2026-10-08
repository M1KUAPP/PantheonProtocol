/**
 * TypeScript declaration for styled-components theme types.
 *
 * Extends the DefaultTheme interface to include our custom Theme type,
 * enabling type-safe theme access in styled-components.
 * @module
 */

import { Theme } from '@presentation/styles/theme-definitions'
import 'styled-components'

declare module 'styled-components' {
  /** Extends styled-components DefaultTheme with our custom Theme. */
  export interface DefaultTheme extends Theme {}
}
