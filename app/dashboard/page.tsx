"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { formatCategory } from "@/lib/utils"

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
  freeUntil: number
  subscriptionActive: boolean
  subscriptionEnds: string | null
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {session?.user.role === "TRADE" ? "Trade Dashboard" : "My Enquiries"}
          </h1>
          <p className="text-slate-600">
            Welcome back, {session?.user.name}
          </p>
        </motion.div>

        {session?.user.role === "TRADE" && profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  {profile.businessName}
                </h2>
                <p className="text-slate-600">{formatCategory(profile.category)}</p>
              </div>
              <div className="flex gap-2">
                {profile.verified && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    ✓ Verified
                  </span>
                )}
                <button
                  onClick={toggleActive}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    profile.active
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {profile.active ? "Active" : "Inactive"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-600 text-sm mb-1">Enquiries Received</p>
                <p className="text-3xl font-bold text-slate-900">
                  {profile.enquiriesReceived}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-600 text-sm mb-1">Free Enquiries Left</p>
                <p className="text-3xl font-bold text-slate-900">
                  {Math.max(0, profile.freeUntil - profile.enquiriesReceived)}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-600 text-sm mb-1">Subscription</p>
                <p className="text-xl font-bold text-slate-900">
                  {profile.subscriptionActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>

            {!profile.subscriptionActive && profile.enquiriesReceived >= profile.freeUntil && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 font-medium">
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
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {session?.user.role === "TRADE" ? "Received Enquiries" : "Sent Enquiries"}
          </h2>

          {enquiries.length === 0 ? (
            <p className="text-slate-600 text-center py-8">No enquiries yet</p>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enquiry, index) => (
                <motion.div
                  key={enquiry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {enquiry.clientName}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        enquiry.status === "ACCEPTED"
                          ? "bg-green-100 text-green-700"
                          : enquiry.status === "DECLINED"
                          ? "bg-red-100 text-red-700"
                          : enquiry.status === "CONTACTED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {enquiry.status}
                    </span>
                  </div>

                  <p className="text-slate-700 mb-3">{enquiry.jobDescription}</p>

                  <div className="flex flex-wrap gap-2 text-sm text-slate-600 mb-3">
                    <span>📧 {enquiry.clientEmail}</span>
                    <span>📞 {enquiry.clientPhone}</span>
                    <span>📍 {enquiry.clientPostcode}</span>
                  </div>

                  {session?.user.role === "TRADE" && enquiry.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateEnquiryStatus(enquiry.id, "ACCEPTED")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateEnquiryStatus(enquiry.id, "CONTACTED")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Contact Client
                      </button>
                      <button
                        onClick={() => updateEnquiryStatus(enquiry.id, "DECLINED")}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
