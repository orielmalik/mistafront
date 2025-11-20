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
}

const nodeColors: Record<Node["type"], string> = {
  questionnaire: "bg-blue-600",
  personality: "bg-purple-600",
  dataEntry: "bg-green-600",
  chat: "bg-orange-600",
  goal: "bg-red-600",
}

const nodeStrokes: Record<Node["type"], string> = {
  questionnaire: "border-blue-500",
  personality: "border-purple-500",
  dataEntry: "border-green-500",
  chat: "border-orange-500",
  goal: "border-red-500",
}

const nodeLabels: Record<Node["type"], string> = {
  questionnaire: "Q",
  personality: "PI",
  dataEntry: "DE",
  chat: "CH",
  goal: "G",
}

const nodeGlowColors: Record<Node["type"], string> = {
  questionnaire: "rgb(96, 165, 250)",
  personality: "rgb(168, 85, 247)",
  dataEntry: "rgb(34, 197, 94)",
  chat: "rgb(249, 115, 22)",
  goal: "rgb(239, 68, 68)",
}

export default function GraphNode({
  node,
  isSelected,
  isConnecting,
  onSelect,
  onStartConnection,
  onCompleteConnection,
  onDelete,
}: GraphNodeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      onClick={onSelect}
      className={`
        w-48 p-4 bg-card shadow-2xl transition-all select-none
        rounded-xl border-2
        ${isSelected ? "border-4" : "border-2"}
        ${nodeStrokes[node.type]}
        ${isSelected ? "shadow-2xl scale-105" : "hover:scale-105 hover:shadow-xl"}
        ${isConnecting ? "ring-4 ring-offset-2 ring-yellow-400" : ""}
        cursor-pointer relative
      `}
      style={{
        boxShadow: isSelected
          ? `0 0 20px ${nodeGlowColors[node.type]}, 0 0 40px ${nodeGlowColors[node.type]}40`
          : "0 8px 16px rgba(0, 0, 0, 0.1)",
        borderWidth: isSelected ? "4px" : "2px",
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div
          className={`${nodeColors[node.type]} w-12 h-12 rounded-full text-white flex items-center justify-center text-sm font-black shadow-lg border-2 border-white transform -rotate-12`}
        >
          {nodeLabels[node.type]}
        </div>
        <div className="flex gap-1">
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onMouseDown={(e) => {
                e.stopPropagation()
                onStartConnection()
              }}
              onMouseUp={(e) => {
                e.stopPropagation()
                onCompleteConnection()
              }}
              className={`p-2 rounded-lg transition-all font-bold ${
                isConnecting
                  ? "bg-yellow-400 text-black shadow-lg scale-110"
                  : "hover:bg-primary/20 text-primary hover:shadow-lg"
              }`}
              title="Click and drag to connect to another node"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {showTooltip && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50">
                Click & drag to create edge
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-2 hover:bg-destructive/20 rounded-lg transition-colors"
            title="Delete node"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>
      {node.data.header && <p className="text-lg font-black text-foreground truncate mb-1">{node.data.header}</p>}
      <p className="text-sm font-black text-foreground truncate">{node.data.label}</p>
      {node.data.subtitle && <p className="text-xs text-muted-foreground truncate">{node.data.subtitle}</p>}
      <p className="text-xs text-muted-foreground capitalize font-bold">{node.type}</p>
    </div>
  )
}
