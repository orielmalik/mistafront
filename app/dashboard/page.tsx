"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, LogOut, FileText, Sparkles } from "lucide-react"
import { apiService } from "@/services/ApiService"

export default function DashboardPage() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const [graphIds, setGraphIds] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    const operatorId = user?.email

    useEffect(() => {
        const loadGraphs = async () => {
            if (!operatorId) {
                router.replace("/auth")
                return
            }

            try {
                const response = await apiService.listGraphIds(operatorId)
                setGraphIds(response.data ?? [])
            } catch {
                setGraphIds([])
            } finally {
                setLoading(false)
            }
        }

        loadGraphs()
    }, [operatorId, router])

    const createNewGraph = async () => {
        if (!operatorId) return alert("User not authenticated")

        const name = prompt("Enter graph name:", "New Graph")
        if (!name?.trim()) return

        const graphId = name.trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-_]/g, "")

        if (graphId.length < 3) {
            return alert("Graph name must be at least 3 characters")
        }

        if (graphIds.includes(graphId)) {
            return alert(`A graph named "${name.trim()}" already exists. Choose another name.`)
        }
        try {
            // שליפת הרשימה הקיימת מהשרת
            const existingIds = await apiService.listGraphIds(operatorId)

            // בדיקה בטוחה – גם אם זה לא מערך
            const idsArray = Array.isArray(existingIds) ? existingIds.map(String) : []

            if (idsArray.includes(graphId)) {
                alert(`A graph with the name "${name}" already exists!\n(ID: ${graphId})`)
                return
            }


            router.push(`/graphstudio/${operatorId}/graphs/${graphId}/studio`)
        } catch (error) {
            console.error("Failed to check existing graphs:", error)
            alert("Error checking graph name. Please try again.")
        }
    }
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Sparkles className="w-16 h-16 animate-spin text-purple-600" />
                <span className="ml-4 text-2xl text-gray-600">Loading your graphs...</span>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-black">
            <div className="container mx-auto px-6 py-12 max-w-7xl">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-gray-900 dark:text-white">
                            Hello,{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                {user?.username || user?.email || "User"}
                            </span>
                        </h1>
                        <p className="text-2xl text-gray-600 dark:text-gray-400 mt-4">
                            {graphIds.length} {graphIds.length === 1 ? "graph" : "graphs"} available
                        </p>
                    </div>
                    <button onClick={logout} className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition shadow-lg">
                        <LogOut className="w-6 h-6" /> Logout
                    </button>
                </div>

                <div className="mb-16 text-center">
                    <button onClick={createNewGraph} className="inline-flex items-center gap-6 px-16 py-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-4xl font-bold rounded-3xl shadow-2xl hover:scale-105 transition-all">
                        <Plus className="w-14 h-14" /> Create New Graph <Sparkles className="w-12 h-12" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {graphIds.length === 0 ? (
                        <div className="col-span-full text-center py-32">
                            <p className="text-6xl text-gray-400 mb-8">No graphs yet</p>
                            <p className="text-2xl text-gray-500">Click the button above to create your first graph!</p>
                        </div>
                    ) : (
                        graphIds.map((id) => (
                            <Link href={`/graphstudio/${operatorId}/graphs/${id}/studio`} className="block group">                             <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-2 border-transparent hover:border-purple-500">
                                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 mx-auto">
                                        <FileText className="w-12 h-12 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                                        {id.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                                    </h3>
                                    <p className="text-center text-sm text-gray-500 mt-2 truncate">ID: {id}</p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}