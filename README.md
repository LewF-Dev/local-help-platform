# LocalTrades - Local Trades Marketplace

A modern web platform connecting local tradespeople with customers. Built with Next.js 14, TypeScript, Prisma, and Tailwind CSS.

## Features

### For Customers
- Search for verified local tradespeople by postcode and category
- View detailed trade profiles with service areas
- Send enquiries directly through the platform
- Access direct contact information for verified trades
- Track enquiry status in personal dashboard

### For Trades
- Create detailed business profiles
- Receive first 3 enquiries completely free
- Simple monthly subscription model (no commission)
- Manage all enquiries from centralized dashboard
- Control service area and availability
- Accept, decline, or contact clients directly

### For Admins
- Verify trade profiles
- Monitor platform activity
- Manage user accounts

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Email**: Resend

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd local-trades
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - Database connection string
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your application URL
- `RESEND_API_KEY` - Get from [resend.com](https://resend.com)
- `RESEND_FROM_EMAIL` - Verified sender email

4. Initialize the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### User
- Stores user accounts (trades, clients, admins)
- Handles authentication credentials
- Links to trade profiles

### TradeProfile
- Business information and service details
- Location and service radius
- Subscription and verification status
- Free enquiry tracking

### Enquiry
- Job requests from clients to trades
- Status tracking (pending, accepted, declined, contacted)
- Client contact information

## Project Structure

```
local-trades/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── trades/       # Trade management
│   │   ├── enquiries/    # Enquiry handling
│   │   ├── search/       # Search functionality
│   │   └── admin/        # Admin operations
│   ├── dashboard/        # User dashboard
│   ├── admin/            # Admin panel
│   ├── search/           # Search page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Reusable UI components
│   ├── navbar.tsx        # Navigation bar
│   └── providers.tsx     # Context providers
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── utils.ts          # Utility functions
│   └── email.ts          # Email notifications
├── prisma/
│   └── schema.prisma     # Database schema
└── types/
    └── next-auth.d.ts    # TypeScript definitions
```

## Key Features Implementation

### Authentication
- Credential-based authentication with NextAuth.js
- Role-based access control (CLIENT, TRADE, ADMIN)
- Secure password hashing with bcrypt

### Search System
- Postcode-based location filtering
- Category filtering
- Distance calculation
- Service radius matching

### Enquiry System
- Direct enquiry submission
- Email notifications to trades
- Status tracking and management
- Free enquiry limit enforcement

### Subscription Model
- First 3 enquiries free for new trades
- Automatic deactivation after free limit
- Monthly subscription activation
- No commission on jobs

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub

2. Import project in Vercel

3. Configure environment variables in Vercel dashboard

4. For production database, use:
   - [Vercel Postgres](https://vercel.com/storage/postgres)
   - [Supabase](https://supabase.com)
   - [PlanetScale](https://planetscale.com)
   - [Railway](https://railway.app)

5. Update `prisma/schema.prisma` datasource to `postgresql`:
```prisma
datasource db {
  provider = "postgresql"
}
```

6. Update `prisma.config.ts`:
```typescript
datasource: {
  url: process.env["DATABASE_URL"],
}
```

7. Run migrations in production:
```bash
npx prisma migrate deploy
```

### Environment Variables for Production

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

## Email Setup

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Create an API key
4. Add to environment variables

Email notifications are sent for:
- New user registration
- New enquiry received
- Enquiry status updates

## Admin Account

To create an admin account, manually update a user in the database:

```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'your@email.com';
```

Or use Prisma Studio:
```bash
npx prisma studio
```

## Development

### Database Management

View and edit data:
```bash
npx prisma studio
```

Create new migration:
```bash
npx prisma migrate dev --name description
```

Reset database:
```bash
npx prisma migrate reset
```

### Code Quality

Format code:
```bash
npm run lint
```

Type checking:
```bash
npx tsc --noEmit
```

## Customization

### Categories
Edit trade categories in `prisma/schema.prisma`:
```prisma
enum TradeCategory {
  PLUMBER
  ELECTRICIAN
  // Add more...
}
```

### Subscription Pricing
Update subscription logic in:
- `app/api/trades/subscription/route.ts`
- Add payment integration (Stripe, etc.)

### Email Templates
Customize email templates in `lib/email.ts`

### Styling
- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Component styles: Inline with Tailwind classes

## Security Considerations

- All passwords are hashed with bcrypt
- API routes protected with session checks
- Role-based authorization on sensitive endpoints
- Input validation with Zod schemas
- SQL injection prevention via Prisma
- XSS protection via React

## Performance

- Server-side rendering for SEO
- Optimistic UI updates
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Database query optimization with Prisma

## Future Enhancements

- [ ] Payment integration (Stripe)
- [ ] Review and rating system
- [ ] Photo uploads for trades
- [ ] Advanced search filters
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Automated verification process
- [ ] Multi-language support
- [ ] API for third-party integrations

## License

MIT License - feel free to use for personal or commercial projects.

---

Built for local trades and their customers
