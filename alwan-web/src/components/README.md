# Components Directory

React components organized by purpose and scope.

## Structure

```
components/
├── admin/            # Admin dashboard components
├── auth/             # Authentication components
├── features/         # Feature-specific components (cross-feature)
├── layout/           # Layout components (Header, Footer, Sidebar)
├── sections/         # Page sections (Hero, Features, etc.)
├── shared/           # Shared/common components
├── skeletons/        # Loading skeleton components
├── ui/               # Base UI components (shadcn/ui)
└── providers.tsx     # Context providers wrapper
```

## Component Categories

### admin/
Components specific to the admin dashboard:
- Dashboard widgets
- Admin tables
- Admin forms
- Admin modals

### auth/
Authentication-related components:
- Login forms
- Registration forms
- Password reset
- Auth modals

### features/
Components that span multiple features or don't belong to a single feature module.

### layout/
Layout components that structure the application:
- `Header` - Top navigation
- `Footer` - Bottom footer
- `Sidebar` - Side navigation
- `ConditionalLayout` - Layout switcher

### sections/
Large page sections for marketing/landing pages:
- Hero sections
- Feature showcases
- Testimonials
- Call-to-action sections

### shared/
Reusable components used across the application:
- Cards
- Badges
- Alerts
- Empty states
- Error states

### skeletons/
Loading skeleton components for better UX during data fetching.

### ui/
Base UI components from shadcn/ui:
- Button
- Input
- Dialog
- Select
- etc.

## Usage

```typescript
// Import components
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { MemberCard } from '@/features/members/components/MemberCard'
```

## Best Practices

- Keep components small and focused
- Use TypeScript for props
- Document complex components with JSDoc
- Use composition over inheritance
- Prefer server components when possible
- Add proper error boundaries
- Make components accessible (ARIA labels, keyboard navigation)
