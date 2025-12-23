import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createEnquirySchema = z.object({
  tradeProfileId: z.string(),
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(10),
  clientPostcode: z.string().min(5),
  jobDescription: z.string().min(20)
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = createEnquirySchema.parse(body)

    const tradeProfile = await prisma.tradeProfile.findUnique({
      where: { id: data.tradeProfileId }
    })

    if (!tradeProfile) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 })
    }

    if (!tradeProfile.active) {
      return NextResponse.json({ error: "Trade is not accepting enquiries" }, { status: 400 })
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        clientId: session.user.id,
        tradeProfileId: data.tradeProfileId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        clientPostcode: data.clientPostcode.toUpperCase().replace(/\s+/g, ''),
        jobDescription: data.jobDescription
      }
    })

    const updatedProfile = await prisma.tradeProfile.update({
      where: { id: data.tradeProfileId },
      data: {
        enquiriesReceived: {
          increment: 1
        }
      }
    })

    if (updatedProfile.enquiriesReceived >= updatedProfile.freeUntil && !updatedProfile.subscriptionActive) {
      await prisma.tradeProfile.update({
        where: { id: data.tradeProfileId },
        data: { active: false }
      })
    }

    return NextResponse.json({ enquiry })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Create enquiry error:", error)
    return NextResponse.json({ error: "Failed to create enquiry" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let enquiries

    if (session.user.role === "TRADE") {
      enquiries = await prisma.enquiry.findMany({
        where: {
          tradeProfile: {
            userId: session.user.id
          }
        },
        include: {
          client: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      enquiries = await prisma.enquiry.findMany({
        where: {
          clientId: session.user.id
        },
        include: {
          tradeProfile: {
            include: {
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }

    return NextResponse.json({ enquiries })
  } catch (error) {
    console.error("Get enquiries error:", error)
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 })
  }
}
