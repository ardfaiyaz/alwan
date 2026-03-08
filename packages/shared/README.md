# @alwan/shared

Shared utilities, types, constants, and business logic for the Alwan microfinance platform.

## Installation

This package is part of the Alwan monorepo and is used by both `alwan-web` and `alwan-mobile`.

```bash
# From the root of the monorepo
cd packages/shared
npm install
npm run build
```

## Usage

### In alwan-web

```typescript
import { 
  calculateWeeklyPayment, 
  formatCurrency,
  LOAN_CONSTANTS 
} from '@alwan/shared'

const weeklyPayment = calculateWeeklyPayment(10000, 20)
console.log(formatCurrency(weeklyPayment)) // ₱11,000.00
```

### In alwan-mobile

```typescript
import { 
  calculateTotalRepayment,
  formatDate,
  type Loan 
} from '@alwan/shared'

const total = calculateTotalRepayment(5000, 10)
console.log(formatCurrency(total)) // ₱6,000.00
```

## Modules

### Constants (`/constants`)
Business constants shared across the platform:
- Loan limits and rates
- CBU contribution amounts
- Insurance premiums
- Status enums

### Types (`/types`)
TypeScript type definitions:
- User roles
- Loan types and statuses
- Member interfaces
- API response types

### Utils (`/utils`)

#### Calculations (`/utils/calculations`)
Financial calculation functions:
- `calculateWeeklyPayment()` - Calculate loan weekly payment
- `calculateTotalInterest()` - Calculate total interest
- `calculateTotalRepayment()` - Calculate total repayment amount
- `calculateServiceFee()` - Calculate service fee
- `calculateRemainingBalance()` - Calculate remaining balance
- `calculateWeeksOverdue()` - Calculate weeks overdue
- `isValidLoanAmount()` - Validate loan amount
- `isValidLoanTerm()` - Validate loan term

#### Formatters (`/utils/formatters`)
Formatting utilities:
- `formatCurrency()` - Format Philippine Peso
- `formatDate()` - Format dates
- `formatPhoneNumber()` - Format PH phone numbers
- `formatFullName()` - Format full names
- `formatPercentage()` - Format percentages
- `truncateText()` - Truncate long text

## Development

```bash
# Watch mode for development
npm run dev

# Build for production
npm run build

# Clean build artifacts
npm run clean
```

## Testing

```bash
npm test
```

## Best Practices

1. **Pure Functions**: Keep all utilities pure (no side effects)
2. **Type Safety**: Always export types alongside functions
3. **Documentation**: Add JSDoc comments for all public APIs
4. **Testing**: Write unit tests for all business logic
5. **Versioning**: Follow semantic versioning

## Adding New Utilities

1. Create the utility file in the appropriate directory
2. Export it from the module's index file
3. Export it from the root index file
4. Add documentation and tests
5. Update this README

## License

ISC
