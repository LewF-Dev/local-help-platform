# Platform Refinement - December 2024

## Summary

The platform has been refined from a "trades-only" marketplace to a broader "local physical services" platform, with added behavioral reliability tracking and improved user experience.

## Key Changes

### 1. Scope Expansion

**From**: Local trades marketplace (plumbers, electricians, etc.)  
**To**: Local physical services platform (trades + mobile services)

**New Categories Added**:
- Mobile Barber
- Mobile Beautician  
- Massage Therapist
- Personal Trainer
- Mobile Mechanic
- IT Support (On-site)
- Photographer (Events)
- Cleaner

**Philosophy**: Focus on services where someone comes to you physically, not remote/async work.

### 2. Branding Updates

- **Name**: LocalTrades → LocalHelp
- **Messaging**: "Find local trades" → "Find local help"
- **Positioning**: "Find someone local who can come to you and get it done"
- **User Labels**: "Trades" → "Service Providers"

### 3. Urgency System

Added optional urgency field to enquiries:
- ASAP
- Today
- This Week
- By Specific Date
- Flexible (default)

**Design**: Urgency is contextual metadata, not a platform-wide requirement. Users can specify their timeline without pressure.

### 4. Reliability Score System

Implemented percentage-based reliability scoring instead of traditional star ratings.

**Inputs** (weighted):
- Response Rate (40%): Percentage of enquiries responded to
- Acceptance Rate (30%): Percentage of enquiries accepted
- Recent Activity (20%): Last active date
- Verification Status (10%): Admin verification bonus

**Display Logic**:
- New providers (< 5 enquiries): Show "New" or "Building History" label
- Established providers: Show percentage (e.g., "87% Reliable")
- Capped at 95% (no perfect scores)
- Tooltip shows behavioral description

**Philosophy**: Focus on "Will they respond and turn up?" rather than subjective opinions.

### 5. Database Schema Updates

**TradeProfile** (now Service Provider Profile):
```prisma
enquiriesResponded  Int
enquiriesAccepted   Int
averageResponseTime Int?
lastActive          DateTime
```

**Enquiry**:
```prisma
urgency       EnquiryUrgency?
preferredDate String?
respondedAt   DateTime?
```

### 6. Technical Updates

- Updated to NextAuth v5 beta
- Fixed API route authentication
- Added reliability calculation utilities
- Updated all UI components to remove Framer Motion type conflicts
- Improved response time tracking

## What Stayed the Same

- Free 3 enquiries for new providers
- No commission model
- Direct contact between parties
- Postcode-based search
- Admin verification system
- Subscription model
- Core platform mechanics

## Documentation Added

- **RELIABILITY_SYSTEM.md**: Complete explanation of reliability scoring
- Updated README with new scope
- Updated FEATURES with new capabilities

## User Experience Changes

### For Customers
- Can now find broader range of services
- See reliability scores on search results
- Can specify urgency when sending enquiries
- Clearer messaging about what platform offers

### For Service Providers
- Build reliability through good behavior
- See response rate in dashboard
- Broader category options
- Same free trial and subscription model

### For Admins
- Can see reliability metrics
- Verification still affects scores
- No manual score override (maintains integrity)

## Migration Notes

### Existing Data
- All existing trade profiles remain valid
- Category enum expanded (backward compatible)
- New fields have sensible defaults
- No data loss

### Deployment
- Run `npx prisma migrate deploy` in production
- Update environment variables (same as before)
- No breaking changes to API

## Future Considerations

### Potential Enhancements
1. Client feedback system (binary questions)
2. Response time weighting in score
3. Completion rate tracking
4. Score decay for old data
5. Provider improvement tips

### Not Planned
- Free-text reviews (too subjective)
- Comparison rankings (unhealthy competition)
- Public complaints (too negative)
- Remote/async services (out of scope)

## Philosophy Reinforcement

The platform remains focused on:
- **Local**: Postcode-based, physical proximity matters
- **Physical**: Someone comes to you
- **Direct**: No middleman in the transaction
- **Fair**: No commission, transparent pricing
- **Trust**: Behavioral signals over opinions
- **Simple**: Clear roles, minimal friction

## Testing Recommendations

1. Register as new service provider
2. Send enquiries and respond to them
3. Verify reliability score updates
4. Test urgency field in enquiry form
5. Check new categories appear in search
6. Verify admin panel shows new metrics

## Known Issues

- NextAuth v5 beta may have edge cases
- Build process needs Prisma 7 compatibility fixes (dev server works fine)
- Response time currently tracked but not weighted in score

## Success Metrics

Track these to validate changes:
- Provider registration across new categories
- Enquiry conversion rates
- Response time improvements
- Reliability score distribution
- User retention

---

**Commit**: `816d02f` - Refine platform scope and add reliability system  
**Date**: December 23, 2024  
**Status**: ✅ Complete and pushed to GitHub
