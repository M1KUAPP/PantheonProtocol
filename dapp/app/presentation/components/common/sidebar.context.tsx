/**
 * Sidebar state context for expansion/collapse functionality.
 *
 * Provides shared state for sidebar expansion that can be controlled
 * from any component within the provider tree.
 * @module
 */

import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

/** Context value interface for sidebar state. */
interface SidebarContextValue {
  isExpanded: boolean
  expand: () => void
  collapse: () => void
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

/** Props for the SidebarProvider component. */
interface SidebarProviderProps {
  children: ReactNode
}

/** Provider that manages sidebar expansion state for child components. */
export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const value: SidebarContextValue = {
    isExpanded,
    expand: () => setIsExpanded(true),
    collapse: () => setIsExpanded(false)
  }
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

/**
 * Hook to access sidebar state and controls.
 * @throws Error if used outside SidebarProvider.
 * @returns Sidebar expansion state and control functions.
 */
export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}
