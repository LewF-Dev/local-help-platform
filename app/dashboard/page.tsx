"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { formatCategory } from "@/lib/utils"
import { calculateReliabilityScore, formatReliabilityLabel } from "@/lib/reliability"

interface Enquiry {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientPostcode: string
  jobDescription: string
  status: string
  createdAt: string
}

interface TradeProfile {
  id: string
  businessName: string
  category: string
  description: string
  postcode: string
  serviceRadius: number
  verified: boolean
  active: boolean
  enquiriesReceived: number
  enquiriesResponded: number
  enquiriesAccepted: number
  averageResponseTime: number | null
  lastActive: string
  freeUntil: number
  subscriptionActive: boolean
  subscriptionEnds: string | null
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [profile, setProfile] = useState<TradeProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      const [enquiriesRes, profileRes] = await Promise.all([
        fetch("/api/enquiries"),
        session?.user.role === "TRADE" ? fetch("/api/trades/profile") : Promise.resolve(null)
      ])

      const enquiriesData = await enquiriesRes.json()
      setEnquiries(enquiriesData.enquiries || [])

      if (profileRes) {
        const profileData = await profileRes.json()
        setProfile(profileData.profile)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateEnquiryStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })
      fetchData()
    } catch (error) {
      console.error("Failed to update enquiry:", error)
    }
  }

  const toggleActive = async () => {
    if (!profile) return
    
    try {
      await fetch("/api/trades/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !profile.active })
      })
      fetchData()
    } catch (error) {
      console.error("Failed to toggle active status:", error)
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              {session?.user.role === "TRADE" ? "Trade Dashboard" : "My Enquiries"}
            </span>
          </h1>
          <p className="text-zinc-400">
            Welcome back, {session?.user.name}
          </p>
        </motion.div>

        {session?.user.role === "TRADE" && profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-zinc-800/50 p-6 mb-8"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-zinc-100 mb-1">
                  {profile.businessName}
                </h2>
                <p className="text-zinc-400">{formatCategory(profile.category)}</p>
                {(() => {
                  const reliability = calculateReliabilityScore({
                    enquiriesReceived: profile.enquiriesReceived,
                    enquiriesResponded: profile.enquiriesResponded,
                    enquiriesAccepted: profile.enquiriesAccepted,
                    averageResponseTime: profile.averageResponseTime,
                    lastActive: new Date(profile.lastActive),
                    verified: profile.verified,
                    createdAt: new Date(profile.createdAt)
                  })
                  
                  return (
                    <p className="text-sm text-zinc-500 mt-1" title={reliability.description}>
                      {reliability.percentage > 0 
                        ? `${formatReliabilityLabel(reliability.percentage)} - ${reliability.description}`
                        : `${reliability.label} - ${reliability.description}`
                      }
                    </p>
                  )
                })()}
              </div>
              <div className="flex gap-2">
                {profile.verified && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                    ✓ Verified
                  </span>
                )}
                <button
                  onClick={toggleActive}
                  className={`px-4 py-2 rounded-2xl font-semibold transition-all duration-300 ${
                    profile.active
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {profile.active ? "Active" : "Inactive"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 border border-zinc-700/50">
                <p className="text-zinc-400 text-sm mb-1">Enquiries Received</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  {profile.enquiriesReceived}
                </p>
              </div>
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 border border-zinc-700/50">
                <p className="text-zinc-400 text-sm mb-1">Response Rate</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {profile.enquiriesReceived > 0 
                    ? Math.round((profile.enquiriesResponded / profile.enquiriesReceived) * 100)
                    : 0}%
                </p>
              </div>
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 border border-zinc-700/50">
                <p className="text-zinc-400 text-sm mb-1">Free Enquiries Left</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  {Math.max(0, profile.freeUntil - profile.enquiriesReceived)}
                </p>
              </div>
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 border border-zinc-700/50">
                <p className="text-zinc-400 text-sm mb-1">Subscription</p>
                <p className="text-xl font-bold text-zinc-100">
                  {profile.subscriptionActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>

            {!profile.subscriptionActive && profile.enquiriesReceived >= profile.freeUntil && (
              <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl backdrop-blur-sm">
                <p className="text-amber-400 font-medium">
                  You've reached your free enquiry limit. Subscribe to continue receiving enquiries.
                </p>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-zinc-800/50 p-6"
        >
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">
            {session?.user.role === "TRADE" ? "Received Enquiries" : "Sent Enquiries"}
          </h2>

          {enquiries.length === 0 ? (
            <p className="text-zinc-400 text-center py-8">No enquiries yet</p>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enquiry, index) => (
                <motion.div
                  key={enquiry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-zinc-100">
                        {enquiry.clientName}
                      </h3>
                      <p className="text-sm text-zinc-500">
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        enquiry.status === "ACCEPTED"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : enquiry.status === "DECLINED"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : enquiry.status === "CONTACTED"
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          : "bg-zinc-700/50 text-zinc-400 border-zinc-600/30"
                      }`}
                    >
                      {enquiry.status}
                    </span>
                  </div>

                  <p className="text-zinc-300 mb-3">{enquiry.jobDescription}</p>

                  <div className="flex flex-wrap gap-2 text-sm text-zinc-400 mb-3">
                    <span>📧 {enquiry.clientEmail}</span>
                    <span>📞 {enquiry.clientPhone}</span>
                    <span>📍 {enquiry.clientPostcode}</span>
                  </div>

                  {session?.user.role === "TRADE" && enquiry.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateEnquiryStatus(enquiry.id, "ACCEPTED")}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 font-semibold"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateEnquiryStatus(enquiry.id, "CONTACTED")}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 font-semibold"
                      >
                        Contact Client
                      </button>
                      <button
                        onClick={() => updateEnquiryStatus(enquiry.id, "DECLINED")}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 font-semibold"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
