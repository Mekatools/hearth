# Architecture & Technical Decisions

## 1. Hosting & Infrastructure
- **Platform**: 100% Cloudflare (Pages for static frontend, Workers + Durable Objects for backend).
- **Zero Account Model**: WebCrypto keypairs (ECDSA P-256) generated in the browser and stored in IndexedDB. Public key hash serves as the user's permanent ID.
- **Repository Strategy**: pnpm workspace monorepo with `apps/web`, `apps/worker`, `packages/shared`, and `ui/`.

## 2. Frontend Framework Choice
- **Choice**: Solid.js + TypeScript + Vite.
- **Why**: Extremely fast fine-grained reactivity, ultra-lightweight bundle size (< 15kB base vs 40kB+ React), no virtual DOM overhead, ideal for high-frequency chat message streams on low-end devices.

## 3. Real-Time Protocol
- **Transport**: WebSockets via Cloudflare Durable Objects Hibernation API (free-tier friendly, sleeps when idle).
- **Payloads**: Strongly typed JSON events defined in `packages/shared`.
