# Database Setup

The application requires PostgreSQL. Here are your options:

## Option 1: Neon (Recommended for Development)

1. Go to [neon.tech](https://neon.tech)
2. Sign up for free
3. Create a new project
4. Copy the connection string
5. Add to `.env`:
```
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

## Option 2: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (use "Connection pooling" for better performance)
5. Add to `.env`

## Option 3: Railway

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL service
4. Copy the connection string from variables
5. Add to `.env`

## Option 4: Local PostgreSQL

### Install PostgreSQL

**Ubuntu/Debian**:
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

**macOS**:
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Windows**:
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### Create Database

```bash
sudo -u postgres psql
CREATE DATABASE localhelp;
CREATE USER localhelp_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE localhelp TO localhelp_user;
\q
```

### Update .env

```
DATABASE_URL="postgresql://localhelp_user:your_password@localhost:5432/localhelp"
```

## After Setting Up Database

1. Generate Prisma Client:
```bash
npx prisma generate
```

2. Run migrations:
```bash
npx prisma migrate dev
```

3. (Optional) Seed with test data:
```bash
npx prisma db seed
```

## Troubleshooting

### "Can't reach database server"
- Check if PostgreSQL is running
- Verify connection string is correct
- Check firewall settings

### "User denied access"
- Verify user has correct permissions
- Check password is correct
- Ensure database exists

### "SSL required"
- For cloud databases, add `?sslmode=require` to connection string
- For local development, you can use `?sslmode=disable`

## Production

For production, use:
- **Vercel Postgres** (if deploying to Vercel)
- **Supabase** (generous free tier, good for startups)
- **Neon** (serverless, scales to zero)
- **Railway** (simple, good pricing)
- **AWS RDS** (enterprise)

Always use connection pooling in production (PgBouncer or Supabase Pooler).
