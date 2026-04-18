# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS

## Artifacts

- `artifacts/job-portal` — Main React+Vite frontend (previewPath: /)
- `artifacts/api-server` — Express 5 API server (previewPath: /api)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── job-portal/         # React+Vite frontend – Job Portal SPA
│   └── api-server/         # Express API server
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
│   └── src/seed.ts         # Database seed script
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Application Features

### Job Portal & Exam Resource Hub
- **Dashboard**: Overview stats – total jobs, applications, pending reviews, messages
- **Job Directory**: Tabs for IT, Non-IT, State Govt (KPSC), Central Govt (SSC/UPSC/Railway)
- **Job Cards**: Title, company, location, shift, salary, dates, eligibility, Apply button
- **Job Details**: Full description, step-by-step guide, eligibility, HR contact
- **Application Tracker**: All applied jobs with status (Pending/Reviewed/Interview/Offered/Rejected)
- **PG-CET Hub**: Exam dates, apply links, study materials (PDF/Video/Notes/Practice Tests)
- **HR Inbox**: Send messages to HR, receive automated HR replies

## Database Schema

### Tables
- `jobs` – Job listings (category: IT/NON_IT/STATE_GOVT/CENTRAL_GOVT)
- `applications` – User applications with status tracking
- `messages` – HR messages and automated replies
- `exams` – PG-CET exam resources
- `study_materials` – Study materials linked to exams

## API Routes

- `GET /api/jobs?category=IT|NON_IT|STATE_GOVT|CENTRAL_GOVT`
- `GET /api/jobs/:id`
- `GET /api/jobs/:id/applicant-count`
- `GET /api/applications`
- `POST /api/applications`
- `PATCH /api/applications/:id/status`
- `GET /api/messages`
- `POST /api/messages`
- `GET /api/exams`
- `GET /api/exams/:id`
- `GET /api/study-materials`

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
- `pnpm --filter @workspace/scripts run seed` — seeds database with sample data

## Packages

### `artifacts/job-portal` (`@workspace/job-portal`)

React + Vite SPA. Single-page application with React Router. Uses React Query for data fetching.

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Schema: jobs, applications, messages, exams, study_materials.

- `pnpm --filter @workspace/db run push` — push schema to database
- `pnpm --filter @workspace/db run push-force` — force push (development)

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec in `openapi.yaml`. Run codegen: `pnpm --filter @workspace/api-spec run codegen`
