"use client"

import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"

interface ToolbarProps {
  onAddNode: (type: "questionnaire" | "personality" | "dataEntry" | "chat" | "goal") => void
  onExport: () => void
}

const nodeColors: Record<"questionnaire" | "personality" | "dataEntry" | "chat" | "goal", string> = {
  questionnaire: "border-blue-400",
  personality: "border-purple-400",
  dataEntry: "border-green-400",
  chat: "border-orange-400",
  goal: "border-red-400",
}

const nodeBackgrounds: Record<"questionnaire" | "personality" | "dataEntry" | "chat" | "goal", string> = {
  questionnaire: "bg-blue-600 hover:bg-blue-700",
  personality: "bg-purple-600 hover:bg-purple-700",
  dataEntry: "bg-green-600 hover:bg-green-700",
  chat: "bg-orange-600 hover:bg-orange-700",
  goal: "bg-red-600 hover:bg-red-700",
}

export default function Toolbar({ onAddNode, onExport }: ToolbarProps) {
  const nodeTypes = [
    { label: "Questionnaire", value: "questionnaire" as const },
    { label: "Personality Interview", value: "personality" as const },
    { label: "Data Entry", value: "dataEntry" as const },
    { label: "Chat with Rep", value: "chat" as const },
    { label: "Goal", value: "goal" as const },
  ]

  return (
    <div className="w-64 bg-card border-r-4 border-yellow-500 flex flex-col p-4 gap-4">
      <div className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-blue-600 p-3 rounded-lg border-2 border-yellow-400">
        <div className="w-10 h-10 rounded-full bg-yellow-400 text-red-600 flex items-center justify-center text-lg font-black shadow-lg">
          GB
        </div>
        <span className="font-black text-foreground text-lg tracking-wider">GRAPH BUILDER</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">🚀 Add Nodes</h3>
        {nodeTypes.map((type) => (
          <Button
            key={type.value}
            onClick={() => onAddNode(type.value)}
            className={`w-full justify-start gap-2 rounded-lg border-2 ${nodeColors[type.value]} ${nodeBackgrounds[type.value]} text-white font-black shadow-lg hover:shadow-xl transition-all`}
          >
            <Plus className="w-4 h-4" />
            {type.label}
          </Button>
        ))}
      </div>

      <div className="border-t-2 border-yellow-500 pt-4 mt-auto">
        <Button
          onClick={onExport}
          className="w-full gap-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black shadow-lg hover:shadow-xl border-2 border-yellow-600"
        >
          <Download className="w-4 h-4" />
          Export Graph
        </Button>
      </div>
    </div>
  )
}
