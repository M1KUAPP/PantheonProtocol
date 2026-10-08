/**
 * Numeric weights for NFT rarity sorting.
 * Higher values indicate rarer items that should appear first in rarity-based sorts.
 */
export const RARITY_ORDER: Record<string, number> = {
  Legendary: 4,
  Epic: 3,
  Rare: 2,
  Uncommon: 1,
  Common: 1
}
