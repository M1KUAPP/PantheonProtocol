import { createAppConfig } from '@config/app-config'
import { createWagmiConfig } from '@infrastructure/blockchain/wagmi/wagmi-config'
import { AppProvider } from '@presentation/providers/app-provider'
import { Toaster } from '@presentation/services/toast-notification.service'
import Styles from '@presentation/styles/global-styles'
import { CustomThemeProvider } from '@presentation/styles/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { WagmiProvider } from 'wagmi'
import type { Route } from './+types/root'

const queryClient = new QueryClient()
const appConfig = createAppConfig()
const wagmiConfig = createWagmiConfig(appConfig)

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap'
  }
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppProvider appConfig={appConfig} wagmiConfig={wagmiConfig}>
          <Styles />
          <CustomThemeProvider>
            <Outlet />
            <Toaster />
          </CustomThemeProvider>
        </AppProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export function HydrateFallback() {
  return <p>Loading...</p>
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }
  return (
    <>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && <code>{stack}</code>}
    </>
  )
}
