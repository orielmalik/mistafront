// app/dashboard/page.tsx
"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function DashboardPage() {
    const { user, isLoading, logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/auth")
        }
    }, [user, isLoading, router])

    if (isLoading || !user) {
        return (
            <div className="flex h-screen items-center justify-center text-xl">
                Loading...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Welcome, {user.username}!
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                            Operator email: {user.email}
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Create New Graph */}
                <div className="mb-12">
                    <Link
                        href="/builder"
                        className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
                    >
                        + Create New Graph
                    </Link>
                </div>

                {/* List of existing graphs (optional – you can load from API later) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Example placeholder */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
                        <h3 className="text-xl font-semibold">Personality Test 2025</h3>
                        <p className="text-gray-500 mt-2">Created: 23 Nov 2025</p>
                        <div className="mt-4 flex gap-3">
                            <Link
                                href="/builder"
                                className="text-blue-600 hover:underline"
                            >
                                Edit
                            </Link>
                            <Link
                                href="/interview/123"
                                className="text-green-600 hover:underline"
                            >
                                Run Interview
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}