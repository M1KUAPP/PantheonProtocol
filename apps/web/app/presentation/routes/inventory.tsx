/**
 * Inventory page route component.
 *
 * Renders the NFT inventory view showing all NFTs owned
 * by the connected wallet with action controls.
 * @module
 */

import { DashboardLayout } from '@presentation/components/dashboard/dashboard-layout'
import { Inventory } from '@presentation/components/inventory/inventory'
import type { Route } from './+types/inventory'

/** Route metadata for SEO and browser title. */
export function meta(_args: Route.MetaArgs) {
  return [{ title: 'Inventory - Pantheon Protocol' }, { name: 'description', content: 'Manage your NFT inventory' }]
}

/** Page component for the /inventory route. */
export default function InventoryPage() {
  return (
    <DashboardLayout>
      <Inventory />
    </DashboardLayout>
  )
}
