# Reliability Score System

## Overview

The reliability score is a percentage-based confidence indicator that helps users assess whether a service provider is responsive and dependable. Unlike traditional star ratings, this system focuses on behavioral trust signals rather than subjective opinions.

## Core Philosophy

**Goal**: Communicate reliability, not popularity

**Principle**: The score should be factual, earned, and recoverable over time

**Focus**: "Will this person respond, turn up, and not waste my time?"

## How It Works

### Primary Inputs (Platform-Observed Behavior)

1. **Enquiry Response Rate** (40% weight)
   - Percentage of enquiries that received any response
   - Tracks whether provider engages with requests

2. **Enquiry Acceptance Rate** (30% weight)
   - Percentage of enquiries that were accepted
   - Indicates willingness to take on work

3. **Recent Activity** (20% weight)
   - Last active date
   - Scoring:
     - Within 7 days: 20 points
     - Within 14 days: 15 points
     - Within 30 days: 10 points
     - Within 60 days: 5 points
     - Over 60 days: 0 points

4. **Verification Status** (10% weight)
   - Admin-verified providers get bonus points
   - Indicates platform trust

### Response Time Tracking

- Measured from enquiry creation to first status change
- Stored as average response time in minutes
- Currently tracked but not weighted in score (future enhancement)

## Score Calculation

```
Total Score = (Response Rate × 40) + (Acceptance Rate × 30) + (Activity Score) + (Verification Bonus)
Percentage = (Total Score / Max Score) × 100
Capped at 95% (no perfect scores shown)
```

## Display Logic

### New Providers (< 5 enquiries)
- **Label**: "New" or "Building History"
- **No percentage shown**
- Avoids penalizing new providers

### Established Providers (≥ 5 enquiries)
- **Percentage displayed**: e.g., "87% Reliable"
- **Label based on score**:
  - 85%+: "Highly Reliable"
  - 70-84%: "Reliable"
  - 50-69%: "Moderately Reliable"
  - <50%: "Building Reputation"

### Tooltip Description
Shows context like:
- "Responds to 92% of enquiries and stays active"
- "Good response rate and regular activity"
- "Still building track record"

## What Updates the Score

### Automatic Updates
- When provider responds to an enquiry (any status change)
- When provider accepts an enquiry
- When provider logs in (updates lastActive)

### Manual Updates
- Admin verification status changes

## Design Constraints

### What We DON'T Show
- ❌ 5-star ratings
- ❌ 100% scores (capped at 95%)
- ❌ Precise decimals (e.g., 91.37%)
- ❌ Negative reviews or complaints

### What We DO Show
- ✅ Percentage-based reliability
- ✅ Contextual labels
- ✅ Behavioral descriptions
- ✅ "New" status for new providers

## Future Enhancements

### Potential Additions
1. **Client Feedback** (secondary signal)
   - Binary questions: "Did they respond?", "Did they turn up?"
   - Would add 10-15% weight to score

2. **Response Time Weight**
   - Currently tracked but not scored
   - Could add 5-10% weight for fast responders

3. **Completion Rate**
   - Track jobs marked as completed
   - Would require client confirmation system

4. **Score Decay**
   - Reduce weight of old data over time
   - Allows providers to recover from poor periods

### Not Planned
- Free-text reviews (too subjective, easily gamed)
- Comparison rankings (creates unhealthy competition)
- Public complaint systems (too negative)

## Technical Implementation

### Database Fields
```prisma
model TradeProfile {
  enquiriesReceived   Int
  enquiriesResponded  Int
  enquiriesAccepted   Int
  averageResponseTime Int?
  lastActive          DateTime
  verified            Boolean
}

model Enquiry {
  respondedAt DateTime?
  createdAt   DateTime
}
```

### Calculation Function
Located in: `lib/reliability.ts`

Key functions:
- `calculateReliabilityScore()` - Main calculation
- `formatReliabilityLabel()` - Display formatting

### Update Triggers
Located in: `app/api/enquiries/[id]/route.ts`

Updates occur when:
- Enquiry status changes from PENDING
- First response is recorded
- Acceptance status changes

## User Experience

### Search Results
- Reliability badge shown next to verification badge
- Hover tooltip shows description
- New providers show "New" label instead of percentage

### Provider Dashboard
- Full reliability breakdown
- Response rate percentage
- Contextual description
- Tips for improvement (future)

### Admin Panel
- Can see all reliability metrics
- Verification affects score
- No manual score override (maintains integrity)

## Fairness Considerations

### For New Providers
- Not penalized for lack of history
- Clear "New" or "Building History" labels
- Score only appears after 5 enquiries

### For Established Providers
- Score is recoverable through good behavior
- Recent activity weighted more than old data
- No permanent penalties

### For Users
- Transparent calculation (can be explained)
- Focuses on actionable signals
- Avoids emotional/subjective bias

## Maintenance

### Regular Monitoring
- Check for score inflation/deflation
- Monitor average scores across platform
- Adjust weights if needed

### Data Integrity
- Ensure timestamps are accurate
- Validate response tracking
- Prevent gaming attempts

## Philosophy Summary

This system is designed to answer one question:

**"Is this person likely to respond and be helpful?"**

It does this by:
- Tracking actual behavior
- Rewarding responsiveness
- Staying transparent
- Avoiding subjective judgment
- Allowing recovery and growth

The goal is trust, not perfection.
