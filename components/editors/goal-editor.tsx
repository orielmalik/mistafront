// components/editors/goal-editor.tsx
"use client"

import type { Node } from "@/types/graph"
import { Button } from "@/components/ui/button"
import { Target, Trophy } from "lucide-react"

interface GoalEditorProps {
    node: Node
    onUpdate: (updates: Partial<Node["data"]>) => void
}

export default function GoalEditor({ node, onUpdate }: GoalEditorProps) {
    const data = node.data

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
                <div className="p-4 bg-emerald-500/20 rounded-full">
                    <Trophy className="w-10 h-10 text-emerald-600" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold">Goal Node</h3>
                    <p className="text-sm text-muted-foreground">This is the final destination of the flow</p>
                </div>
            </div>

            <div>
                <label className="text-sm font-semibold">Goal Name</label>
                <input
                    type="text"
                    value={data.goalName || ""}
                    onChange={(e) => onUpdate({ goalName: e.target.value })}
                    placeholder="e.g. High-Value Lead, Premium User, Job Candidate"
                    className="mt-2 w-full px-4 py-3 bg-background border border-border rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            <div>
                <label className="text-sm font-semibold">Description (optional)</label>
                <textarea
                    value={data.goalDescription || ""}
                    onChange={(e) => onUpdate({ goalDescription: e.target.value })}
                    rows={4}
                    placeholder="What does achieving this goal mean for your business?"
                    className="mt-2 w-full px-4 py-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>

            <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Goal nodes cannot have outgoing connections. They are terminal nodes.
                </p>
            </div>
        </div>
    )
}