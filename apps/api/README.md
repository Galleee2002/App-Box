# Lovebox API (Neon)

REST API that syncs Lovebox capsules to **Neon Postgres**. The mobile app never connects to Neon directly.

## Setup

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

See [docs/SYNC_NEON.md](../../docs/SYNC_NEON.md) for end-to-end configuration with the Expo app.
