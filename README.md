# BFMeta-Wallet (English)
For Chinese version please see [README-zh](README-zh.md).

## Overview
Monorepo desktop wallet for BFMeta. Provides account/key management, transfers, signing, network switching, and multi-chain adapters.

## Architecture
- Workspaces: see `packages/`
  - `wallet` UI/application shell
  - chain adapters: `bcf`, `bsc`, `eth`, `tron`
  - shared libs: `helpers`, `typings`, `test`
- Tooling: `lerna.json`, `pnpm-workspace.yaml`, `tsconfig*.json` for multi-target builds
- Config: `config/` app configs; `scripts/` helper scripts

## Getting Started
```bash
pnpm install          # install workspace deps
pnpm dev              # run dev app (per package scripts may proxy)
pnpm build            # full build
```
Before connecting to mainnet, update endpoint/network settings in `config/` or env files.

## Contribution Guide
- Layer 2A product → GPLv3; keep TypeScript strict, avoid `any`/`@ts-ignore`.
- UI vs services: keep UI components thin; business logic in shared helpers/adapters (DRY/SRP).
- Tests: add minimal regression for send/import/settings flows in `packages/test` when touching related code.
- Branches: `feature/<scope>` / `fix/<issue>`; concise verb commits.
