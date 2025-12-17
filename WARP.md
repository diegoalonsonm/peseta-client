# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common commands

### Install dependencies
- `npm ci`
  - Uses `package-lock.json` for a clean, reproducible install.

### Run the app (development)
- `npm run dev`
  - Starts Next.js in dev mode.

### Production build / run
- `npm run build`
- `npm run start`

### Lint
- `npm run lint`

Lint a single file (useful when fixing one failing file):
- `npm run lint -- --file app/page.tsx`

### Tests
- No test runner/scripts are currently configured in `package.json`.

## Architecture overview (big picture)

This is a Next.js (App Router) client for “Cash Controller”. The application is mostly implemented as client components that call a separate backend API over HTTP.

### Routing and UI composition
- Routes live under `app/` using Next.js App Router conventions:
  - `app/page.tsx`: Home/dashboard (balance + last 5 incomes/expenses)
  - `app/login/page.tsx`, `app/register/page.tsx`, `app/resetPassword/page.tsx`: auth flows
  - `app/income/page.tsx`, `app/income/all/page.tsx`: create income + list all incomes
  - `app/expense/page.tsx`, `app/expense/all/page.tsx`: create expense + list all expenses
  - `app/profile/page.tsx`, `app/profile/edit/page.tsx`: view/edit user profile
  - `app/stats/page.tsx`: placeholder
  - `app/expense/[expenseId]/page.tsx`: currently a placeholder for a dynamic route

- `app/layout.tsx` is the Next.js root layout. It wraps the app in `app/components/Layout.tsx`.
- `app/components/Layout.tsx` conditionally hides the `Navbar` on auth-related routes (`/login`, `/register`, `/resetPassword`). It also loads Bootstrap JS on the client via a dynamic `require()`.

### Shared components and types
- Shared UI components live in `app/components/` (e.g. `Navbar`, `Button`, `Input`, `IncomeExpenseCard`).
- Shared TypeScript prop types are centralized in `types.ts` and imported via the `@/…` path alias (configured in `tsconfig.json`).

### Backend/API integration
- Most pages call the backend directly with `axios` and set `axios.defaults.withCredentials = true` to send cookies.
- The base API URL is expected via `NEXT_PUBLIC_API_URL` (see `.env.local`).
- The app stores the current user’s email in `localStorage` under the key `email`, and many API calls use it (e.g. `/users/balance/:email`, `/expenses/:email`, `/incomes/:email`).

Notable detail:
- Most requests use `${process.env.NEXT_PUBLIC_API_URL}/…`, but logout in `app/components/Navbar.tsx` is currently hard-coded to `http://localhost:3930/logout`.

### Styling
- Bootstrap CSS is imported globally in `app/layout.tsx`.
- Global CSS is in `app/globals.css`.

## Notes about repo-local agent rules
- No project-wide Claude/Cursor/Copilot instruction files were found (e.g. `CLAUDE.md`, `.cursorrules`, `.cursor/rules/`, `.github/copilot-instructions.md`).
- There is a local `.claude/settings.local.json`, but it only contains tool permission configuration and does not define coding conventions for this repo.
