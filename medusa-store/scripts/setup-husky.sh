#!/bin/bash

# Setup Husky for Git hooks
echo "🔧 Setting up Husky for pre-commit hooks..."

# Initialize husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

echo "✅ Husky setup complete!"
echo ""
echo "Pre-commit hooks will now:"
echo "  - Run ESLint on staged files"
echo "  - Format code with Prettier"
echo "  - Check TypeScript types"
echo ""
echo "To skip hooks in emergency: git commit --no-verify"