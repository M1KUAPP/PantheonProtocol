<a id="readme-top"></a>

<!-- PROJECT LOGO -->

<br />
<div align="center">
  <a href="https://github.com/M1KUAPP/PantheonProtocol">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="/docs/readme/banner-dark.png">
      <img src="/docs/readme/banner-light.png" alt="PantheonProtocol banner">
    </picture>
  </a>

  <h3>PantheonProtocol</h3>

  <p>
    An NFT marketplace for game items that mints them out of one game, trades them on-chain with royalties, and exports them into another game.
    <br />
    <a href="#getting-started"><strong>Run Locally »</strong></a>
    &middot;
    <a href="#screenshots">Screenshots</a>
    &middot;
    <a href="https://github.com/M1KUAPP/PantheonProtocol/issues/new?labels=bug">Report a Bug</a>
    <br />
  </p>

[![TypeScript][typescript-badge]][typescript-url]
[![Solidity][solidity-badge]][solidity-url]
[![React][react-badge]][react-url]
[![React Router][reactrouter-badge]][reactrouter-url]
[![styled-components][styledcomponents-badge]][styledcomponents-url]
[![wagmi][wagmi-badge]][wagmi-url]
[![Express][express-badge]][express-url]
[![Prisma][prisma-badge]][prisma-url]
[![PostgreSQL][postgresql-badge]][postgresql-url]
[![Supabase][supabase-badge]][supabase-url]
[![Ethereum][ethereum-badge]][ethereum-url]
[![Hardhat][hardhat-badge]][hardhat-url]
[![OpenZeppelin][openzeppelin-badge]][openzeppelin-url]
[![IPFS][ipfs-badge]][ipfs-url]
[![Bun][bun-badge]][bun-url]
[![Vite][vite-badge]][vite-url]

</div>

<!-- TABLE OF CONTENTS -->

## Table of Contents

<details>
  <summary>Expand</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#screenshots">Screenshots</a></li>
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#architecture">Architecture</a></li>
        <li><a href="#tech-stack">Tech Stack</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#team">Team</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

PantheonProtocol moves items between two games through the blockchain. Each game keeps its items in its own table: `source_game_assets` for the game an item comes from, and `target_game_assets` for the game it goes to.

A player enters an item's ID from the source game, and the web app mints it as an ERC-721 NFT. The image and metadata are pinned to IPFS, and the item is removed from the source game. While it's an NFT, the player can keep it in their inventory or sell it on an escrowed marketplace that pays the creator a royalty on every sale. The owner can then export it: the export contract burns the token, and the item is written into the target game's table.

The repository has two workloads. `apps/web/` holds the React Router single-page app and the Express API that reads and writes the game tables in Supabase. `apps/contracts/` holds the three Solidity contracts and the Hardhat setup that runs them on a local chain. Nothing is deployed to a public network.

Built as coursework, where it earned an A+.

<p align="right"><a href="#readme-top">&uarr;</a></p>

### Screenshots

<table>
  <tr>
    <td width="50%" valign="top" align="left">
      <img src="/docs/readme/screenshots/about.png" alt="Landing page about section" width="100%">
      <br />
      <strong>Landing Page</strong> · The about section, with a fanned carousel of showcase art.
    </td>
    <td width="50%" valign="top" align="left">
      <img src="/docs/readme/screenshots/showcase.png" alt="Landing page showcase" width="100%">
      <br />
      <strong>Showcase</strong> · Rows of sample NFTs that scroll in opposite directions.
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top" align="left">
      <img src="/docs/readme/screenshots/nft-details.png" alt="NFT details" width="100%">
      <br />
      <strong>NFT Details</strong> · An owned item's metadata from IPFS: type, rarity, attributes and listing status.
    </td>
    <td width="50%" valign="top" align="left">
      <img src="/docs/readme/screenshots/marketplace-filters.png" alt="Marketplace filtered to weapons" width="100%">
      <br />
      <strong>Marketplace Filters</strong> · Listings filtered to weapons and sorted by price.
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top" align="left">
      <img src="/docs/readme/screenshots/transaction-history.png" alt="Transaction history" width="100%">
      <br />
      <strong>Transaction History</strong> · The wallet's recent transactions, read from the chain.
    </td>
    <td width="50%" valign="top" align="left">
      <img src="/docs/readme/screenshots/dashboard-light.png" alt="Dashboard in the light theme" width="100%">
      <br />
      <strong>Light Theme</strong> · The dashboard in the light theme, which follows the system setting.
    </td>
  </tr>
