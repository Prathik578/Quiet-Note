# Anonymous Feedback Box

A privacy-first inbox where anyone can send anonymous feedback through a shareable link, while only the authenticated owner can read or delete messages.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/anonymous-feedback-box/` — React/Vite web app with the landing page, Clerk auth routes, dashboard, public feedback form, and visual theme.
- `artifacts/api-server/src/routes/` — Express API routes for owner auth bootstrap, inbox access, message deletion, public-link validation, and anonymous submission.
- `lib/api-spec/openapi.yaml` — source of truth for the API contract and generated client hooks.
- `lib/db/src/schema/` — Drizzle schema for owners and feedback messages.

## Architecture decisions

- Clerk owns browser authentication and sessions; API authorization uses the Clerk user ID on every protected request.
- The local user record is provisioned just in time on the first authenticated API request and receives an unpredictable public token for sharing.
- Public feedback endpoints can validate a link or create a trimmed message, but never expose inbox data.
- Inbox reads and deletes are scoped by both authenticated owner ID and feedback ID at the database query layer.

## Product

- Public landing page explains anonymous feedback and directs owners to create an inbox.
- Authenticated owners receive a private link, can copy it, see received messages and timestamps, and delete their own messages.
- Anonymous visitors submit up to 2,000 trimmed characters without entering identity details and receive clear success or error feedback.

## User preferences

No additional preferences recorded.

## Gotchas

- Keep Clerk proxy middleware mounted before Express body parsers for production auth proxying.
- Use the generated API hooks from `@workspace/api-client-react`; regenerate them after any OpenAPI contract change.
- Artifact build commands require workflow-provided `PORT` and `BASE_PATH`; use the artifact workflow or set both when invoking Vite directly.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
