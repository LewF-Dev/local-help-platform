import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateEnquirySchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED", "CONTACTED"])
})

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "TRADE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = updateEnquirySchema.parse(body)

    const enquiry = await prisma.enquiry.findUnique({
      where: { id: params.id },
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

    const updatedEnquiry = await prisma.enquiry.update({
      where: { id: params.id },
      data: { status: data.status }
    })

    return NextResponse.json({ enquiry: updatedEnquiry })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Update enquiry error:", error)
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 })
  }
}
