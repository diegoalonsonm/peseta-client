# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Peseta is a personal finance tracking PWA built with Next.js 14 (App Router). The application allows users to log incomes and expenses, view transaction history, and maintain a positive monthly balance. This is the client-side repository that communicates with a backend API running on `localhost:3930`.

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 14.1.4 with App Router
- **UI**: React 18 with TypeScript
- **Styling**: Bootstrap 5.3.3 + custom CSS (globals.css)
- **Icons**: Tabler Icons React 3.1.0
- **HTTP Client**: Axios 1.6.8 (with credentials enabled for cookie-based auth)
- **Alerts**: SweetAlert2 11.10.7
- **Build**: TypeScript 5 with strict mode

## Architecture Patterns

### Authentication Flow

The app uses **cookie-based authentication** with the backend API:

```typescript
// Enable credentials for all axios requests
axios.defaults.withCredentials = true

// Email is stored in localStorage for client-side reference
localStorage.setItem('email', email)  // After successful login
```

**Protected page pattern**: All protected pages check authentication on mount:

```typescript
useEffect(() => {
  const email = localStorage.getItem('email')
  if (!email) {
    router.push('/login')
    return
  }

  axios.get(`${process.env.NEXT_PUBLIC_API_URL}/endpoint`)
    .then(res => {
      if (res.status === 401) router.push('/login')
      // Handle success
    })
}, [])
```

### API Integration

All API calls follow this pattern:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL  // http://localhost:3930
const email = localStorage.getItem('email')

// Standard GET request
axios.get(`${API_URL}/incomes/${email}`)
  .then(res => setState(res.data))
  .catch(err => console.log(err))

// Standard POST request
axios.post(`${API_URL}/expense`, formData)
  .then(res => {
    Swal.fire({ title: 'Success!', icon: 'success' })
    router.push('/')
  })
```

### State Management

- **No global state library** - uses React hooks (useState, useEffect) only
- **Session persistence**: Email stored in `localStorage`
- **Data fetching**: Client-side only via useEffect + axios
- **All pages use `'use client'` directive** (no SSR/SSG)

### Component Architecture

**Reusable components** (`/app/components/`):
- `Button.tsx` - Typed button component with optional icon
- `Input.tsx` - Typed input component
- `Layout.tsx` - HTML/body wrapper (loads Bootstrap JS dynamically)
- `Navbar.tsx` - Bootstrap offcanvas navigation
- `IncomeExpenseCard.tsx` - Transaction display card with category icons

**Type definitions** are in `/types.ts` at root level.

### Routing Structure

```
/                        # Dashboard (last 5 transactions + balance)
/login                   # Login page
/register                # Registration page
/resetPassword           # Password reset (UI only)
/expense                 # Add new expense
/expense/all             # View all expenses with total
/expense/[expenseId]     # Detail view (stub - not implemented)
/income                  # Add new income
/income/all              # View all incomes with total
/profile                 # View user profile
/profile/edit            # Edit profile (not fully implemented)
/stats                   # Statistics page (stub - "coming soon")
```

### Category System

The app uses a **predefined category system** (IDs 1-15) for transactions:

- Categories are referenced by ID in API calls
- `IncomeExpenseCard.tsx` maps category IDs to Tabler Icons
- 15 different icon types: Briefcase, Home, Car, Utensils, etc.

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3930
```

The `NEXT_PUBLIC_` prefix makes it available to browser code.

## Styling Approach

- **Bootstrap 5.3.3** for layout and utilities (container, row, col, btn-*, form-*)
- **Custom CSS** in `app/globals.css`:
  - `.width-50`: Responsive width (50% desktop, 90% mobile <500px)
  - Profile picture sizing: 200x200px desktop, 100x100px mobile
  - Light background: `#f8f8f8`
- Bootstrap JS is dynamically imported in `Layout.tsx` useEffect
- **No CSS modules** - all styles are global or Bootstrap utilities

## Important Files

- `/types.ts` - TypeScript type definitions for component props
- `/app/layout.tsx` - Root layout with metadata and global imports
- `/app/components/Layout.tsx` - Custom HTML wrapper component
- `/app/globals.css` - Global styles
- `.env.local` - Environment configuration (not in git)

## Known Limitations

- Stats page is a placeholder ("Module coming soon")
- Dynamic expense route `[expenseId]` exists but not implemented
- Profile edit page UI exists but functionality incomplete
- No input validation on forms
- Error handling is basic (console.log only)
- No error boundaries
- localStorage-only session (no refresh token handling)

## Development Notes

- **All pages require `'use client'`** directive (client-side rendering)
- **Email is the primary user identifier** (not user ID) for API requests
- **Bootstrap components** may require client-side JS - ensure Bootstrap JS is loaded
- **Tabler Icons** are used instead of the legacy icon components in `/app/components/Icons/`
- **SweetAlert2** is the standard for user-facing alerts/modals
