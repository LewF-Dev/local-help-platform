# Feature Overview

## Core Functionality

### 1. User Registration & Authentication
- **Multi-role system**: Clients, Trades, and Admins
- **Secure authentication**: NextAuth.js with credential provider
- **Password security**: Bcrypt hashing
- **Session management**: JWT-based sessions

### 2. Trade Profiles
- **Business information**: Name, category, description
- **Location-based**: Postcode and service radius
- **Verification system**: Admin-verified badges
- **Status control**: Active/inactive toggle
- **Subscription tracking**: Free enquiries and paid subscription

### 3. Search & Discovery
- **Postcode search**: Find trades in specific areas
- **Category filtering**: 12 trade categories
- **Distance calculation**: Shows approximate distance
- **Service radius matching**: Only shows trades serving the area
- **Verified-only results**: Only verified trades appear in search

### 4. Enquiry System
- **Direct enquiries**: Send job requests through platform
- **Contact information**: Access to phone and email
- **Status tracking**: Pending, accepted, declined, contacted
- **Email notifications**: Trades notified of new enquiries
- **Free enquiry limit**: First 3 enquiries free for trades

### 5. Dashboard
#### Trade Dashboard
- Profile overview with stats
- Enquiries received counter
- Free enquiries remaining
- Subscription status
- List of all received enquiries
- Quick actions: Accept, decline, contact

#### Client Dashboard
- List of sent enquiries
- Status tracking
- Trade contact information

### 6. Admin Panel
- View all registered trades
- Verify/unverify trades
- Monitor enquiry counts
- View subscription status
- Access to all user information

## Business Logic

### Free Enquiry Model
1. New trades get 3 free enquiries
2. Counter increments with each enquiry
3. After 3 enquiries, profile auto-deactivates
4. Trade must subscribe to continue receiving enquiries
5. Subscription reactivates profile

### Verification System
1. Trades register and create profile
2. Admin reviews and verifies
3. Only verified trades appear in search
4. Verification badge displayed on profiles

### Search Algorithm
1. User enters postcode and category
2. System finds trades with matching postcode area
3. Calculates distance (simplified for demo)
4. Filters by service radius
5. Returns sorted by distance

## UI/UX Features

### Animations
- Page transitions with Framer Motion
- Hover effects on cards and buttons
- Smooth state changes
- Loading states
- Micro-interactions

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interface
- Adaptive layouts

### Visual Feedback
- Status badges (verified, active, subscribed)
- Color-coded enquiry statuses
- Loading spinners
- Success/error messages
- Empty states

## Technical Features

### Performance
- Server-side rendering for SEO
- Optimized database queries
- Efficient state management
- Code splitting
- Image optimization ready

### Security
- Password hashing
- Session-based authentication
- Role-based access control
- Input validation with Zod
- SQL injection prevention via Prisma
- XSS protection

### Data Validation
- Email format validation
- Password strength requirements
- Postcode format checking
- Required field enforcement
- Type safety with TypeScript

### Email System
- Welcome emails for new users
- Enquiry notifications for trades
- HTML email templates
- Resend integration

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - Login/logout

### Trades
- `GET /api/trades/profile` - Get trade profile
- `PATCH /api/trades/profile` - Update profile
- `POST /api/trades/subscription` - Activate subscription
- `DELETE /api/trades/subscription` - Cancel subscription

### Search
- `GET /api/search` - Search for trades

### Enquiries
- `POST /api/enquiries` - Create enquiry
- `GET /api/enquiries` - List enquiries
- `PATCH /api/enquiries/[id]` - Update enquiry status

### Admin
- `GET /api/admin/trades` - List all trades
- `POST /api/admin/trades/[id]/verify` - Verify trade
- `DELETE /api/admin/trades/[id]/verify` - Unverify trade

## Categories Supported

1. Plumber
2. Electrician
3. Carpenter
4. Painter
5. Builder
6. Roofer
7. Plasterer
8. Tiler
9. Landscaper
10. Window Cleaner
11. Handyman
12. Other

## Future Enhancement Ideas

### Short Term
- Payment integration (Stripe)
- Email verification
- Password reset functionality
- Profile photos
- Business hours

### Medium Term
- Review and rating system
- Photo galleries for trades
- Advanced search filters
- Saved searches
- Favorite trades

### Long Term
- Real-time chat
- Mobile app
- Analytics dashboard
- Automated verification
- Multi-language support
- API for integrations
- Booking system
- Calendar integration

## Scalability Considerations

### Current Architecture
- Supports hundreds of concurrent users
- SQLite for development
- PostgreSQL recommended for production
- Stateless API design
- Horizontal scaling ready

### Optimization Opportunities
- Redis for caching
- CDN for static assets
- Database indexing (already implemented)
- Query optimization
- Background job processing
- Rate limiting

## Compliance & Legal

### Data Protection
- User data encrypted at rest
- Secure password storage
- Session security
- GDPR-ready architecture

### Terms of Service
- Clear user roles
- No liability for job outcomes
- Platform as facilitator only
- Direct contracts between parties

## Monitoring & Analytics

### Built-in Tracking
- User registration counts
- Enquiry volumes
- Subscription status
- Active trades count

### Recommended Additions
- Google Analytics
- Error tracking (Sentry)
- Performance monitoring
- User behavior analytics
- Conversion tracking
