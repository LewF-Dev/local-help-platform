import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateEnquirySchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED", "CONTACTED"])
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "TRADE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = updateEnquirySchema.parse(body)

    const { id } = await params

    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        tradeProfile: true
      }
    })

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
    }

    if (enquiry.tradeProfile.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const now = new Date()
    const responseTime = !enquiry.respondedAt 
      ? Math.floor((now.getTime() - new Date(enquiry.createdAt).getTime()) / (1000 * 60))
      : null

    const updatedEnquiry = await prisma.enquiry.update({
      where: { id },
      data: { 
        status: data.status,
        respondedAt: enquiry.respondedAt || now
      }
    })

    if (!enquiry.respondedAt) {
      const currentProfile = await prisma.tradeProfile.findUnique({
        where: { id: enquiry.tradeProfileId }
      })

      if (currentProfile) {
        const newResponseCount = currentProfile.enquiriesResponded + 1
        const currentAvg = currentProfile.averageResponseTime || 0
        const newAvg = Math.floor(
          (currentAvg * currentProfile.enquiriesResponded + (responseTime || 0)) / newResponseCount
        )

        await prisma.tradeProfile.update({
          where: { id: enquiry.tradeProfileId },
          data: {
            enquiriesResponded: { increment: 1 },
            enquiriesAccepted: data.status === "ACCEPTED" ? { increment: 1 } : undefined,
            averageResponseTime: newAvg,
            lastActive: now
          }
        })
      }
    } else if (data.status === "ACCEPTED" && enquiry.status !== "ACCEPTED") {
      await prisma.tradeProfile.update({
        where: { id: enquiry.tradeProfileId },
        data: {
          enquiriesAccepted: { increment: 1 },
          lastActive: now
        }
      })
    }

    return NextResponse.json({ enquiry: updatedEnquiry })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Update enquiry error:", error)
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 })
  }
}
