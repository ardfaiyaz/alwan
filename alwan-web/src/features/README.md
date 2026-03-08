# Features Directory

This directory contains feature modules organized by domain. Each feature is self-contained with its own API, components, hooks, types, and utilities.

## Structure

Each feature module follows this structure:

```
feature-name/
├── api/              # Server actions and API calls
├── components/       # Feature-specific components
├── hooks/            # Feature-specific React hooks
├── types/            # TypeScript type definitions
├── utils/            # Utility functions and helpers
└── index.ts          # Public API exports
```

## Available Features

- **members**: Member management (CRUD operations, profiles)
- **loans**: Loan application and management
- **collections**: Weekly collection sheets
- **approvals**: Loan approval workflows
- **centers**: Center management
- **staff**: Staff and user management
- **audit**: Audit logging and history

## Usage

Import from the feature's public API:

```typescript
// ✅ Good - Use public API
import { getMembers, Member } from '@/features/members'

// ❌ Bad - Don't import internal modules directly
import { getMembers } from '@/features/members/api/member.actions'
```

## Creating a New Feature

1. Create the feature directory structure
2. Add types in `types/index.ts`
3. Add server actions in `api/*.actions.ts`
4. Add components in `components/`
5. Add hooks in `hooks/`
6. Export public API in `index.ts`

## Best Practices

- Keep features independent and loosely coupled
- Use the public API (`index.ts`) for exports
- Document complex logic with JSDoc comments
- Add proper error handling and logging
- Write unit tests for business logic
