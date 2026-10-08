/// <reference types="bun" />
import { AppConfig } from '@config/app-config'
import { API_AUTH_HEADERS, type ApiAuthMessageFields, buildApiAuthMessage } from '@core/auth/api-auth'
import type { IDatabaseRepository } from '@core/interfaces/database.repository.interface'
import type { ApiDependencies } from '@presentation/routes/api/api-dependencies'
import { createApiApp } from '@presentation/routes/api/create-api-app'
import { afterEach, describe, expect, test } from 'bun:test'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import type { PrivateKeyAccount } from 'viem/accounts'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

const NOW = Date.parse('2026-10-08T03:00:00.000Z')
const UPLOAD_URL = 'https://uploads.pinata.cloud/v3/files/signed-for-test'
const holder = privateKeyToAccount(generatePrivateKey())
const stranger = privateKeyToAccount(generatePrivateKey())

const appConfig = AppConfig.create({
  assetNFTAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  marketplaceAddress: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  exportManagerAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  network: {
    id: 31337,
    name: 'Test chain',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'http://127.0.0.1:8545'
  },
  sourceTable: 'source',
  targetTable: 'target'
})

const item = (uid: number) => ({
  uid,
  name: `Item ${uid}`,
  description: 'A test item',
  item_type: 'Weapon',
  rarity: 'Rare',
  image_path: `https://example.com/${uid}.png`,
  attributes: [{ trait_type: 'Attack', value: 10 }]
})

/**
 * Starts the API on a free port against an in-memory database and a fake chain:
 * token 1 is held by `holder` and was minted from item 10001, which is still in the source game;
 * token 2 was minted from item 10002 and exported by `holder`.
 */
async function startApi() {
  const tables = new Map([
    ['source', new Map<number, object>([[10001, item(10001)]])],
    ['target', new Map<number, object>()]
  ])
  const database: IDatabaseRepository = {
    async getAssetByUid(table, uid) {
      return { data: tables.get(table)?.get(uid) ?? null, error: null }
    },
    async insertAsset(table, asset) {
      const rows = tables.get(table)!
      const { uid } = asset as { uid: number }
      if (rows.has(uid)) return { data: null, error: 'duplicate key value violates unique constraint' }
      rows.set(uid, asset)
      return { data: asset, error: null }
    },
    async deleteAsset(table, uid) {
      return { data: tables.get(table)!.delete(uid) ? 1 : 0, error: null }
    }
  }
  const deps = {
    appConfig,
    getDatabase: () => database,
    createUploadUrl: async () => UPLOAD_URL,
    chain: {
      async getToken(tokenId: bigint) {
        return tokenId === 1n ? { owner: holder.address, assetId: 10001n } : null
      },
      async getExport(tokenId: bigint) {
        return tokenId === 2n ? { exporter: holder.address, assetId: 10002n } : null
      }
    },
    now: () => NOW
  } as ApiDependencies
  const server: Server = await new Promise((resolve) => {
    const s = createApiApp(deps).listen(0, '127.0.0.1', () => resolve(s))
  })
  servers.push(server)
  return { baseUrl: `http://127.0.0.1:${(server.address() as AddressInfo).port}`, tables }
}

const servers: Server[] = []
afterEach(() => {
  for (const server of servers.splice(0)) server.close()
})

async function signedHeaders(
  account: PrivateKeyAccount,
  fields: Omit<ApiAuthMessageFields, 'issuedAt'>,
  { issuedAt = new Date(NOW).toISOString(), claimedAddress = account.address } = {}
) {
  const signature = await account.signMessage({ message: buildApiAuthMessage({ ...fields, issuedAt }) })
  return {
    [API_AUTH_HEADERS.address]: claimedAddress,
    [API_AUTH_HEADERS.signature]: signature,
    [API_AUTH_HEADERS.issuedAt]: issuedAt
  }
}

const SIX_MINUTES_AGO = new Date(NOW - 6 * 60 * 1000).toISOString()
const json = { 'content-type': 'application/json' }

