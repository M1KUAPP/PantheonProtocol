/**
 * Home/landing page route component.
 *
 * Renders the public-facing landing page with navigation,
 * hero section, about, features, team, and FAQ sections.
 * @module
 */

import { About } from '@presentation/components/landing/about'
import { Explore } from '@presentation/components/landing/explore'
import { Faq } from '@presentation/components/landing/faq'
import { Footer } from '@presentation/components/landing/footer'
import { Home } from '@presentation/components/landing/home'
import { NavigationBar } from '@presentation/components/landing/navigation-bar'
import { ScrollToTop } from '@presentation/components/landing/scroll-to-top'
import { Showcase } from '@presentation/components/landing/showcase'
import { Team } from '@presentation/components/landing/team'
import { LightTheme } from '@presentation/styles/theme-definitions'
import { ThemeProvider } from 'styled-components'
import type { Route } from './+types/home'

/** Route metadata for SEO and browser title. */
export function meta(_args: Route.MetaArgs) {
  return [{ title: 'Pantheon Protocol' }, { name: 'description', content: 'Welcome to Pantheon Protocol!' }]
}

/** Page component for the root (/) route - the landing page. */
export default function HomePage() {
  return (
    <ThemeProvider theme={LightTheme}>
      <NavigationBar />
      <Home />
      <About />
      <Explore />
      <Showcase />
      <Team />
      <Faq />
      <Footer />
      <ScrollToTop />
    </ThemeProvider>
  )
}
