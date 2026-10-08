/**
 * @module DashboardLayout
 * Provides the base layout structure for all dashboard pages.
 * Includes sidebar navigation, app header, and manages viewport overflow to prevent scrolling issues.
 */

import { AppHeader } from '@presentation/components/common/app-header'
import { Sidebar } from '@presentation/components/common/sidebar'
import { SidebarProvider } from '@presentation/components/common/sidebar.context'
import { LayoutContainer, MainContentWrapper } from '@presentation/components/dashboard/dashboard.styles'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

/**
 * Props for DashboardLayout component.
 */
interface DashboardLayoutProps {
  children: ReactNode
}

/**
 * Main layout wrapper for dashboard pages that includes sidebar navigation and header.
 * Controls body overflow to create a fixed layout with internal scrolling areas.
 */
export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])
  return (
    <SidebarProvider>
      <LayoutContainer>
        <Sidebar />
        <MainContentWrapper>
          <AppHeader />
          {children}
        </MainContentWrapper>
      </LayoutContainer>
    </SidebarProvider>
  )
}
