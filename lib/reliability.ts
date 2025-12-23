interface ReliabilityData {
  enquiriesReceived: number
  enquiriesResponded: number
  enquiriesAccepted: number
  averageResponseTime: number | null
  lastActive: Date
  verified: boolean
  createdAt: Date
}

interface ReliabilityScore {
  percentage: number
  label: string
  description: string
}

export function calculateReliabilityScore(data: ReliabilityData): ReliabilityScore {
  if (data.enquiriesReceived === 0) {
    return {
      percentage: 0,
      label: "New",
      description: "No enquiries received yet"
    }
  }

  if (data.enquiriesReceived < 5) {
    return {
      percentage: 0,
      label: "Building History",
      description: "Establishing track record"
    }
  }

  let score = 0
  let maxScore = 0

  const responseRate = data.enquiriesResponded / data.enquiriesReceived
  score += responseRate * 40
  maxScore += 40

  const acceptanceRate = data.enquiriesAccepted / data.enquiriesReceived
  score += acceptanceRate * 30
  maxScore += 30

  const daysSinceActive = Math.floor(
    (Date.now() - new Date(data.lastActive).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  let activityScore = 0
  if (daysSinceActive <= 7) activityScore = 20
  else if (daysSinceActive <= 14) activityScore = 15
  else if (daysSinceActive <= 30) activityScore = 10
  else if (daysSinceActive <= 60) activityScore = 5
  
  score += activityScore
  maxScore += 20

  if (data.verified) {
    score += 10
    maxScore += 10
  }

  const percentage = Math.round((score / maxScore) * 100)

  const cappedPercentage = Math.min(95, percentage)

  let label = "Reliable"
  if (cappedPercentage >= 85) label = "Highly Reliable"
  else if (cappedPercentage >= 70) label = "Reliable"
  else if (cappedPercentage >= 50) label = "Moderately Reliable"
  else label = "Building Reputation"

  return {
    percentage: cappedPercentage,
    label,
    description: getReliabilityDescription(cappedPercentage, data)
  }
}

function getReliabilityDescription(percentage: number, data: ReliabilityData): string {
  const responseRate = Math.round((data.enquiriesResponded / data.enquiriesReceived) * 100)
  
  if (percentage >= 85) {
    return `Responds to ${responseRate}% of enquiries and stays active`
  } else if (percentage >= 70) {
    return `Good response rate and regular activity`
  } else if (percentage >= 50) {
    return `Responds to some enquiries`
  } else {
    return `Still building track record`
  }
}

export function formatReliabilityLabel(percentage: number): string {
  if (percentage === 0) return "New"
  return `${percentage}% Reliable`
}
