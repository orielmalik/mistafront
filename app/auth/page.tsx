"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  // Login state
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Register state
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: true,
    position: true,
    birthdate: "",
  })
  const [passwordStrength, setPasswordStrength] = useState(0)

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 8) strength += 25
    if (pwd.length >= 12) strength += 25
    if (/[A-Z]/.test(pwd)) strength += 25
    if (/[0-9!@#$%^&*]/.test(pwd)) strength += 25
    return strength
  }

  const validateLogin = () => {
    const newErrors: Record<string, string> = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = "Invalid email format"
    }
    if (loginData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateRegister = () => {
    const newErrors: Record<string, string> = {}
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(registerData.username)) {
      newErrors.username = "Username: 3-20 chars, alphanumeric + underscore only"
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      newErrors.email = "Invalid email format"
    }
    if (registerData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (!/^05\d{8}$/.test(registerData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid Israeli phone format (05XXXXXXXX)"
    }
    if (!registerData.birthdate) {
      newErrors.birthdate = "Birthdate is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateLogin()) return

    setLoading(true)
    const response = { data: { email: loginData.email }, error: null }

    if (response.error) {
      setErrors({ submit: "Login failed. Please check your credentials." })
    } else {
      console.log("[v0] Mock login successful with email:", loginData.email)
      alert(`Login successful for ${loginData.email}!`)
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateRegister()) return

    setLoading(true)
    const userData = {
      id: Math.random().toString(36).slice(2, 9),
      username: registerData.username,
      password: registerData.password,
      email: registerData.email,
      gender: registerData.gender,
      position: registerData.position,
      phoneNumber: registerData.phoneNumber,
      birthdate: registerData.birthdate,
    }

    const response = { data: userData, error: null }

    if (response.error) {
      setErrors({ submit: "Registration failed. Please try again." })
    } else {
      console.log("[v0] Mock registration successful. User data:", userData)
      alert(`Account created for ${registerData.username}!`)
    }
    setLoading(false)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 10) value = value.slice(0, 10)
    setRegisterData({ ...registerData, phoneNumber: value })
  }

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 2) {
      setRegisterData({ ...registerData, birthdate: value })
    } else if (value.length <= 4) {
      const dayMonth = value.slice(0, 2) + "-" + value.slice(2)
      setRegisterData({ ...registerData, birthdate: dayMonth })
    } else if (value.length <= 8) {
      const day = value.slice(0, 2)
      const month = value.slice(2, 4)
      const year = value.slice(4, 8)
      setRegisterData({ ...registerData, birthdate: `${day}-${month}-${year}` })
    }
  }

  const passwordStrengthPercent = calculatePasswordStrength(registerData.password)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-black dark:via-slate-900 dark:to-black">
      <Link href="/">
        <motion.button
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>
      </Link>

      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => {
                  setIsLogin(true)
                  setErrors({})
                }}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                  isLogin
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false)
                  setErrors({})
                }}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                  !isLogin
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Register
              </button>
            </div>

            {isLogin ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Sign in to your account</p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                      }`}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 pr-10 ${
                          errors.password
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 mt-6"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Join GraphStudio Pro today</p>

                <form onSubmit={handleRegister} className="space-y-4 max-h-96 overflow-y-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                    <input
                      type="text"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                        errors.username
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                      }`}
                      placeholder="john_doe"
                    />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                      }`}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={registerData.password}
                        onChange={(e) => {
                          setRegisterData({ ...registerData, password: e.target.value })
                          setPasswordStrength(calculatePasswordStrength(e.target.value))
                        }}
                        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 pr-10 ${
                          errors.password
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {registerData.password && (
                      <div className="mt-2">
                        <div className="flex h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`transition-all ${
                              passwordStrengthPercent <= 25
                                ? "bg-red-500"
                                : passwordStrengthPercent <= 50
                                  ? "bg-yellow-500"
                                  : passwordStrengthPercent <= 75
                                    ? "bg-blue-500"
                                    : "bg-green-500"
                            }`}
                            style={{ width: `${passwordStrengthPercent}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {passwordStrengthPercent <= 25
                            ? "Weak"
                            : passwordStrengthPercent <= 50
                              ? "Fair"
                              : passwordStrengthPercent <= 75
                                ? "Good"
                                : "Strong"}
                        </p>
                      </div>
                    )}
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number (IL)
                    </label>
                    <input
                      type="tel"
                      value={registerData.phoneNumber}
                      onChange={handlePhoneChange}
                      className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 font-mono ${
                        errors.phoneNumber
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                      }`}
                      placeholder="05XXXXXXXX"
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Birthdate (DD-MM-YYYY)
                    </label>
                    <input
                      type="text"
                      value={registerData.birthdate}
                      onChange={handleBirthdateChange}
                      className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 font-mono ${
                        errors.birthdate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                      }`}
                      placeholder="15-01-1990"
                      maxLength={10}
                    />
                    {errors.birthdate && <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setRegisterData({ ...registerData, gender: true })}
                        className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                          registerData.gender
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegisterData({ ...registerData, gender: false })}
                        className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                          !registerData.gender
                            ? "bg-pink-600 text-white shadow-lg"
                            : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setRegisterData({ ...registerData, position: false })}
                        className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                          !registerData.position
                            ? "bg-green-600 text-white shadow-lg"
                            : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        User
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegisterData({ ...registerData, position: true })}
                        className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                          registerData.position
                            ? "bg-purple-600 text-white shadow-lg"
                            : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        Operator
                      </button>
                    </div>
                  </div>

                  {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 mt-6"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
