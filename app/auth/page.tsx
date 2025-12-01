"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { apiService } from "@/services/ApiService"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  const [reg, setReg] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: true,
    position: true,
    birthdate: "",
  })

  const [passwordStrength, setPasswordStrength] = useState(0)
  const [regErrors, setRegErrors] = useState<Record<string, string>>({})
  const [regLoading, setRegLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 8) strength += 25
    if (pwd.length >= 12) strength += 25
    if (/[A-Z]/.test(pwd)) strength += 25
    if (/[0-9!@#$%^&*]/.test(pwd)) strength += 25
    return strength
  }

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10)
    setReg({ ...reg, phoneNumber: digits })
  }

  const handleBirthdateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "").slice(0, 8)
    if (digits.length > 4) digits = `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`
    else if (digits.length > 2) digits = `${digits.slice(0, 2)}-${digits.slice(2)}`
    setReg({ ...reg, birthdate: digits })
  }

  const validateLogin = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
      setLoginError("Please enter a valid email address")
      return false
    }
    if (loginPassword.length < 8) {
      setLoginError("Password must be at least 8 characters")
      return false
    }
    setLoginError("")
    return true
  }

  const validateRegister = () => {
    const errors: Record<string, string> = {}

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(reg.username))
      errors.username = "Username: 3–20 characters, letters, numbers, and underscore only"

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reg.email))
      errors.email = "Please enter a valid email address"

    if (reg.password.length < 8)
      errors.password = "Password must be at least 8 characters"

    if (!/^05\d{8}$/.test(reg.phoneNumber))
      errors.phoneNumber = "Phone must be a valid Israeli mobile number (05XXXXXXXXX)"

    if (!/^\d{2}-\d{2}-\d{4}$/.test(reg.birthdate))
      errors.birthdate = "Birthdate must be in DD-MM-YYYY format"

    setRegErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateLogin()) return

    setLoginLoading(true)
    setLoginError("")

    try {
      const response = await apiService.login(loginEmail, loginPassword)
      if (response.error) throw new Error(response.error.message || "Login failed")

      login(response.data)
      router.push("/dashboard")
    } catch (err: any) {
      setLoginError(err.message || "Invalid email or password")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateRegister()) return

    setRegLoading(true)
    setRegErrors({})

    try {
      const payload = {
        username: reg.username,
        email: reg.email,
        password: reg.password,
        phoneNumber: reg.phoneNumber,
        birthdate: reg.birthdate,
        gender: reg.gender,
        position: reg.position,
        more: {},
      }

      const response = await apiService.register(payload)
      if (response.error) throw new Error(response.error.message || "Registration failed")

      // Auto-login after successful registration
      const tempUser = {
        username: reg.username,
        email: reg.email,
        // Add any other fields you need
      }
      login(tempUser)
      router.push("/dashboard")
    } catch (err: any) {
      setRegErrors({ submit: err.message || "Registration failed. Please try again." })
    } finally {
      setRegLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-black dark:via-slate-900 dark:to-black">
        <Link href="/">
          <motion.button
              className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              whileHover={{ x: -6 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </motion.button>
        </Link>

        <div className="flex min-h-screen items-center justify-center px-4 py-12">
          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-md"
          >
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-2xl">
              <div className="mb-8 flex gap-3">
                <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 rounded-lg py-3 font-bold transition-all ${
                        isLogin
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                    }`}
                >
                  Login
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 rounded-lg py-3 font-bold transition-all ${
                        !isLogin
                            ? "bg-purple-600 text-white shadow-lg"
                            : "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                    }`}
                >
                  Register
                </button>
              </div>

              {isLogin ? (
                  <div>
                    <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
                    <p className="mb-8 text-gray-600 dark:text-gray-400">Sign in to access your graphs</p>

                    <form onSubmit={handleLogin} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                            required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <div className="relative mt-1">
                          <input
                              type={showPassword ? "text" : "password"}
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 px-4 py-2.5 pr-10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="••••••••"
                              required
                          />
                          <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      {loginError && <p className="text-sm text-red-500">{loginError}</p>}

                      <button
                          type="submit"
                          disabled={loginLoading}
                          className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-60 transition"
                      >
                        {loginLoading ? "Signing in..." : "Sign In"}
                      </button>
                    </form>
                  </div>
              ) : (
                  <div>
                    <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
                    <p className="mb-8 text-gray-600 dark:text-gray-400">Join GraphStudio Pro today</p>

                    <form onSubmit={handleRegister} className="space-y-5 max-h-96 overflow-y-auto pr-1">
                      {/* Username */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                        <input
                            type="text"
                            value={reg.username}
                            onChange={(e) => setReg({ ...reg, username: e.target.value })}
                            className={`mt-1 w-full rounded-lg border ${regErrors.username ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-slate-700 px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="john_doe"
                        />
                        {regErrors.username && <p className="mt-1 text-xs text-red-500">{regErrors.username}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            value={reg.email}
                            onChange={(e) => setReg({ ...reg, email: e.target.value })}
                            className={`mt-1 w-full rounded-lg border ${regErrors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-slate-700 px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="you@example.com"
                        />
                        {regErrors.email && <p className="mt-1 text-xs text-red-500">{regErrors.email}</p>}
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <div className="relative mt-1">
                          <input
                              type={showPassword ? "text" : "password"}
                              value={reg.password}
                              onChange={(e) => {
                                setReg({ ...reg, password: e.target.value })
                                setPasswordStrength(calculatePasswordStrength(e.target.value))
                              }}
                              className={`w-full rounded-lg border ${regErrors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-slate-700 px-4 py-2.5 pr-10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                              placeholder="••••••••"
                          />
                          <button
                              type="button"
                              on chic={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {reg.password && (
                            <div className="mt-2">
                              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
                                <div
                                    className={`h-full transition-all duration-300 ${
                                        passwordStrength <= 25
                                            ? "bg-red-500"
                                            : passwordStrength <= 50
                                                ? "bg-yellow-500"
                                                : passwordStrength <= 75
                                                    ? "bg-blue-500"
                                                    : "bg-green-500"
                                    }`}
                                    style={{ width: `${passwordStrength}%` }}
                                />
                              </div>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {passwordStrength <= 25
                                    ? "Weak"
                                    : passwordStrength <= 50
                                        ? "Fair"
                                        : passwordStrength <= 75
                                            ? "Good"
                                            : "Strong"}
                              </p>
                            </div>
                        )}
                        {regErrors.password && <p className="mt-1 text-xs text-red-500">{regErrors.password}</p>}
                      </div>

                      {/* Phone & Birthdate */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone (Israel)</label>
                        <input
                            type="tel"
                            value={reg.phoneNumber}
                            onChange={handlePhoneInput}
                            className={`mt-1 w-full rounded-lg border ${regErrors.phoneNumber ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-slate-700 px-4 py-2.5 font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="0521234567"
                        />
                        {regErrors.phoneNumber && <p className="mt-1 text-xs text-red-500">{regErrors.phoneNumber}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Birthdate (DD-MM-YYYY)</label>
                        <input
                            type="text"
                            value={reg.birthdate}
                            onChange={handleBirthdateInput}
                            maxLength={10}
                            className={`mt-1 w-full rounded-lg border ${regErrors.birthdate ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-slate-700 px-4 py-2.5 font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="15-01-1990"
                        />
                        {regErrors.birthdate && <p className="mt-1 text-xs text-red-500">{regErrors.birthdate}</p>}
                      </div>

                      {/* Gender & Role */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                        <div className="mt-2 flex gap-3">
                          <button
                              type="button"
                              onClick={() => setReg({ ...reg, gender: true })}
                              className={`flex-1 rounded-lg py-2.5 font-bold transition ${reg.gender ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"}`}
                          >
                            Male
                          </button>
                          <button
                              type="button"
                              onClick={() => setReg({ ...reg, gender: false })}
                              className={`flex-1 rounded-lg py-2.5 font-bold transition ${!reg.gender ? "bg-pink-600 text-white shadow-md" : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"}`}
                          >
                            Female
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <div className="mt-2 flex gap-3">
                          <button
                              type="button"
                              onClick={() => setReg({ ...reg, position: false })}
                              className={`flex-1 rounded-lg py-2.5 font-bold transition ${!reg.position ? "bg-green-600 text-white shadow-md" : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"}`}
                          >
                            User
                          </button>
                          <button
                              type="button"
                              onClick={() => setReg({ ...reg, position: true })}
                              className={`flex-1 rounded-lg py-2.5 font-bold transition ${reg.position ? "bg-purple-600 text-white shadow-md" : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"}`}
                          >
                            Operator
                          </button>
                        </div>
                      </div>

                      {regErrors.submit && <p className="text-sm text-red-500 text-center font-medium">{regErrors.submit}</p>}

                      <button
                          type="submit"
                          disabled={regLoading}
                          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-bold text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 transition mt-6"
                      >
                        {regLoading ? "Creating account..." : "Create Account"}
                      </button>
                    </form>
                  </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
  )
}