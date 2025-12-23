"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatCategory } from "@/lib/utils"

interface Trade {
  id: string
  businessName: string
  category: string
  description: string
  postcode: string
  serviceRadius: number
  distance: number
  user: {
    name: string
    email: string
    phone: string | null
  }
}

export default function SearchPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [postcode, setPostcode] = useState("")
  const [category, setCategory] = useState("ALL")
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)
  const [enquiryForm, setEnquiryForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientPostcode: "",
    jobDescription: ""
  })

  const categories = [
    { value: "ALL", label: "All Categories" },
    { value: "PLUMBER", label: "Plumber" },
    { value: "ELECTRICIAN", label: "Electrician" },
    { value: "CARPENTER", label: "Carpenter" },
    { value: "PAINTER", label: "Painter" },
    { value: "BUILDER", label: "Builder" },
    { value: "ROOFER", label: "Roofer" },
    { value: "PLASTERER", label: "Plasterer" },
    { value: "TILER", label: "Tiler" },
    { value: "LANDSCAPER", label: "Landscaper" },
    { value: "WINDOW_CLEANER", label: "Window Cleaner" },
    { value: "HANDYMAN", label: "Handyman" },
    { value: "OTHER", label: "Other" }
  ]

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSearched(true)

    try {
      const params = new URLSearchParams({
        postcode,
        ...(category !== "ALL" && { category })
      })

      const res = await fetch(`/api/search?${params}`)
      const data = await res.json()
      setTrades(data.trades || [])
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      router.push("/login")
      return
    }

    if (!selectedTrade) return

    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tradeProfileId: selectedTrade.id,
          ...enquiryForm
        })
      })

      setSelectedTrade(null)
      setEnquiryForm({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        clientPostcode: "",
        jobDescription: ""
      })
      alert("Enquiry sent successfully!")
    } catch (error) {
      console.error("Failed to send enquiry:", error)
      alert("Failed to send enquiry")
    }
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
            Find Local Trades
          </h1>
          <p className="text-slate-600">
            Search for verified tradespeople in your area
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Postcode"
                  placeholder="e.g. SW1A 1AA"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Searching..." : "Search"}
              </Button>
            </form>
          </Card>
        </motion.div>

        {searched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {trades.length === 0 ? (
              <Card>
                <p className="text-center text-slate-600 py-8">
                  No trades found in your area. Try expanding your search or selecting a different category.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  {trades.length} {trades.length === 1 ? "Trade" : "Trades"} Found
                </h2>
                {trades.map((trade, index) => (
                  <motion.div
                    key={trade.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card hover>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">
                            {trade.businessName}
                          </h3>
                          <p className="text-slate-600">{formatCategory(trade.category)}</p>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            ✓ Verified
                          </span>
                          <p className="text-sm text-slate-600 mt-2">
                            ~{trade.distance} miles away
                          </p>
                        </div>
                      </div>

                      <p className="text-slate-700 mb-4">{trade.description}</p>

                      <div className="flex flex-wrap gap-2 text-sm text-slate-600 mb-4">
                        <span>📍 {trade.postcode}</span>
                        <span>📏 {trade.serviceRadius} mile radius</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedTrade(trade)}
                          variant="primary"
                        >
                          Send Enquiry
                        </Button>
                        {trade.user.phone && (
                          <Button variant="outline">
                            📞 {trade.user.phone}
                          </Button>
                        )}
                        {trade.user.email && (
                          <Button variant="outline">
                            📧 {trade.user.email}
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {selectedTrade && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedTrade(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Send Enquiry to {selectedTrade.businessName}
              </h2>

              <form onSubmit={handleEnquiry} className="space-y-4">
                <Input
                  label="Your Name"
                  value={enquiryForm.clientName}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, clientName: e.target.value })}
                  required
                />
                <Input
                  label="Your Email"
                  type="email"
                  value={enquiryForm.clientEmail}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, clientEmail: e.target.value })}
                  required
                />
                <Input
                  label="Your Phone"
                  value={enquiryForm.clientPhone}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, clientPhone: e.target.value })}
                  required
                />
                <Input
                  label="Your Postcode"
                  value={enquiryForm.clientPostcode}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, clientPostcode: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Job Description
                  </label>
                  <textarea
                    value={enquiryForm.jobDescription}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, jobDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Send Enquiry
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedTrade(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
