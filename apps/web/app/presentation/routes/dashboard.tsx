/**
 * Dashboard page route component.
 *
 * Renders the main dashboard with wallet stats, NFT inventory,
 * and transaction history.
 * @module
 */

import { Dashboard } from '@presentation/components/dashboard/dashboard'
import { DashboardLayout } from '@presentation/components/dashboard/dashboard-layout'
import type { Route } from './+types/dashboard'

/** Route metadata for SEO and browser title. */
export function meta(_args: Route.MetaArgs) {
  return [
    { title: 'Dashboard - Pantheon Protocol' },
    { name: 'description', content: 'Manage your NFTs and marketplace' }
  ]
}

/** Page component for the /dashboard route. */
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  )
}
