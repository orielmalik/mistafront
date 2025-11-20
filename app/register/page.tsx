"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import {apiService} from "@/services/ApiService";


export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: true, // true = Male, false = Female
    position: true, // true = Operator, false = User
    birthdate: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)


  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 8) strength += 25
    if (pwd.length >= 12) strength += 25
    if (/[A-Z]/.test(pwd)) strength += 25
    if (/[0-9!@#$%^&*]/.test(pwd)) strength += 25
    return strength
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Username validation: 3-20 chars, alphanumeric + underscore
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      newErrors.username = "Username: 3-20 chars, alphanumeric + underscore only"
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    // Phone number validation (Israeli format)
    if (!/^05\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid Israeli phone format (05XXXXXXXX)"
    }

    // Birthdate validation
    if (!formData.birthdate) {
      newErrors.birthdate = "Birthdate is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 10) value = value.slice(0, 10)
    setFormData({ ...formData, phoneNumber: value })
  }

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "") // רק מספרים
    if (value.length > 8) value = value.slice(0, 8)

    let formatted = value
    if (value.length > 2 && value.length <= 4) {
      formatted = `${value.slice(0, 2)}-${value.slice(2)}`
    } else if (value.length > 4) {
      formatted = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4, 8)}`
    }

    setFormData({ ...formData, birthdate: formatted })
  }


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()



    if (!formData.username || !formData.password || !formData.email) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)

    const userData = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      gender: formData.gender,
      position: formData.position,
      phoneNumber: formData.phoneNumber,
      birthdate: formData.birthdate,
      more: {},
    }

    try {
      if (!apiService.register) {
        throw new Error("apiService.register ->import")
      }

      const response = await apiService.register(userData)
      // ...
    } catch (err) {
      console.error("err", err)
      alert("rr: " + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }


  const passwordStrengthPercent = calculatePasswordStrength(formData.password)

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Join GraphStudio Pro today</p>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                    errors.username
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  }`}
                  placeholder="john_doe"
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password with Strength Meter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
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
                {formData.password && (
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

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number (IL)
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
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

              {/* Birthdate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Birthdate (DD-MM-YYYY)
                </label>
                <input
                    type="text"
                    placeholder="15-01-1990"
                    maxLength={10}
                    value={formData.birthdate}
                    onChange={handleBirthdateChange}
                    className="..."
                />

                {errors.birthdate && <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>}
              </div>

              {/* Gender Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: true })}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                      formData.gender
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: false })}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                      !formData.gender
                        ? "bg-pink-600 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {/* Position Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, position: false })}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                      !formData.position
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, position: true })}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                      formData.position
                        ? "bg-purple-600 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Operator
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 mt-6"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
