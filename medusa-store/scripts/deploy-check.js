#!/usr/bin/env node

/**
 * Pre-deployment validation script
 * Checks for common configuration issues before deploying
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-deployment checks...\n');

let errors = [];
let warnings = [];

// Check for required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'COOKIE_SECRET',
  'ADMIN_CORS',
  'STORE_CORS',
  'AUTH_CORS'
];

const envFile = path.join(__dirname, '..', '.env');
const envExampleFile = path.join(__dirname, '..', '.env.example');

// Check if .env file exists
if (!fs.existsSync(envFile)) {
  warnings.push('⚠️  No .env file found. Make sure environment variables are set in Railway dashboard.');
} else {
  const envContent = fs.readFileSync(envFile, 'utf8');
  
  requiredEnvVars.forEach(varName => {
    if (!envContent.includes(`${varName}=`)) {
      errors.push(`❌ Missing required environment variable: ${varName}`);
    }
  });

  // Check for default/example values
  if (envContent.includes('your-super-secret')) {
    errors.push('❌ Default secret values detected. Please generate unique secrets!');
  }

  // Check JWT_SECRET length
  const jwtMatch = envContent.match(/JWT_SECRET=(.+)/);
  if (jwtMatch && jwtMatch[1].length < 32) {
    errors.push('❌ JWT_SECRET should be at least 32 characters long');
  }

  // Check COOKIE_SECRET length
  const cookieMatch = envContent.match(/COOKIE_SECRET=(.+)/);
  if (cookieMatch && cookieMatch[1].length < 32) {
    errors.push('❌ COOKIE_SECRET should be at least 32 characters long');
  }
}

// Check package.json for required scripts
const packageJson = require('../package.json');
const requiredScripts = ['build', 'start', 'medusa'];

requiredScripts.forEach(script => {
  if (!packageJson.scripts || !packageJson.scripts[script]) {
    errors.push(`❌ Missing required script in package.json: ${script}`);
  }
});

// Check Node version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion < 20) {
  errors.push(`❌ Node.js version 20 or higher is required. Current version: ${nodeVersion}`);
}

// Check for database migrations
const migrationsDir = path.join(__dirname, '..', '.medusa', 'migrations');
if (!fs.existsSync(migrationsDir)) {
  warnings.push('⚠️  No migrations directory found. Remember to run migrations after deployment.');
}

// Check for TypeScript build
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  warnings.push('⚠️  No dist directory found. Build will be created during deployment.');
}

// Print results
console.log('📋 Pre-Deployment Check Results:\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! Ready for deployment.\n');
} else {
  if (errors.length > 0) {
    console.log('❌ Errors found (must fix before deployment):\n');
    errors.forEach(error => console.log('  ' + error));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('⚠️  Warnings (review but not blocking):\n');
    warnings.forEach(warning => console.log('  ' + warning));
    console.log('');
  }
}

// Exit with error code if there are errors
if (errors.length > 0) {
  console.log('🛑 Deployment checks failed. Please fix the errors above.\n');
  process.exit(1);
} else {
  console.log('🚀 Ready for deployment!\n');
  console.log('Next steps:');
  console.log('1. Push your code to GitHub');
  console.log('2. Railway will automatically deploy');
  console.log('3. Run database migrations in Railway console');
  console.log('4. Create admin user if needed\n');
}