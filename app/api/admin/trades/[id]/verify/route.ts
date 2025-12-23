import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const trade = await prisma.tradeProfile.update({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const trade = await prisma.tradeProfile.update({
      where: { id: params.id },
      data: { verified: false }
    })

    return NextResponse.json({ trade })
  } catch (error) {
    console.error("Unverify trade error:", error)
    return NextResponse.json({ error: "Failed to unverify trade" }, { status: 500 })
  }
}
