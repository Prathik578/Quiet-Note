# Anonymous Feedback Box

A private feedback inbox that gives people a simple way to share honest thoughts anonymously. Create a personal inbox, share its link, and manage incoming feedback from a focused dashboard.

## Features

- Clerk-powered sign in and sign up
- Private dashboard for managing your feedback inbox
- Public feedback form with shareable inbox links
- Anonymous feedback submission flow
- Responsive interface built with React and Tailwind CSS
- Accessible UI components powered by Radix UI and shadcn conventions
- Client-side routing with Wouter
- React Query support for API data and cache management

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Clerk authentication
- TanStack React Query
- Wouter
- Radix UI
- Lucide React

## Getting Started

### Prerequisites

- Node.js 20 or newer
- pnpm
- A configured Clerk application

### Installation

From the project directory, install dependencies:

```bash
pnpm install
```

Create a `.env` file and add the Clerk publishable key:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Start the development server:

```bash
pnpm dev
```

The app will be available at the local URL printed by Vite.

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite development server |
| `pnpm build` | Create a production build |
| `pnpm serve` | Preview the production build locally |
| `pnpm typecheck` | Run the TypeScript type checker |

## Routes

- `/` — Landing page and signed-in redirect
- `/sign-in` — Clerk sign-in page
- `/sign-up` — Clerk sign-up page
- `/dashboard` — Authenticated feedback dashboard
- `/feedback/:token` — Public anonymous feedback form

## Project Structure

```text
src/
├── components/       Reusable application and UI components
├── hooks/             Shared React hooks
├── lib/               Utility functions
├── pages/             Route-level page components
├── App.tsx            Providers, routing, and authentication setup
├── index.css          Global styles and design tokens
└── main.tsx           Application entry point
public/                Static assets such as the logo and favicon
```

## Deployment

This project is configured for Vercel deployment as a Vite application. Set the required environment variables in the Vercel project before deploying:

- `VITE_CLERK_PUBLISHABLE_KEY`

Run a production build locally before deployment to verify the output:

```bash
pnpm build
```

## License

This project is private and intended for use by its maintainers.
