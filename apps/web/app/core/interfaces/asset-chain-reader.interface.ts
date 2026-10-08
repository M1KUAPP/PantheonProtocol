/**
 * On-chain facts the API checks before it changes a game table.
 */
export interface IAssetChainReader {
  /** The token's holder and the game asset it was minted from, or null if the token doesn't exist. */
  getToken(tokenId: bigint): Promise<{ owner: `0x${string}`; assetId: bigint } | null>

  /** Who exported the token through ExportManager and which game asset it carried, or null if it wasn't exported. */
  getExport(tokenId: bigint): Promise<{ exporter: `0x${string}`; assetId: bigint } | null>
}
