# AI Agent Hub

> ⚠️ This README is auto-generated from the documentation in `src/content/docs`. Please edit the source files instead.
> To regenerate this file, run: `npx ts-node scripts/generate-docs.ts`

Welcome to the AI Agent Hub - a powerful platform for building, deploying, and managing AI agents as standardized microservices.

## Quick Links
- [Getting Started](/docs/getting-started)
- [Core Concepts](/docs/core-concepts)
- [API Reference](/docs/api-reference)
- [Testing](/docs/core-concepts/testing)

## Overview

AI Agent Hub enables platform developers to build and ship AI models as standardized microservices, while allowing users to browse, deploy, and manage personalized agent instances.

### For Platform Developers
- Build and ship AI models as standardized services
- Define clear API contracts and documentation
- Monitor usage and performance metrics
- Standardized testing and deployment workflows

### For Platform Users
- Browse and discover AI models in the marketplace
- Deploy personalized agent instances
- Connect agents with third-party services
- Monitor agent performance and usage

## Getting Started

1. Clone and install:
```bash
git clone https://github.com/derekg1729/ai-platform
cd ai-platform
npm install
```

2. Set up the database:
```bash
# Create a PostgreSQL database
createdb ai_platform

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npx prisma migrate dev
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Jest + React Testing Library

### Backend
- Rust
- Actix-web
- Prisma
- PostgreSQL

### Testing
- Jest
- React Testing Library
- Integration tests
- End-to-end tests

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── (routes)/          # Main application routes
│   │   ├── agents/        # Agent management
│   │   ├── marketplace/   # Model marketplace
│   │   ├── analytics/     # Usage statistics
│   │   └── docs/          # Documentation
│   └── api/               # API routes
├── components/            # Reusable UI components
├── lib/                   # Utilities and services
│   ├── api/              # API client functions
│   ├── services/         # Business logic
│   ├── validation/       # Schema validation
│   └── utils/            # Helper functions
├── types/                # TypeScript definitions
└── __tests__/           # Test files
    ├── unit/            # Unit tests
    ├── integration/     # Integration tests
    └── setup/           # Test setup files
```






## Documentation

For complete documentation, please visit our [documentation page](/docs).

## License

MIT License - see LICENSE for more details.
