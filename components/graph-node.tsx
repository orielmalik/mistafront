// components/graph-node.tsx
"use client"

import type { Node } from "@/types/graph"
import { Trash2, Link2 } from "lucide-react"
import { useState } from "react"

interface GraphNodeProps {
    node: Node
    isSelected: boolean
    isConnecting: boolean
    onSelect: () => void
    onStartConnection: () => void
    onCompleteConnection: () => void
    onDelete: () => void
    isDark?: boolean
}

const COLORS = {
    questionnaire: { bg: "bg-blue-600", border: "border-blue-500", glow: "rgb(96, 165, 250)" },
    personality: { bg: "bg-purple-600", border: "border-purple-500", glow: "rgb(168, 85, 247)" },
    dataEntry: { bg: "bg-green-600", border: "border-green-500", glow: "rgb(34, 197, 94)" },
    chat: { bg: "bg-orange-600", border: "border-orange-500", glow: "rgb(249, 115, 22)" },
    goal: { bg: "bg-red-600", border: "border-red-500", glow: "rgb(239, 68, 68)" },
} as const

const LABELS = {
    questionnaire: "Q",
    personality: "PI",
    dataEntry: "DE",
    chat: "CH",
    goal: "G",
} as const

export default function GraphNode({
                                      node,
                                      isSelected,
                                      isConnecting,
                                      onSelect,
                                      onStartConnection,
                                      onCompleteConnection,
                                      onDelete,
                                      isDark = false,
                                  }: GraphNodeProps) {
    const [showTooltip, setShowTooltip] = useState(false)
    const c = COLORS[node.type]

    return (
        <div
            onClick={onSelect}
            className={`
        relative w-72 p-6 rounded-2xl border-4 shadow-2xl cursor-pointer select-none transition-all
        ${c.border} ${isSelected ? "scale-105 ring-4 ring-yellow-400 ring-offset-4 ring-offset-transparent" : "hover:scale-105"}
        ${isConnecting ? "animate-pulse ring-8 ring-yellow-400" : ""}
      `}
            style={{
                backgroundColor: "var(--card)",
                boxShadow: isSelected
                    ? `0 0 40px ${c.glow}60, 0 15px 35px rgba(0,0,0,0.3)`
                    : "0 10px 30px rgba(0,0,0,0.2)",
            }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`${c.bg} w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-xl border-4 border-white/90 -rotate-6`}>
                    {LABELS[node.type]}
                </div>

                <div className="flex gap-3">
                    <button
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onMouseDown={(e) => { e.stopPropagation(); onStartConnection() }}
                        onMouseUp={(e) => { e.stopPropagation(); onCompleteConnection() }}
                        className={`p-3 rounded-xl transition-all ${isConnecting ? "bg-yellow-400 text-black scale-125 shadow-xl" : "bg-primary/10 hover:bg-primary/20"}`}
                    >
                        <Link2 className="w-6 h-6" />
                    </button>
                    {showTooltip && (
                        <div className="absolute top-16 right-0 bg-black text-white text-xs px-3 py-1 rounded-lg z-50">
                            Click and drag to connect
                        </div>
                    )}

                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete() }}
                        className="p-3 rounded-xl hover:bg-red-500/20 text-red-600 transition-all"
                    >
                        <Trash2 className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* רק תצוגה – כל העריכה בפאנל הימני */}
            <div className="space-y-3">
                {node.data.header ? (
                    <h3 className="text-2xl font-bold">{node.data.header}</h3>
                ) : (
                    <p className="text-muted-foreground italic">Click to edit...</p>
                )}
                <p className="text-xl font-bold text-primary">{node.data.label || "Untitled Node"}</p>
                {node.data.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{node.data.description}</p>
                )}
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-4">
                    {node.type}
                </p>
            </div>
        </div>
    )
}