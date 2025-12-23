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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Find Local Help
              </span>
              <br />
              <span className="text-zinc-300">When You Need It</span>
            </h1>
            <p className="text-xl sm:text-2xl text-zinc-400 mb-8 max-w-3xl mx-auto">
              Connect with verified local professionals who can come to you. No middleman, no commission, just direct contact with people who can help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search">
                <Button size="lg" variant="gradient">
                  Find Help
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline">
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
                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-4 text-center hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{category.icon}</div>
                <div className="text-zinc-300 font-medium">{category.name}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-600/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Why Choose LocalHelp?
              </span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
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
                <Card hover glow className="h-full">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Need Help?
                </span>
              </h2>
              <div className="space-y-4 text-lg text-zinc-400">
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
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  Offer Services?
                </span>
              </h2>
              <div className="space-y-4 text-lg text-zinc-400">
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

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.2),transparent_70%)]"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ready to Get Started?
              </span>
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Join people finding and offering local help
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search">
                <Button size="lg" variant="gradient">
                  Find Help
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline">
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
