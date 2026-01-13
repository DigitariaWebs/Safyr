# Safyr

A monorepo containing web and mobile applications.

## Structure

- `web/`: Next.js web application
- `mobile/`: Expo React Native mobile application

## Setup

This project uses bun workspaces.

1. Install bun if you haven't already.
2. Run `bun install` at the root to install dependencies for all workspaces.
3. To run the web app: `cd web && bun dev`
4. To run the mobile app: `cd mobile && bun start`

## Development

- Use bun for package management.
- Shared types and interfaces should go in `web/src/types.d.ts` or `mobile/src/types.d.ts` as appropriate, or create a shared package if needed.