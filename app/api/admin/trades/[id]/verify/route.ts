import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const trade = await prisma.tradeProfile.update({
      where: { id },
      data: { verified: true }
    })

    return NextResponse.json({ trade })
  } catch (error) {
    console.error("Verify trade error:", error)
    return NextResponse.json({ error: "Failed to verify trade" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const trade = await prisma.tradeProfile.update({
      where: { id },
      data: { verified: false }
    })

    return NextResponse.json({ trade })
  } catch (error) {
    console.error("Unverify trade error:", error)
    return NextResponse.json({ error: "Failed to unverify trade" }, { status: 500 })
  }
}
