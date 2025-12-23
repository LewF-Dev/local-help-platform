"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { formatCategory } from "@/lib/utils"

interface Trade {
  id: string
  businessName: string
  category: string
  postcode: string
  verified: boolean
  active: boolean
  enquiriesReceived: number
  subscriptionActive: boolean
  user: {
    name: string
    email: string
    phone: string | null
  }
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (session?.user.role !== "ADMIN") {
      router.push("/dashboard")
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user.role === "ADMIN") {
      fetchTrades()
    }
  }, [session])

  const fetchTrades = async () => {
    try {
      const res = await fetch("/api/admin/trades")
      const data = await res.json()
      setTrades(data.trades || [])
    } catch (error) {
      console.error("Failed to fetch trades:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleVerification = async (id: string, currentStatus: boolean) => {
    try {
      const method = currentStatus ? "DELETE" : "POST"
      await fetch(`/api/admin/trades/${id}/verify`, { method })
      fetchTrades()
    } catch (error) {
      console.error("Failed to toggle verification:", error)
    }
  }

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-zinc-100 mb-2">Admin Panel</h1>
          <p className="text-zinc-400">Manage trade profiles and verifications</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">All Trades</h2>

          {trades.length === 0 ? (
            <p className="text-zinc-400 text-center py-8">No trades registered yet</p>
          ) : (
            <div className="space-y-4">
              {trades.map((trade, index) => (
                <motion.div
                  key={trade.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-zinc-800 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-zinc-100 text-lg">
                        {trade.businessName}
                      </h3>
                      <p className="text-zinc-400">{formatCategory(trade.category)}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {trade.user.name} • {trade.user.email}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {trade.verified && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          ✓ Verified
                        </span>
                      )}
                      {trade.active && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          Active
                        </span>
                      )}
                      {trade.subscriptionActive && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          Subscribed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm text-zinc-400 mb-3">
                    <span>📍 {trade.postcode}</span>
                    <span>📊 {trade.enquiriesReceived} enquiries</span>
                    {trade.user.phone && <span>📞 {trade.user.phone}</span>}
                  </div>

                  <button
                    onClick={() => toggleVerification(trade.id, trade.verified)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      trade.verified
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {trade.verified ? "Unverify" : "Verify"}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
