#!/usr/bin/env tsx

import { execSync } from 'child_process';
import config from '../env.config';

async function main() {
    console.log('🚀 Starting database migration...');

    try {
        // Generate Prisma client
        console.log('📦 Generating Prisma client...');
        execSync('npx prisma generate', { stdio: 'inherit' });

        // Run database migrations
        console.log('🔄 Running database migrations...');
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });

        // Seed the database with initial data
        console.log('🌱 Seeding database...');
        execSync('npx tsx scripts/db-seed.ts', { stdio: 'inherit' });

        console.log('✅ Database migration completed successfully!');
    } catch (error) {
        console.error('❌ Database migration failed:', error);
        process.exit(1);
    }
}

main();