</table>

<p align="right"><a href="#readme-top">&uarr;</a></p>

### How It Works

The screens below come from the app running locally against a Hardhat node and a local Supabase. Pinata was mocked, because no Pinata account was used.

1.  **Connect a wallet.** The landing page at `/` introduces the platform. **Connect Wallet** connects MetaMask, or any injected wallet, on the Hardhat chain (ID 31337), and the app pages open from the header.

    <img src="/docs/readme/steps/1-connect.png" alt="Landing page with Connect Wallet" width="100%">

2.  **Mint a game item.** On `/create-nft`, the player enters an item's ID from the source game. The app fetches the item from the API, and the wallet signs one message that authorizes the mint. The app downloads the item's image, pins it and the metadata to IPFS through signed Pinata upload URLs from the API, and mints the NFT with the item's ID recorded on-chain. Finally, the API checks that the signer holds the new token and removes the item from the source game.

    <img src="/docs/readme/steps/2-mint.png" alt="Create NFT page after a successful mint" width="100%">

3.  **Open the inventory.** `/inventory` shows every NFT the wallet owns, with metadata from IPFS, and counts the NFTs it owns, has exported and has listed.

    <img src="/docs/readme/steps/3-inventory.png" alt="Inventory with owned NFTs" width="100%">

4.  **List an item for sale.** **List for Sale** takes a price in ETH. On **Confirm**, the app approves the marketplace for the token, if it isn't approved yet, and lists it. The marketplace holds the NFT in escrow until it sells or the seller cancels.

    <img src="/docs/readme/steps/4-list.png" alt="List for sale form on an inventory card" width="100%">

5.  **Browse the marketplace.** `/marketplace` shows every active listing. Players search by name, filter by item type and rarity, and sort by price, rarity or a numeric attribute.

    <img src="/docs/readme/steps/5-marketplace.png" alt="Marketplace listings" width="100%">

6.  **Buy an item.** **View Item** opens the listing with its seller, attributes and price. **Buy Now** pays the price, sends the royalty to the royalty receiver and the rest to the seller, and transfers the NFT to the buyer.

    <img src="/docs/readme/steps/6-buy.png" alt="Listing details with Buy Now" width="100%">

7.  **Export it into another game.** **Export to Game** asks the wallet to sign the export, then burns the NFT through the export contract, which records the export on-chain. The API checks that the signer made that export, then writes the item into the target game's table.

    <img src="/docs/readme/steps/7-export.png" alt="Inventory after an export" width="100%">

8.  **Watch the wallet.** `/dashboard` shows the wallet address and its ETH balance in USD, the gas price, the recently added NFTs, and the transaction history from the latest 100 blocks.

    <img src="/docs/readme/steps/8-dashboard.png" alt="Dashboard" width="100%">

<p align="right"><a href="#readme-top">&uarr;</a></p>

### Features

- **Game items as NFTs.** `AssetNFT` is an ERC-721 that stores each token's IPFS metadata URI and the ID of the game item it came from. Minting removes the item from the source game's table.
- **No secrets in the browser.** The API signs a 60-second Pinata upload URL for each pin, and only the API reads the Pinata JWT and the Supabase service-role key.
- **Wallet-signed API requests.** Every API request that changes a game table or spends Pinata quota carries an EIP-191 signature from the player's wallet, one per mint or export. The API rejects signatures older than five minutes, and checks on-chain that the signer holds the minted token or made the export.
- **Escrowed marketplace.** `Marketplace` holds listed NFTs until they sell or the seller cancels. Listing asks for the approval first when it's missing.
- **Creator royalties.** `AssetNFT` implements ERC-2981, with a default 5% royalty to the deployer, and `Marketplace` pays it on every sale.
- **Search, filters and sorting.** Search by name, filter by item type and rarity, and sort by price, rarity or a numeric attribute such as attack.
- **Export to another game.** `ExportManager` burns the token and keeps an export record with the target chain ID and token URI. The API then inserts the item into the target game's table.
- **Wallet dashboard.** The address with a hide toggle, the ETH balance with its USD value from Coinbase, the gas price, recently added NFTs, and on-chain transaction history.
- **Light and dark themes.** The theme follows the system setting, and the header toggle remembers the player's choice.