describe('POST /api/ipfs/upload-url', () => {
  const request = (baseUrl: string, headers: Record<string, string>, assetId = 10001) =>
    fetch(`${baseUrl}/api/ipfs/upload-url`, {
      method: 'POST',
      headers: { ...json, ...headers },
      body: JSON.stringify({ assetId })
    })

  test('rejects an unsigned request with 401', async () => {
    const { baseUrl } = await startApi()
    expect((await request(baseUrl, {})).status).toBe(401)
  })

  test('rejects a signature older than five minutes with 401', async () => {
    const { baseUrl } = await startApi()
    const headers = await signedHeaders(holder, { action: 'mint', assetId: 10001 }, { issuedAt: SIX_MINUTES_AGO })
    expect((await request(baseUrl, headers)).status).toBe(401)
  })

  test('rejects a signature that does not match the claimed wallet with 401', async () => {
    const { baseUrl } = await startApi()
    const headers = await signedHeaders(
      stranger,
      { action: 'mint', assetId: 10001 },
      { claimedAddress: holder.address }
    )
    expect((await request(baseUrl, headers)).status).toBe(401)
  })

  test('rejects an item that is not in the source game with 404', async () => {
    const { baseUrl } = await startApi()
    const headers = await signedHeaders(holder, { action: 'mint', assetId: 10099 })
    expect((await request(baseUrl, headers, 10099)).status).toBe(404)
  })

  test('returns an upload URL for a fresh mint signature', async () => {
    const { baseUrl } = await startApi()
    const response = await request(baseUrl, await signedHeaders(holder, { action: 'mint', assetId: 10001 }))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ success: true, url: UPLOAD_URL })
  })
})

describe('DELETE /api/assets/remove/:uid', () => {
  const request = (baseUrl: string, headers: Record<string, string>) =>
    fetch(`${baseUrl}/api/assets/remove/10001?tokenId=1`, { method: 'DELETE', headers })

  test('rejects an unsigned request with 401', async () => {
    const { baseUrl, tables } = await startApi()
    expect((await request(baseUrl, {})).status).toBe(401)
    expect(tables.get('source')!.has(10001)).toBe(true)
  })

  test('rejects a signature for another action with 401', async () => {
    const { baseUrl } = await startApi()
    const headers = await signedHeaders(holder, { action: 'export', assetId: 10001, tokenId: 1 })
    expect((await request(baseUrl, headers)).status).toBe(401)
  })

  test('rejects a signer who does not hold the minted token with 403', async () => {
    const { baseUrl, tables } = await startApi()
    expect((await request(baseUrl, await signedHeaders(stranger, { action: 'mint', assetId: 10001 }))).status).toBe(403)
    expect(tables.get('source')!.has(10001)).toBe(true)
  })

  test('removes the item when the token holder signs', async () => {
    const { baseUrl, tables } = await startApi()
    expect((await request(baseUrl, await signedHeaders(holder, { action: 'mint', assetId: 10001 }))).status).toBe(200)
    expect(tables.get('source')!.has(10001)).toBe(false)
  })
})

describe('POST /api/assets/export/:uid', () => {
  const request = (baseUrl: string, headers: Record<string, string>) =>
    fetch(`${baseUrl}/api/assets/export/10002`, {
      method: 'POST',
      headers: { ...json, ...headers },
      body: JSON.stringify({ ...item(10002), tokenId: 2 })
    })

  test('rejects an unsigned request with 401', async () => {
    const { baseUrl, tables } = await startApi()
    expect((await request(baseUrl, {})).status).toBe(401)
    expect(tables.get('target')!.has(10002)).toBe(false)
  })

  test('rejects a signature older than five minutes with 401', async () => {
    const { baseUrl } = await startApi()
    const fields = { action: 'export', assetId: 10002, tokenId: 2 } as const
    expect((await request(baseUrl, await signedHeaders(holder, fields, { issuedAt: SIX_MINUTES_AGO }))).status).toBe(
      401
    )
  })

  test('rejects a signer who did not export the token with 403', async () => {
    const { baseUrl, tables } = await startApi()
    const headers = await signedHeaders(stranger, { action: 'export', assetId: 10002, tokenId: 2 })
    expect((await request(baseUrl, headers)).status).toBe(403)
    expect(tables.get('target')!.has(10002)).toBe(false)
  })

  test('adds the item to the target game when the exporter signs', async () => {
    const { baseUrl, tables } = await startApi()
    const headers = await signedHeaders(holder, { action: 'export', assetId: 10002, tokenId: 2 })
    expect((await request(baseUrl, headers)).status).toBe(201)
    expect(tables.get('target')!.has(10002)).toBe(true)
  })
})

describe('GET /api/assets/get/:uid', () => {
  test('stays open to unsigned requests', async () => {
    const { baseUrl } = await startApi()
    const response = await fetch(`${baseUrl}/api/assets/get/10001`)
    expect(response.status).toBe(200)
    expect((await response.json()).asset.uid).toBe(10001)
  })
})
