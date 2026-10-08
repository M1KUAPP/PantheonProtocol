/**
 * Create NFT page route component.
 *
 * Renders the NFT minting form within the dashboard layout
 * for creating new NFTs from game assets.
 * @module
 */

import { DashboardLayout } from '@presentation/components/dashboard/dashboard-layout'
import { CreateNFTForm } from '@presentation/components/nft/create-nft-form'
import type { Route } from './+types/create-nft'

/** Route metadata for SEO and browser title. */
export function meta(_args: Route.MetaArgs) {
  return [{ title: 'Create NFT - Pantheon Protocol' }, { name: 'description', content: 'Create and mint new NFTs' }]
}

/** Page component for the /create-nft route. */
export default function CreateNFTPage() {
  return (
    <DashboardLayout>
      <CreateNFTForm />
    </DashboardLayout>
  )
}
