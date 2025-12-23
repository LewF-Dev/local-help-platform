import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateProfileSchema = z.object({
  businessName: z.string().min(2).optional(),
  category: z.enum([
    "PLUMBER", "ELECTRICIAN", "CARPENTER", "PAINTER", "BUILDER",
    "ROOFER", "PLASTERER", "TILER", "LANDSCAPER", "WINDOW_CLEANER",
    "HANDYMAN", "OTHER"
  ]).optional(),
  description: z.string().min(20).optional(),
  postcode: z.string().min(5).optional(),
  serviceRadius: z.number().min(1).max(50).optional(),
  active: z.boolean().optional()
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "TRADE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.tradeProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            phone: true
          }
        }
      }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "TRADE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = updateProfileSchema.parse(body)

    const profile = await prisma.tradeProfile.update({
      where: { userId: session.user.id },
      data: {
        ...(data.businessName && { businessName: data.businessName }),
        ...(data.category && { category: data.category }),
        ...(data.description && { description: data.description }),
        ...(data.postcode && { postcode: data.postcode.toUpperCase().replace(/\s+/g, '') }),
        ...(data.serviceRadius && { serviceRadius: data.serviceRadius }),
        ...(data.active !== undefined && { active: data.active })
      }
    })

    return NextResponse.json({ profile })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
