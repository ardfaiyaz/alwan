# Lib Directory

Core libraries, utilities, and shared functionality used across the application.

## Structure

```
lib/
├── api/              # API client configuration
├── auth/             # Authentication utilities
├── config/           # Application configuration
├── constants/        # Application constants
├── hooks/            # Global React hooks
├── rbac/             # Role-based access control
├── supabase/         # Supabase client setup
├── types/            # Global TypeScript types
├── utils/            # Utility functions
├── validations/      # Zod validation schemas
└── utils.ts          # Common utilities (cn, etc.)
```

## Modules

### api/
API client configuration, interceptors, and request/response handlers.

### auth/
Authentication utilities, session management, and auth helpers.

### config/
Application configuration including feature flags, environment variables, and app settings.

### constants/
Application-wide constants including routes, roles, status codes, and business rules.

### hooks/
Global React hooks that can be used across features:
- `useAuth` - Authentication state
- `usePermissions` - Permission checking
- `useDebounce` - Debounced values
- etc.

### rbac/
Role-based access control logic, permission checking, and authorization utilities.

### supabase/
Supabase client initialization for server and client components.

### types/
Global TypeScript type definitions and interfaces.

### utils/
Utility functions for common operations:
- Date formatting
- Currency formatting
- String manipulation
- Array operations
- etc.

### validations/
Zod schemas for data validation across the application.

## Usage

```typescript
// Import from lib modules
import { ROUTES, ROLES } from '@/lib/constants'
import { appConfig } from '@/lib/config'
import { formatCurrency } from '@/lib/utils/formatters'
import { createClient } from '@/lib/supabase/client'
```

## Best Practices

- Keep utilities pure and side-effect free
- Document complex functions with JSDoc
- Add unit tests for utility functions
- Use TypeScript for type safety
- Export through index files for clean imports
