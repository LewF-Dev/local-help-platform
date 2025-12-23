"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<"CLIENT" | "TRADE">("CLIENT")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    businessName: "",
    category: "PLUMBER",
    description: "",
    postcode: "",
    serviceRadius: 10
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const categories = [
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
    { value: "CLEANER", label: "Cleaner" },
    { value: "MOBILE_BARBER", label: "Mobile Barber" },
    { value: "MOBILE_BEAUTICIAN", label: "Mobile Beautician" },
    { value: "MASSAGE_THERAPIST", label: "Massage Therapist" },
    { value: "PERSONAL_TRAINER", label: "Personal Trainer" },
    { value: "MOBILE_MECHANIC", label: "Mobile Mechanic" },
    { value: "IT_SUPPORT", label: "IT Support (On-site)" },
    { value: "PHOTOGRAPHER", label: "Photographer (Events)" },
    { value: "OTHER", label: "Other" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const payload: any = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || undefined,
        role
      }

      if (role === "TRADE") {
        payload.tradeProfile = {
          businessName: formData.businessName,
          category: formData.category,
          description: formData.description,
          postcode: formData.postcode,
          serviceRadius: formData.serviceRadius
        }
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Registration failed")
        return
      }

      router.push("/login")
    } catch (error) {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Create Account
            </h1>
            <p className="text-slate-600">
              Join LocalTrades today
            </p>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={() => setRole("CLIENT")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                role === "CLIENT"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              I Need Help
            </button>
            <button
              type="button"
              onClick={() => setRole("TRADE")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                role === "TRADE"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              I Offer Services
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Input
              label="Phone (optional)"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            {role === "TRADE" && (
              <>
                <div className="border-t pt-4 mt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Service Profile
                  </h3>
                </div>

                <Input
                  label="Business Name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Describe your services..."
                    required
                  />
                </div>

                <Input
                  label="Postcode"
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  placeholder="e.g. SW1A 1AA"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Service Radius (miles)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.serviceRadius}
                    onChange={(e) => setFormData({ ...formData, serviceRadius: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Founding Member Benefit:</strong> Your first 3 enquiries are completely free!
                  </p>
                </div>
              </>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
