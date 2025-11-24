"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, LogOut, FileText, Sparkles } from "lucide-react"
import { apiService } from "@/services/ApiService"

export default function DashboardPage() {
    const { user, logout, isOperator } = useAuth()
    const router = useRouter()
    const [graphIds, setGraphIds] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user || !isOperator) {
            router.replace("/auth")
            return
        }

        apiService.listGraphIds(user.email).then(ids => {
            setGraphIds(ids)
            setLoading(false)
        })
    }, [user, isOperator, router])

    const createNewGraph = async () => {
        const name = prompt("Enter graph name", "New Graph")
        if (!name?.trim()) return

        const graphId = crypto.randomUUID()
        const newGraph = { name: name.trim(), nodes: [], edges: [] }

        const result = await apiService.createGraph(graphId, newGraph)
        if (!result.error) {
            if ("email" in user) {
                router.push(`/builder/${user.email}/${graphId}`)
            }
        } else {
            alert("Failed to create graph")
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Sparkles className="w-16 h-16 animate-spin text-purple-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-black dark:to-slate-900">
            <div className="container mx-auto px-6 py-12 max-w-7xl">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-gray-900 dark:text-white">
                            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">{user?.username}</span>
                        </h1>
                        <p className="text-2xl text-gray-600 dark:text-gray-400 mt-4">
                            {graphIds.length} graphs available
                        </p>
                    </div>
                    <button onClick={logout} className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition shadow-lg">
                        <LogOut className="w-6 h-6" /> Logout
                    </button>
                </div>

                <div className="mb-16 text-center">
                    <button
                        onClick={createNewGraph}
                        className="inline-flex items-center gap-6 px-16 py-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-4xl font-bold rounded-3xl shadow-2xl hover:scale-105 transition-all"
                    >
                        <Plus className="w-14 h-14" /> Create New Graph <Sparkles className="w-12 h-12" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {graphIds.length === 0 ? (
                        <div className="col-span-full text-center py-32 text-8xl text-gray-500">No graphs yet</div>
                    ) : (
                        graphIds.map(id => (
                            <Link key={id} href={`/builder/${"email" in user ? user.email :null}/${id}`} className="block group">
                                <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-2 border-transparent hover:border-purple-500">
                                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 mx-auto">
                                        <FileText className="w-12 h-12 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Graph</h3>
                                    <p className="text-center text-sm text-gray-500 mt-2 truncate">{id}</p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}