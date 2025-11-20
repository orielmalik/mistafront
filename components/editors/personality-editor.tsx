"use client"

import type { Node } from "@/types/graph"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface PersonalityEditorProps {
  node: Node
  onUpdate: (data: any) => void
}

export default function PersonalityEditor({ node, onUpdate }: PersonalityEditorProps) {
  const data = node.data as any
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateAIQuestions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/generate-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId: node.id, category: data.category || "General" }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate questions")
      }

      const result = await response.json()
      onUpdate({
        questions: result.questions,
        answers: result.answers,
        aiGenerated: true,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-foreground block mb-2">Category</label>
        <input
          type="text"
          value={data.category || ""}
          onChange={(e) => onUpdate({ category: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="e.g., Leadership, Technical Skills, Customer Service"
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-3">Generate interview questions and answers using AI</p>
        <Button onClick={generateAIQuestions} disabled={loading} className="w-full gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Generating..." : "Generate AI Questions"}
        </Button>
        {error && <p className="text-xs text-destructive mt-2">{error}</p>}
      </div>

      {data.questions && data.questions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Generated Questions</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {data.questions.map((q: string, idx: number) => (
              <div key={idx} className="text-xs bg-background p-2 rounded border border-border">
                <p className="font-medium text-foreground">{q}</p>
                <div className="text-muted-foreground mt-1">
                  {data.answers?.[idx]?.map((a: string, aIdx: number) => (
                    <div key={aIdx}>• {a}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.aiGenerated && (
        <div className="text-xs text-muted-foreground bg-background/50 p-2 rounded border border-border">
          Generated with AI
        </div>
      )}
    </div>
  )
}
