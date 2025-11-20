"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { apiService } from "@/services/ApiService"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!apiService.login) {
        throw new Error("apiService.login ->import")
      }

      const response = await apiService.login(email,password)
      // ...
    } catch (err) {
      console.error("err", err)
      alert("rr: " + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }
  return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-black dark:via-slate-900 dark:to-black">
        <Link href="/">
          <motion.button className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" whileHover={{ x: -4 }}>
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>
        </Link>

        <div className="flex items-center justify-center min-h-screen px-4">
          <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Sign in to your account</p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
                </div>

                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50">
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Register
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
  )
}
