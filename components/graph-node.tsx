import {useState} from "react";
"use client";

export default function GraphNode({ node, isSelected, isConnecting, onSelect, onStartConnection, onDelete }: Props) {
    const [showTooltip, setShowTooltip] = useState(false)
    const isGoal = node.data.type === "goal"

    return (
        <div
            onClick={onSelect}
            className={`relative w-72 p-6 rounded-2xl border-4 shadow-2xl cursor-pointer select-none transition-all
        ${isSelected ? "scale-105 ring-4 ring-yellow-400" : "hover:scale-105"}
        ${isConnecting && !isGoal ? "animate-pulse ring-8 ring-yellow-400" : ""}
        ${isGoal ? "border-emerald-500" : "border-blue-500"}
      `}
            style={{ backgroundColor: "var(--card)" }}
        >
            <div className="flex justify-between mb-4">
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-black">
                    {isGoal ? "GOAL" : "Q"}
                </div>

                <div className="flex gap-2">
                    {!isGoal && (
                        <button
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            onMouseDown={(e) => {
                                e.stopPropagation()
                                onStartConnection()
                            }}
                            className={`p-3 rounded-xl transition-all ${isConnecting ? "bg-yellow-400 text-black scale-125" : "bg-primary/10 hover:bg-primary/20"}`}
                        >
                            <Link2 className="w-6 h-6" />
                        </button>
                    )}

                    {isGoal && (
                        <div className="p-3 rounded-xl bg-emerald-600/20 border-2 border-emerald-500">
                            <Lock className="w-6 h-6 text-emerald-600" />
                        </div>
                    )}

                    {showTooltip && !isGoal && (
                        <div className="absolute top-16 right-0 bg-black text-white text-xs px-3 py-1 rounded-lg z-50">
                            Drag & Drop
                        </div>
                    )}

                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete() }}
                        className="p-3 rounded-xl hover:bg-red-500/20 text-red-600"
                    >
                        <Trash2 className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <h3 className="text-xl font-bold">{node.data.label || "Untitled"}</h3>
            {isGoal && <p className="text-emerald-600 font-bold">Final Goal</p>}
        </div>
    )
}
