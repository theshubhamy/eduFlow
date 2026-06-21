#!/bin/bash
echo "=== eduFlow Database Migrator & Seeder ==="
cd backend
echo "Running Prisma DB Push to Neon PostgreSQL..."
npx prisma db push
echo "Seeding default data (school, team, users, classes, subjects)..."
npm run db:seed
echo "=== Database Ready ==="
