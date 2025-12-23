import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateDistance } from "@/lib/utils"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const postcode = searchParams.get("postcode")
    const category = searchParams.get("category")

    if (!postcode) {
      return NextResponse.json(
        { error: "Postcode is required" },
        { status: 400 }
      )
    }

    const formattedPostcode = postcode.toUpperCase().replace(/\s+/g, '')
    const postcodeArea = formattedPostcode.substring(0, 2)

    const whereClause: any = {
      active: true,
      verified: true,
      OR: [
        { postcode: { startsWith: postcodeArea } },
        { postcode: formattedPostcode }
      ]
    }

    if (category && category !== "ALL") {
      whereClause.category = category
    }

    const trades = await prisma.tradeProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            phone: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const tradesWithDistance = trades
      .map(trade => ({
        ...trade,
        distance: calculateDistance(formattedPostcode, trade.postcode)
      }))
      .filter(trade => trade.distance <= trade.serviceRadius)
      .sort((a, b) => a.distance - b.distance)

    return NextResponse.json({ trades: tradesWithDistance })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    )
  }
}