<p align="right"><a href="#readme-top">&uarr;</a></p>

### Architecture

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/docs/readme/architecture-dark.svg">
  <img src="/docs/readme/architecture-light.svg" alt="PantheonProtocol architecture">
</picture>

Made with [Archify](https://github.com/tt-a1i/archify) from [`architecture.json`](/docs/readme/architecture.json).

<p align="right"><a href="#readme-top">&uarr;</a></p>

### Tech Stack

- **Languages:** TypeScript 5 and Solidity 0.8.28.
- **Frontend:** React 19, React Router 7 in SPA mode, styled-components 6, wagmi 2 and viem 2, TanStack Query 5, GSAP, Swiper, Embla Carousel and react-hot-toast.
- **Backend:** Express 5 run with tsx, supabase-js and the Pinata SDK.
- **Data:** PostgreSQL and Storage on Supabase, Prisma 6 for the schema and seed, and IPFS through Pinata.
- **Blockchain:** Hardhat 2 with the viem toolbox and Ignition, OpenZeppelin Contracts 5, and a local Hardhat node.
- **Tooling:** Bun, Vite 7, ESLint with typescript-eslint, Prettier, Husky and commitlint.

<p align="right"><a href="#readme-top">&uarr;</a></p>

<!-- GETTING STARTED -->

## Getting Started

Everything runs locally: a Hardhat node for the contracts, Supabase (local or hosted) for the game tables and images, and Pinata for IPFS. One `.env` at the repository root configures both apps.

<p align="right"><a href="#readme-top">&uarr;</a></p>

### Prerequisites

- [Bun](https://bun.sh/) 1.4.2 — for every package and script.
- [Node.js](https://nodejs.org/) 20 or later (tested with 26) — for Hardhat, React Router and tsx.
- [Supabase CLI](https://supabase.com/docs/guides/local-development) and [Docker](https://www.docker.com/) — for a local Supabase, or a hosted Supabase project instead.
- A [Pinata](https://pinata.cloud/) account — its JWT and gateway, for minting.
- [MetaMask](https://metamask.io/) or another injected wallet — for signing transactions.

<p align="right"><a href="#readme-top">&uarr;</a></p>

### Installation

1.  **Clone the repo.**

    ```sh
    git clone https://github.com/M1KUAPP/PantheonProtocol.git
    cd PantheonProtocol
    bun install
    ```

2.  **Start the chain and deploy the contracts.** In one terminal, from the repository root:

    ```sh
    cd apps/contracts
    bun install
    bun run node     # http://127.0.0.1:8545, prints 20 funded test accounts
    ```

    In a second terminal, from `apps/contracts/`, run `bun run deploy`. On a fresh node, the contracts get the addresses already in `.env.example`.

3.  **Start Supabase.** For a local instance, run these in a folder outside the repository. `supabase status` prints the API URL, service-role key and database URL.

    ```sh
    supabase init
    supabase start
    ```

4.  **Configure the environment.** From the repository root:

    ```sh
    cp .env.example .env    # fill in PINATA_JWT, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL
    ```

    `VITE_` variables are bundled into the browser app, so secrets never get that prefix.

5.  **Create and seed the tables.** From `apps/web/`. The seed deletes every row in both tables before it inserts 20 items into each, and uploads their images to the `game_assets` bucket.

    ```sh
    bun install
    bun run db:migrate
    bun run db:seed
    ```

6.  **Start the API and the app.** From `apps/web/`, in two terminals:

    ```sh
    bun run dev:server    # API on http://localhost:3001
    bun run dev           # app on http://localhost:5173
    ```

7.  **Connect a wallet.** In MetaMask, add a network with the RPC URL `http://127.0.0.1:8545`, chain ID `31337` and currency `ETH`. Then import one of the test account private keys that `bun run node` printed. The source game's item IDs start at `10001`. Those keys are public, so never use them on a real network.

8.  **Run the checks.** From the repository root, `bun run check` runs Prettier, then installs, lints, typechecks, tests and builds `apps/web/` and compiles `apps/contracts/`.

    ```sh
    bun run check
    ```

<p align="right"><a href="#readme-top">&uarr;</a></p>

<!-- ROADMAP -->

## Roadmap

See [open issues](https://github.com/M1KUAPP/PantheonProtocol/issues) for a full list of proposed features (and known issues).

<p align="right"><a href="#readme-top">&uarr;</a></p>

<!-- CONTRIBUTING -->

## Team

<a href="https://github.com/M1KUAPP/PantheonProtocol/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=M1KUAPP/PantheonProtocol" alt="PantheonProtocol team" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

<p align="right"><a href="#readme-top">&uarr;</a></p>

<!-- LICENSE -->

## License

See [LICENSE](/LICENSE) for more information.

<p align="right"><a href="#readme-top">&uarr;</a></p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [OpenZeppelin Contracts](https://www.openzeppelin.com/contracts) — ERC-721, ERC-2981 and access-control building blocks.
- [Hardhat](https://hardhat.org) — the local chain and deployment.
- [wagmi](https://wagmi.sh) — wallet and contract hooks.
- [Pinata](https://pinata.cloud) — IPFS pinning and the gateway.
- [Supabase](https://supabase.com) — the game tables and images.
- [Coinbase Prices API](https://docs.cdp.coinbase.com/coinbase-app/track-apis/prices) — the ETH price.
- [Heroicons](https://heroicons.com) and [react-icons](https://react-icons.github.io/react-icons/) — icons.
- [Manrope](https://fonts.google.com/specimen/Manrope) — the typeface.
- [Archify](https://github.com/tt-a1i/archify)
- [contrib.rocks](https://contrib.rocks)
- [Shields.io](https://shields.io)

<p align="right"><a href="#readme-top">&uarr;</a></p>

<!-- MARKDOWN LINKS & IMAGES -->

[typescript-badge]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
[solidity-badge]: https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white
[solidity-url]: https://soliditylang.org/
[react-badge]: https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black
[react-url]: https://react.dev/
[reactrouter-badge]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white
[reactrouter-url]: https://reactrouter.com/
[styledcomponents-badge]: https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=white
[styledcomponents-url]: https://styled-components.com/
[wagmi-badge]: https://img.shields.io/badge/wagmi-000000?style=for-the-badge&logo=wagmi&logoColor=white
[wagmi-url]: https://wagmi.sh/
[express-badge]: https://img.shields.io/badge/Express-0A0A0A?style=for-the-badge&logo=express&logoColor=white
[express-url]: https://expressjs.com/
[prisma-badge]: https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[prisma-url]: https://www.prisma.io/
[postgresql-badge]: https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white
[postgresql-url]: https://www.postgresql.org/
[supabase-badge]: https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white
[supabase-url]: https://supabase.com/
[ethereum-badge]: https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white
[ethereum-url]: https://ethereum.org/
[hardhat-badge]: https://img.shields.io/badge/Hardhat-FFF100?style=for-the-badge
[hardhat-url]: https://hardhat.org/
[openzeppelin-badge]: https://img.shields.io/badge/OpenZeppelin-4E5EE4?style=for-the-badge&logo=openzeppelin&logoColor=white
[openzeppelin-url]: https://www.openzeppelin.com/
[ipfs-badge]: https://img.shields.io/badge/IPFS-65C2CB?style=for-the-badge&logo=ipfs&logoColor=white
[ipfs-url]: https://ipfs.tech/
[bun-badge]: https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white
[bun-url]: https://bun.sh/
[vite-badge]: https://img.shields.io/badge/Vite-9135FF?style=for-the-badge&logo=vite&logoColor=white
[vite-url]: https://vite.dev/
