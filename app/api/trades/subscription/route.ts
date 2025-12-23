import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "TRADE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.tradeProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const subscriptionEnds = new Date()
    subscriptionEnds.setMonth(subscriptionEnds.getMonth() + 1)

    const updatedProfile = await prisma.tradeProfile.update({
      where: { userId: session.user.id },
      data: {
        subscriptionActive: true,
        subscriptionEnds
      }
    })

    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({ error: "Failed to activate subscription" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "TRADE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updatedProfile = await prisma.tradeProfile.update({
      where: { userId: session.user.id },
      data: {
        subscriptionActive: false,
        subscriptionEnds: null
      }
    })

    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    console.error("Cancel subscription error:", error)
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
  }
}
