import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('presentation/routes/home.tsx'),
  route('create-nft', 'presentation/routes/create-nft.tsx'),
  route('dashboard', 'presentation/routes/dashboard.tsx'),
  route('inventory', 'presentation/routes/inventory.tsx'),
  route('marketplace', 'presentation/routes/marketplace.tsx')
] satisfies RouteConfig
