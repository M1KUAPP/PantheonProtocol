/**
 * Marketplace page route component.
 *
 * Renders the NFT marketplace for browsing and purchasing
 * listed NFTs from other users.
 * @module
 */

import { DashboardLayout } from '@presentation/components/dashboard/dashboard-layout'
import { Marketplace } from '@presentation/components/marketplace/marketplace'
import type { Route } from './+types/marketplace'

/** Route metadata for SEO and browser title. */
export function meta(_args: Route.MetaArgs) {
  return [{ title: 'Marketplace - Pantheon Protocol' }, { name: 'description', content: 'Browse and purchase NFTs' }]
}

/** Page component for the /marketplace route. */
export default function MarketplacePage() {
  return (
    <DashboardLayout>
      <Marketplace />
    </DashboardLayout>
  )
}
