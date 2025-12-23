# Setup Guide

## Quick Start

The application is ready to run locally with SQLite. Follow these steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
```bash
npx prisma generate
npx prisma migrate dev
```

### 3. Configure Environment
The `.env` file is already configured for local development with SQLite.

For email functionality, add your Resend API key:
```env
RESEND_API_KEY="your-api-key"
RESEND_FROM_EMAIL="your-verified-email@domain.com"
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Creating Test Accounts

### Register as a Trade
1. Go to `/register`
2. Select "I'm a Trade"
3. Fill in the form with:
   - Business name
   - Category (e.g., Plumber)
   - Description (minimum 20 characters)
   - Postcode (e.g., SW1A 1AA)
   - Service radius (e.g., 10 miles)

### Register as a Client
1. Go to `/register`
2. Select "I'm a Customer"
3. Fill in basic details

### Create Admin Account
After registering a user, use Prisma Studio to make them an admin:

```bash
npx prisma studio
```

1. Open the User table
2. Find your user
3. Change `role` from `CLIENT` to `ADMIN`
4. Save changes

## Testing the Platform

### As a Client
1. Go to `/search`
2. Enter a postcode (e.g., SW1A 1AA)
3. Select a category or leave as "All Categories"
4. Click "Search"
5. View trade profiles
6. Click "Send Enquiry" to contact a trade

### As a Trade
1. Log in to your trade account
2. Go to `/dashboard`
3. View your profile stats
4. See received enquiries
5. Accept, decline, or contact clients
6. Toggle your active status

### As an Admin
1. Log in with admin account
2. Go to `/admin`
3. View all registered trades
4. Verify or unverify trades
5. Monitor platform activity

## Database Management

### View Data
```bash
npx prisma studio
```

### Reset Database
```bash
npx prisma migrate reset
```

### Create New Migration
```bash
npx prisma migrate dev --name your_migration_name
```

## Common Issues

### Port Already in Use
If port 3000 is busy:
```bash
PORT=3001 npm run dev
```

### Database Locked
If you get a "database is locked" error:
1. Stop all running instances
2. Delete `prisma/dev.db-journal` if it exists
3. Restart the dev server

### Email Not Sending
Email functionality requires:
1. Valid Resend API key
2. Verified sender domain/email
3. Correct environment variables

For development, you can skip email setup - the app will log errors but continue working.

## Production Deployment

See README.md for full deployment instructions.

Key steps:
1. Switch to PostgreSQL
2. Set production environment variables
3. Run migrations
4. Deploy to Vercel/similar platform

## Need Help?

- Check the main README.md
- Review the code comments
- Check Prisma schema for data structure
- Use Prisma Studio to inspect data
