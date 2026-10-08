/**
 * Theme definitions for light and dark mode styling.
 *
 * Defines the color palette, typography sizes, and layout dimensions
 * used throughout the application via styled-components theming.
 * @module
 */

/** Complete theme interface defining all design tokens. */
export interface Theme {
  main: string
  secondary: string
  support: string
  warning: string
  accent1: string
  accent2: string
  accent3: string
  mainRgba: string
  secondaryRgba: string
  supportRgba: string
  background: string
  cardBackground: string
  border: string
  borderLight: string
  textPrimary: string
  textSecondary: string
  textTertiary: string
  success: string
  successBg: string
  successText: string
  error: string
  errorBg: string
  errorText: string
  infoBg: string
  infoText: string
  statusText: string
  buttonPrimary: string
  buttonPrimaryHover: string
  buttonSecondary: string
  buttonSecondaryHover: string
  sidebarText: string
  sidebarIcon: string
  connectButton: string
  connectButtonBg: string
  disconnectButton: string
  disconnectButtonBg: string
  gradient1: string
  gradient2: string
  infoBgLight: string
  infoTextDark: string
  sidebarWidth: string
  sidebarExpandedWidth: string
  navLinkHeight: string
  navLinkExpandedWidth: string
  navIconSize: string
  fontxs: string
  fonts: string
  fontm: string
  fontl: string
  fontxl: string
  fontxxl: string
  fontxxxl: string
  navHeight: string
}

/** Light mode theme configuration with bright backgrounds and dark text. */
export const LightTheme: Theme = {
  main: '#FFF',
  secondary: '#202020',
  support: '#EEEDDE',
  mainRgba: '255,255,255',
  secondaryRgba: '32,32,32',
  supportRgba: '238,237,222',
  accent1: '#00ADB5',
  accent2: '#3F72AF',
  accent3: '#FF9494',
  background: '#f4f7fd',
  cardBackground: '#fff',
  border: '#e0e0e0',
  borderLight: '#f0f0f0',
  textPrimary: '#333',
  textSecondary: '#888',
  textTertiary: '#555',
  warning: '#ef4444',
  success: '#22c55e',
  successBg: '#d4edda',
  successText: '#155724',
  error: '#ef4444',
  errorBg: '#f8d7da',
  errorText: '#721c24',
  infoBg: '#fff3cd',
  infoText: '#856404',
  statusText: '#FFF',
  buttonPrimary: '#3F72AF',
  buttonPrimaryHover: '#335a8a',
  buttonSecondary: '#e0e0e0',
  buttonSecondaryHover: '#c7c7c7',
  sidebarText: '#8a92a6',
  sidebarIcon: '#8a92a6',
  connectButton: '#006400',
  connectButtonBg: '#e6f7ec',
  disconnectButton: '#d93025',
  disconnectButtonBg: '#fff0f1',
  gradient1: '#3F72AF',
  gradient2: '#a259ff',
  infoBgLight: '#e0f7fa',
  infoTextDark: '#00796b',
  sidebarWidth: '4.375rem',
  sidebarExpandedWidth: '13.75rem',
  navLinkHeight: '2.625rem',
  navLinkExpandedWidth: '13.75rem',
  navIconSize: '1.25rem',
  fontxs: '0.75em',
  fonts: '0.875em',
  fontm: '1em',
  fontl: '1.25em',
  fontxl: '2em',
  fontxxl: '3em',
  fontxxxl: '4em',
  navHeight: '5rem'
}

/** Dark mode theme configuration with dark backgrounds and light text. */
export const DarkTheme: Theme = {
  main: '#202020',
  secondary: '#FFF',
  support: '#EEEDDE',
  mainRgba: '32,32,32',
  secondaryRgba: '255,255,255',
  supportRgba: '238,237,222',
  accent1: '#ff7738ff',
  accent2: '#e29638ff',
  accent3: '#006B6B',
  background: '#1a1a1a',
  cardBackground: '#2a2a2a',
  border: '#404040',
  borderLight: '#353535',
  textPrimary: '#e0e0e0',
  textSecondary: '#a0a0a0',
  textTertiary: '#b0b0b0',
  warning: '#ef4444',
  success: '#22c55e',
  successBg: '#1e4c2e',
  successText: '#6ee7a7',
  error: '#ef4444',
  errorBg: '#4a1f1f',
  errorText: '#fca5a5',
  infoBg: '#4a3a1f',
  infoText: '#fcd34d',
  statusText: '#FFF',
  buttonPrimary: '#3F72AF',
  buttonPrimaryHover: '#5088c7',
  buttonSecondary: '#404040',
  buttonSecondaryHover: '#505050',
  sidebarText: '#8a92a6',
  sidebarIcon: '#8a92a6',
  connectButton: '#22c55e',
  connectButtonBg: '#1e4c2e',
  disconnectButton: '#ef4444',
  disconnectButtonBg: '#4a1f1f',
  gradient1: '#3F72AF',
  gradient2: '#a259ff',
  infoBgLight: '#1e3a3a',
  infoTextDark: '#22c55e',
  sidebarWidth: '4.375rem',
  sidebarExpandedWidth: '13.75rem',
  navLinkHeight: '2.625rem',
  navLinkExpandedWidth: '13.75rem',
  navIconSize: '1.25rem',
  fontxs: '0.75em',
  fonts: '0.875em',
  fontm: '1em',
  fontl: '1.25em',
  fontxl: '2em',
  fontxxl: '3em',
  fontxxxl: '4em',
  navHeight: '5rem'
}
