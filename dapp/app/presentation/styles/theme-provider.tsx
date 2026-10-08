import { DarkTheme, LightTheme } from '@presentation/styles/theme-definitions'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'

const THEME_STORAGE_KEY = 'pantheon_theme_mode'

const THEME_CONTEXT = createContext<ThemeContextType | undefined>(undefined)

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  themeMode: ThemeMode
  toggleTheme: () => void
}

interface CustomThemeProviderProps {
  children: ReactNode
}

export const CustomThemeProvider = ({ children }: CustomThemeProviderProps) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 'light'
    }
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })
  const toggleTheme = () => {
    setThemeMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light'
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(THEME_STORAGE_KEY, newMode)
      }
      return newMode
    })
  }
  const theme = useMemo(() => (themeMode === 'light' ? LightTheme : DarkTheme), [themeMode])
  const contextValue = useMemo(
    () => ({
      themeMode,
      toggleTheme
    }),
    [themeMode]
  )
  return (
    <THEME_CONTEXT.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </THEME_CONTEXT.Provider>
  )
}

export const useThemeToggle = () => {
  const context = useContext(THEME_CONTEXT)
  if (!context) {
    throw new Error('useThemeToggle must be used within a CustomThemeProvider')
  }
  return context
}
