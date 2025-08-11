# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `yarn build` - Build all packages using Turbo with 50% concurrency
- `yarn test` - Run all unit tests across packages
- `yarn test:integration:packages:fast` - Run integration tests for main packages (excludes slow modules)
- `yarn test:integration:packages:slow` - Run integration tests for heavy modules (workflow-engine-redis, index, product, order, cart)
- `yarn test:integration:api` - Run API integration tests
- `yarn test:integration:http` - Run HTTP integration tests
- `yarn test:integration:modules` - Run module integration tests
- `yarn lint` - Run ESLint across all packages
- `yarn lint:path <path>` - Lint specific path

### Package Development
Individual packages can be built/tested by navigating to their directory:
- `cd packages/medusa && yarn build` - Build main Medusa package
- `cd packages/medusa && yarn test` - Run unit tests for specific package
- `cd packages/medusa && yarn test:integration` - Run integration tests for specific package

### Testing Single Tests
For individual test files, use Jest directly from the workspace root:
- `yarn jest <test-file-path>` - Run specific test file
- `yarn jest --testNamePattern="<pattern>"` - Run tests matching pattern

## Architecture Overview

Medusa is a modular e-commerce platform built as a monorepo with the following key architectural components:

### Core Architecture
- **Packages Structure**: Multi-package monorepo organized into logical domains
- **Module System**: Domain-driven modules that can be used independently or together
- **Framework Pattern**: Core framework with pluggable modules and providers
- **API-First Design**: RESTful APIs with OpenAPI specifications

### Package Categories

**Core Packages** (`packages/core/`):
- `framework` - Core application framework and dependency injection
- `types` - Shared TypeScript types across the platform
- `utils` - Common utilities and helpers
- `modules-sdk` - Module system SDK for building custom modules
- `workflows-sdk` - Workflow orchestration system
- `js-sdk` - JavaScript/TypeScript SDK for client applications

**Main Application** (`packages/medusa/`):
- Contains the main Medusa application
- API routes, commands, loaders, and core business logic
- Module registration and configuration

**Commerce Modules** (`packages/modules/`):
- `auth` - Authentication and authorization
- `cart` - Shopping cart functionality
- `customer` - Customer management
- `order` - Order processing and management
- `product` - Product catalog and variants
- `payment` - Payment processing abstraction
- `fulfillment` - Fulfillment and shipping
- `inventory` - Inventory management
- `pricing` - Dynamic pricing engine
- `promotion` - Promotions and discounts
- `region` - Regional settings and localization
- `sales-channel` - Multi-channel selling
- `tax` - Tax calculation and management
- `user` - User management
- `notification` - Notification system

**Providers** (`packages/modules/providers/`):
- Pluggable service providers for different implementations
- Examples: `payment-stripe`, `file-s3`, `notification-sendgrid`

**Admin Interface** (`packages/admin/`):
- `dashboard` - React-based admin dashboard
- `admin-sdk` - Admin SDK for building admin extensions
- `admin-vite-plugin` - Vite plugin for admin development

**CLI Tools** (`packages/cli/`):
- `create-medusa-app` - Project scaffolding tool
- `medusa-cli` - Main CLI for project management
- `medusa-dev-cli` - Development utilities

### Key Patterns

**Module Architecture**:
- Each module is self-contained with its own models, services, and API routes
- Modules communicate through well-defined interfaces
- Dependency injection for service resolution
- MikroORM for data persistence

**Workflow System**:
- Complex business processes are handled through workflows
- Step-based execution with compensation handling
- Support for both synchronous and asynchronous execution

**Provider Pattern**:
- Abstract interfaces for common services (payment, fulfillment, notification)
- Multiple implementations can be swapped without code changes
- Configuration-driven provider selection

**API Structure**:
- Admin API for management operations
- Store API for customer-facing operations
- Automatic OpenAPI spec generation
- Consistent REST patterns across all endpoints

### Development Workflow

**Monorepo Management**:
- Uses Yarn workspaces for dependency management
- Turbo for build orchestration and caching
- Each package has its own build and test scripts
- Shared configuration through root-level files

**Testing Strategy**:
- Unit tests in individual packages
- Integration tests in `integration-tests/` directory
- Separate test suites for API, HTTP, and module testing
- Jest configuration supports both TypeScript and JavaScript

**Code Quality**:
- ESLint with Google style guide and Prettier
- TypeScript strict mode enabled
- 80-character line limit
- Conventional commit messages with Changesets for versioning

### Database & ORM

**MikroORM Integration**:
- Each module with persistence has its own MikroORM configuration
- Database migrations handled per module
- Entity definitions co-located with business logic
- Support for PostgreSQL as primary database

### Important Files

- `turbo.json` - Turbo build system configuration
- `jest.config.js` - Root Jest configuration for monorepo
- `define_jest_config.js` - Shared Jest configuration factory
- `.eslintrc.js` - ESLint configuration
- `package.json` workspaces define the monorepo structure
- Each package has its own `package.json`, `jest.config.js`, and `tsconfig.json`

### Development Notes

**Branch Strategy**:
- `develop` - Main development branch for Medusa 2.x
- `v1.x` - Legacy branch for Medusa 1.x patches
- Feature branches should use prefixes: `feat/`, `fix/`, `docs/`

**PR Requirements**:
- All changes require tests (unit and integration where applicable)
- ESLint and Prettier must pass
- Build must succeed across all affected packages
- Changesets required for versioning