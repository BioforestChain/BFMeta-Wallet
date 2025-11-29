# BFMeta-Wallet (English)
For Chinese version please see [README-zh](README-zh.md).

## Overview
BFMeta desktop wallet application: account management, transfers, signing, and network interaction for BFMeta chains.

## Getting Started
1) Install deps: `pnpm install`
2) Dev run: `pnpm dev`
3) Build: `pnpm build` (or platform-specific script if provided)
4) Configure node endpoints and network settings in app config before connecting to mainnet.

## Contribution
- Product app: keep UX strings bilingual; avoid `any`/`@ts-ignore`.
- Separate UI components and service logic; reuse shared hooks/utils to stay DRY.
- Add minimal regression tests for new flows (send, import key, settings).
- Branch naming `feature/<scope>` / `fix/<issue>`; concise commit messages.
