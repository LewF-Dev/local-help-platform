import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(["TRADE", "CLIENT"]),
  tradeProfile: z.object({
    businessName: z.string().min(2),
    category: z.enum([
      "PLUMBER", "ELECTRICIAN", "CARPENTER", "PAINTER", "BUILDER",
      "ROOFER", "PLASTERER", "TILER", "LANDSCAPER", "WINDOW_CLEANER",
      "HANDYMAN", "OTHER"
    ]),
    description: z.string().min(20),
    postcode: z.string().min(5),
    serviceRadius: z.number().min(1).max(50)
  }).optional()
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: data.role,
        ...(data.role === "TRADE" && data.tradeProfile && {
          tradeProfile: {
            create: {
              businessName: data.tradeProfile.businessName,
              category: data.tradeProfile.category,
              description: data.tradeProfile.description,
              postcode: data.tradeProfile.postcode.toUpperCase().replace(/\s+/g, ''),
              serviceRadius: data.tradeProfile.serviceRadius
            }
          }
        })
      },
      include: {
        tradeProfile: true
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}
