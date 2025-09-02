#!/usr/bin/env node

/**
 * Secret generation helper script
 * Generates secure random secrets for JWT and Cookie
 */

const crypto = require('crypto');

console.log('🔐 Generating secure secrets for your Medusa deployment...\n');

// Generate secrets
const jwtSecret = crypto.randomBytes(32).toString('base64');
const cookieSecret = crypto.randomBytes(32).toString('hex');

console.log('Copy these values to your environment variables:\n');
console.log('=' .repeat(60));
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`COOKIE_SECRET=${cookieSecret}`);
console.log('=' .repeat(60));

console.log('\n📝 Instructions:');
console.log('1. Copy the above values');
console.log('2. For Railway: Add them in the Railway dashboard → Variables');
console.log('3. For local development: Add them to your .env file');
console.log('\n⚠️  Important:');
console.log('- Never commit these secrets to Git');
console.log('- Use different secrets for each environment (dev/staging/prod)');
console.log('- Keep these values secure and backed up safely\n');