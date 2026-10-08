# PantheonProtocol project guide

PantheonProtocol turns game items into NFTs: a React Router web app with an Express API, Solidity contracts on a local Hardhat chain, Supabase for the game-asset tables and images, and Pinata for IPFS. This page covers what an agent needs to work in the repository.

Contents:

1.  [Workloads](#workloads)
1.  [Commands](#commands)
1.  [Conventions](#conventions)
1.  [Deploys](#deploys)

## Workloads

- **`apps/web/`:** one package with two entry points.
  - The single-page app: React Router 7 in SPA mode (`ssr: false`), React 19, styled-components, wagmi and viem. Routes are listed in `app/routes.ts`; the code is layered into `app/core/` (entities, value objects, repository interfaces), `app/application/` (use cases), `app/infrastructure/` (contract, Pinata, Supabase and HTTP repositories) and `app/presentation/` (routes, components, view models).
  - The Express API, `app/server.ts`, which serves `/api/health`, the `/api/assets/{get,export,remove}/:uid` routes against the Supabase tables, and `/api/ipfs/upload-url`, which signs a short-lived Pinata upload URL so the browser never holds the Pinata JWT. `createApiApp` in `app/presentation/routes/api/` builds it from injected dependencies, and `create-api-app.test.ts` beside it tests the routes against fakes.
  - Every route that changes a table or spends Pinata quota (`upload-url`, `remove`, `export`) needs an EIP-191 signature from the player's wallet, in the `x-wallet-*` headers. `app/core/auth/api-auth.ts` defines the signed message; the API rejects signatures older than five minutes and checks on-chain that the signer holds the minted token (`remove`) or exported it (`export`). `GET /api/assets/get/:uid` and `/api/health` stay open.
  - `database-init/` holds the Prisma schema for the `source_game_assets` and `target_game_assets` tables and the seed script, which uploads `database-init/assets/game_asset_images/` to a Supabase Storage bucket.
- **`apps/contracts/`:** Hardhat 2 with the viem toolbox. `contracts/` holds `AssetNFT` (ERC-721 with ERC-2981 royalties), `Marketplace` (escrowed listings) and `ExportManager` (burns a token and records the export). `ignition/modules/DeployContracts.ts` deploys all three.

## Commands

Run these from the repository root unless noted.

- `bun install`: installs the repository tooling (Prettier, Husky, commitlint, lint-staged) and the Git hooks.
- `bun run check`: Prettier's check, then a frozen install, ESLint, typecheck, `bun test` and build of `apps/web/` (with `.env.example` as its env), then a frozen install and compile of `apps/contracts/`.
- `bun run lint`: Prettier's check. `bun run lint:fix` writes Prettier's formatting.
- In `apps/contracts/`: `bun run node` starts a Hardhat node on `http://127.0.0.1:8545`, `bun run deploy` deploys the contracts to it, and `bun run new` cleans, compiles and starts a node.
- In `apps/web/`: `bun run dev` (the app on `http://localhost:5173`), `bun run dev:server` (the API on `SERVER_PORT`, 3001 in `.env.example`), `bun run lint`, `bun run typecheck`, `bun run test`, `bun run build`, `bun run db:migrate` and `bun run db:seed`.

## Conventions

- **Environment:** one `.env` at the repository root, copied from `.env.example`. Vite reads it through `envDir: '../..'`, and the `dev:server`, `db:migrate` and `db:seed` scripts load it with `tsx --env-file=../../.env`. Vite bundles every `VITE_` variable into the browser app, so secrets (`PINATA_JWT`, `SUPABASE_SERVICE_ROLE_KEY`) must never carry that prefix. The contract addresses in `.env.example` are the ones a fresh Hardhat node assigns on the first deploy.
- **Package managers:** bun everywhere, with one `bun.lock` per app and one at the root; there are no workspaces.
- **Formatting and linting:** Prettier formats every file type it supports. It doesn't format Solidity. ESLint in `apps/web/` runs the JavaScript and typescript-eslint recommended rules plus the classic React hooks rules; the app doesn't use React Compiler, so the compiler rules are off.
- **Whitespace:** `.editorconfig` has one `[*]` section (UTF-8, LF, a final newline, 2-space indents, no trailing whitespace). Number ordered Markdown lists as `1.  ` and indent the rest of each item 4 spaces.
- **Commits:** Conventional Commits, with headers of at most 50 characters, enforced by commitlint in the `commit-msg` hook. The `pre-commit` hook runs Prettier on staged files.
- **Secrets:** never commit them. `.env` is ignored; only `.env.example` is tracked.

## Deploys

Nothing is deployed, and the repository has no CI. The contracts run on a local Hardhat node, and the web app and API run with the dev servers.
