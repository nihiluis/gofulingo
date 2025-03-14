# Gofulingo
App to save vocabulary and showing simple flash cards for memorization. Built to test React Native for web.

## Getting started
**Env vars**
```bash
# api/.env
DATABASE_URL=postgres://...
GOOGLE_API_KEY=...
GOOGLE_MODEL_ID=gemini-2.0-flash-exp
# frontend/.env.local
EXPO_PUBLIC_BACKEND_API_URL=http://localhost:3000
```

**Drizzle**
```bash
# Overwrite database schema
npx drizzle-kit push
# Generate migrations
npx drizzle-kit generate
# Apply migrations
npx drizzle-kit migrate
```

**Local run**
```bash
# frontend
npm run openapi-generate
npm run dev
npm run build:web
# api
bun run dev
bun run build
```