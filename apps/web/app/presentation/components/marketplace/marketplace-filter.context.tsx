/**
 * @module marketplace-filter.context
 * React context for managing marketplace filter, search, and sort state.
 * Provides centralized state management for marketplace controls and filtering logic.
 */

import type { AvailableFilters } from '@application/use-cases/marketplace/extract-marketplace-filters.uc'
import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

/**
 * State shape for active marketplace filters.
 */
interface FilterState {
  itemType: string
  rarity: string
}

/**
 * Context value containing all marketplace filter state and controls.
 * Provides search, filter, and sort functionality to child components.
 */
interface MarketplaceFilterContextValue {
  searchTerm: string
  setSearchTerm: (term: string) => void
  availableFilters: AvailableFilters
  activeFilters: FilterState
  handleFilterChange: (filterType: 'itemType' | 'rarity', value: string) => void
  sortOptions: { value: string; label: string }[]
  currentSortOption: string
  setCurrentSortOption: (option: string) => void
}

const MarketplaceFilterContext = createContext<MarketplaceFilterContextValue | undefined>(undefined)

/**
 * Props for MarketplaceFilterProvider.
 * Accepts all filter state and handlers to be shared via context.
 */
interface MarketplaceFilterProviderProps {
  children: ReactNode
  availableFilters: AvailableFilters
  sortOptions: { value: string; label: string }[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  activeFilters: FilterState
  handleFilterChange: (filterType: 'itemType' | 'rarity', value: string) => void
  currentSortOption: string
  setCurrentSortOption: (option: string) => void
}

/**
 * Provider component that makes marketplace filter state available to child components.
 * Wraps marketplace controls and grid to share filter state.
 */
export const MarketplaceFilterProvider = ({
  children,
  availableFilters,
  sortOptions,
  searchTerm,
  setSearchTerm,
  activeFilters,
  handleFilterChange,
  currentSortOption,
  setCurrentSortOption
}: MarketplaceFilterProviderProps) => {
  const value: MarketplaceFilterContextValue = {
    searchTerm,
    setSearchTerm,
    availableFilters,
    activeFilters,
    handleFilterChange,
    sortOptions,
    currentSortOption,
    setCurrentSortOption
  }
  return <MarketplaceFilterContext.Provider value={value}>{children}</MarketplaceFilterContext.Provider>
}

export const useMarketplaceFilter = () => {
  const context = useContext(MarketplaceFilterContext)
  if (!context) {
    throw new Error('useMarketplaceFilter must be used within MarketplaceFilterProvider')
  }
  return context
}
