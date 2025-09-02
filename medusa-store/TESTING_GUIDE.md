# Testing & Code Quality Guide

## Overview

This guide covers testing strategies, linting configuration, and code quality practices for the Medusa store project.

## Testing

### Test Structure

```
src/
├── api/
│   └── health/
│       ├── route.ts
│       └── __tests__/
│           └── route.test.ts
├── modules/
│   └── custom-module/
│       ├── service.ts
│       └── __tests__/
│           └── service.test.ts
└── utils/
    └── __tests__/
        └── test-helpers.ts
```

### Running Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run all tests (unit + integration)
npm run test:all

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:integration:http
npm run test:integration:modules
```

### Writing Tests

#### Unit Test Example

```typescript
// src/services/__tests__/product.service.test.ts
import { ProductService } from "../product.service";
import { createMockService, createMockDatabase } from "../../utils/__tests__/test-helpers";

describe("ProductService", () => {
  let service: ProductService;
  let mockDb: any;

  beforeEach(() => {
    mockDb = createMockDatabase();
    service = new ProductService({ database: mockDb });
  });

  describe("getProduct", () => {
    it("should return a product by id", async () => {
      const mockProduct = { id: "prod_123", title: "Test Product" };
      mockDb.findOne = jest.fn().mockResolvedValue(mockProduct);

      const result = await service.getProduct("prod_123");

      expect(result).toEqual(mockProduct);
      expect(mockDb.findOne).toHaveBeenCalledWith("prod_123");
    });

    it("should throw error if product not found", async () => {
      mockDb.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.getProduct("invalid_id"))
        .rejects.toThrow("Product not found");
    });
  });
});
```

#### API Route Test Example

```typescript
// src/api/store/products/__tests__/route.test.ts
import { GET } from "../route";
import { createMockRequest, createMockResponse } from "../../../../utils/__tests__/test-helpers";

describe("GET /store/products", () => {
  it("should return list of products", async () => {
    const req = createMockRequest({ query: { limit: "10" } });
    const res = createMockResponse();

    await GET(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.jsonData).toHaveProperty("products");
    expect(Array.isArray(res.jsonData.products)).toBe(true);
  });
});
```

### Test Utilities

Located in `src/utils/__tests__/test-helpers.ts`:

- `createMockRequest()` - Creates mock request objects
- `createMockResponse()` - Creates mock response objects
- `createMockService()` - Creates mock service instances
- `createMockDatabase()` - Creates mock database connections
- `flushPromises()` - Waits for all promises to resolve

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Coverage output locations
coverage/
├── lcov-report/     # HTML report
└── coverage.json    # JSON report
```

View HTML report: `open coverage/lcov-report/index.html`

### Coverage Thresholds

Configure in `jest.config.js`:

```javascript
module.exports = {
  // ... other config
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## Linting

### ESLint Configuration

ESLint is configured with TypeScript support and Prettier integration.

```bash
# Run linting with auto-fix
npm run lint

# Check linting without fixing
npm run lint:check

# Lint specific files
npx eslint src/api/health/route.ts --fix
```

### Key ESLint Rules

- **TypeScript strict**: Type checking enabled
- **No console**: Warnings for console.log (except warn/error)
- **No unused vars**: Error for unused variables (prefix with _ to ignore)
- **Prettier integration**: Formatting rules via Prettier
- **Async/await**: Proper promise handling required

### Overrides

- Test files: Relaxed rules for any types and console logs
- Config files: Allow require() statements

## Code Formatting

### Prettier Configuration

```bash
# Format all files
npm run format

# Check formatting without fixing
npm run format:check

# Format specific files
npx prettier --write src/api/health/route.ts
```

### Prettier Rules

- Semi-colons: Required
- Single quotes: Yes
- Tab width: 2 spaces
- Print width: 80 characters
- Trailing comma: ES5 compatible
- Arrow parens: Always

## Type Checking

```bash
# Run TypeScript type checking
npm run typecheck

# Watch mode for development
npx tsc --watch --noEmit
```

## Quality Checks

### Combined Quality Commands

```bash
# Run all quality checks (lint, format, typecheck)
npm run quality

# Fix all auto-fixable issues
npm run quality:fix

# Pre-commit check (quality + unit tests)
npm run precommit
```

### Pre-commit Hooks

Husky and lint-staged are configured to run quality checks before commits:

1. ESLint fixes
2. Prettier formatting
3. TypeScript checking
4. Unit tests

To skip hooks (emergency only):
```bash
git commit -m "message" --no-verify
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: yarn install
      - run: npm run quality
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage.json
```

### Pre-deployment Checks

```bash
# Run full quality and test suite before deployment
npm run quality && npm run test:all && npm run deploy:check
```

## Best Practices

### Testing Best Practices

1. **Test naming**: Use descriptive test names that explain what is being tested
2. **AAA Pattern**: Arrange, Act, Assert structure for tests
3. **Mock external dependencies**: Don't make real API calls or database queries
4. **Test edge cases**: Include error scenarios and boundary conditions
5. **Keep tests isolated**: Each test should be independent

### Code Quality Best Practices

1. **Fix linting errors immediately**: Don't let them accumulate
2. **Use TypeScript strictly**: Avoid `any` types when possible
3. **Document complex logic**: Add JSDoc comments for clarity
4. **Keep functions small**: Single responsibility principle
5. **Regular dependency updates**: Keep tools and libraries current

### Performance Tips

1. **Run tests in parallel**: Use `--runInBand` only when necessary
2. **Use test.skip**: For temporarily disabling tests
3. **Mock heavy operations**: Database calls, file I/O, network requests
4. **Optimize imports**: Only import what you need

## Troubleshooting

### Common Issues

**Jest not finding tests**
```bash
# Check test file naming
# Must match: *.test.ts, *.spec.ts, or be in __tests__ folder
```

**ESLint parsing errors**
```bash
# Ensure TypeScript parser is installed
yarn add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Prettier conflicts with ESLint**
```bash
# Ensure eslint-config-prettier is last in extends array
# Run format:fix then lint:fix
```

**Type checking slow**
```bash
# Use incremental compilation
npx tsc --incremental --noEmit
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Medusa Testing Guide](https://docs.medusajs.com/development/testing)