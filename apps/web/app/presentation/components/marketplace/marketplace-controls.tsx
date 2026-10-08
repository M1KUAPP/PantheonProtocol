/**
 * @module marketplace-controls
 * Control bar component for the marketplace that provides search, filtering, and sorting functionality.
 * Integrates with MarketplaceFilterContext to manage filter state.
 */

import { ControlBar, FilterSelect, SearchInput } from '@presentation/components/marketplace/marketplace-controls.styles'
import { useMarketplaceFilter } from '@presentation/components/marketplace/marketplace-filter.context'

/**
 * Control bar component providing search, filter, and sort controls for marketplace listings.
 * Uses MarketplaceFilterContext for state management.
 */
export const MarketplaceControls = () => {
  const {
    searchTerm,
    setSearchTerm,
    availableFilters,
    activeFilters,
    handleFilterChange,
    sortOptions,
    currentSortOption,
    setCurrentSortOption
  } = useMarketplaceFilter()
  return (
    <ControlBar>
      <SearchInput placeholder="Search by Name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <FilterSelect value={activeFilters.itemType} onChange={(e) => handleFilterChange('itemType', e.target.value)}>
        <option value="">All Item Types</option>
        {availableFilters.itemTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </FilterSelect>
      <FilterSelect value={activeFilters.rarity} onChange={(e) => handleFilterChange('rarity', e.target.value)}>
        <option value="">All Rarities</option>
        {availableFilters.rarities.map((rarity) => (
          <option key={rarity} value={rarity}>
            {rarity}
          </option>
        ))}
      </FilterSelect>
      <FilterSelect
        value={currentSortOption}
        onChange={(e) => setCurrentSortOption(e.target.value)}
        style={{ marginLeft: 'auto' }}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </FilterSelect>
    </ControlBar>
  )
}
