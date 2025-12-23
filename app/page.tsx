"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Home() {
  const categories = [
    { name: "Plumbers", icon: "🔧" },
    { name: "Electricians", icon: "⚡" },
    { name: "Cleaners", icon: "🧹" },
    { name: "Handyman", icon: "🛠️" },
    { name: "Barbers", icon: "✂️" },
    { name: "Personal Trainers", icon: "💪" },
  ]

  const features = [
    {
      title: "Verified Professionals",
      description: "All service providers are verified before appearing in search results",
      icon: "✓"
    },
    {
      title: "Local Focus",
      description: "Find help in your area using postcode search",
      icon: "📍"
    },
    {
      title: "Direct Contact",
      description: "Contact providers directly or send enquiries through the platform",
      icon: "💬"
    },
    {
      title: "Fair & Transparent",
      description: "No commission fees - providers pay a simple monthly subscription",
      icon: "💰"
    }
  ]

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              Find Local Help
              <br />
              <span className="text-blue-200">When You Need It</span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Connect with verified local professionals who can come to you. No middleman, no commission, just direct contact with people who can help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
                  Find Help
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  Offer Services
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-colors cursor-pointer"
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <div className="text-white font-medium">{category.name}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose LocalHelp?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Find someone local who can come to you and get it done
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Need Help?
              </h2>
              <div className="space-y-4 text-lg text-slate-600">
                <p className="flex items-start">
                  <span className="text-2xl mr-3">🔍</span>
                  <span>Search by postcode to find local help</span>
                </p>
                <p className="flex items-start">
                  <span className="text-2xl mr-3">✉️</span>
                  <span>Send enquiries with your timeline and needs</span>
                </p>
                <p className="flex items-start">
                  <span className="text-2xl mr-3">📞</span>
                  <span>Get direct contact details for verified providers</span>
                </p>
                <p className="flex items-start">
                  <span className="text-2xl mr-3">⭐</span>
                  <span>See reliability scores based on real behavior</span>
                </p>
              </div>
              <Link href="/search">
                <Button size="lg" className="mt-8">
                  Find Help Now
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Offer Services?
              </h2>
              <div className="space-y-4 text-lg text-slate-600">
                <p className="flex items-start">
                  <span className="text-2xl mr-3">🎁</span>
                  <span>First 3 enquiries completely free</span>
                </p>
                <p className="flex items-start">
                  <span className="text-2xl mr-3">💷</span>
                  <span>Simple monthly subscription, no commission</span>
                </p>
                <p className="flex items-start">
                  <span className="text-2xl mr-3">📊</span>
                  <span>Build your reliability score through good service</span>
                </p>
                <p className="flex items-start">
                  <span className="text-2xl mr-3">🎯</span>
                  <span>Only receive enquiries from your service area</span>
                </p>
              </div>
              <Link href="/register">
                <Button size="lg" className="mt-8">
                  Join as Provider
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join people finding and offering local help
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Find Help
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                  Offer Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
