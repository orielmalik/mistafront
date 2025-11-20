"use client"

import type { Node, Edge } from "@/types/graph"
import QuestionnaireEditor from "@/components/editors/questionnaire-editor"
import DataEntryEditor from "@/components/editors/data-entry-editor"
import PersonalityEditor from "@/components/editors/personality-editor"
import ChatEditor from "@/components/editors/chat-editor"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface EditorProps {
  node: Node | undefined
  edges: Edge[]
  onUpdateNode: (id: string, data: any) => void
  onDeleteNode: (id: string) => void
}

export default function Editor({ node, edges, onUpdateNode, onDeleteNode }: EditorProps) {
  if (!node) {
    return (
      <div className="w-80 bg-card border-l border-border p-6 flex items-center justify-center text-center text-muted-foreground">
        <p>Select a node to edit its properties</p>
      </div>
    )
  }

  return (
    <div className="w-80 bg-card border-l border-border p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">{node.data.label}</h2>
          <p className="text-xs text-muted-foreground capitalize">{node.type}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDeleteNode(node.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">Header</label>
          <input
            type="text"
            value={node.data.header || ""}
            onChange={(e) => onUpdateNode(node.id, { ...node.data, header: e.target.value })}
            placeholder="Enter header text"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">Label</label>
          <input
            type="text"
            value={node.data.label || ""}
            onChange={(e) => onUpdateNode(node.id, { ...node.data, label: e.target.value })}
            placeholder="Enter label text"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">Subtitle</label>
          <input
            type="text"
            value={node.data.subtitle || ""}
            onChange={(e) => onUpdateNode(node.id, { ...node.data, subtitle: e.target.value })}
            placeholder="Enter subtitle text"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-4">
        {node.type === "questionnaire" && (
          <QuestionnaireEditor node={node} onUpdate={(data) => onUpdateNode(node.id, data)} />
        )}
        {node.type === "personality" && (
          <PersonalityEditor node={node} onUpdate={(data) => onUpdateNode(node.id, data)} />
        )}
        {node.type === "dataEntry" && <DataEntryEditor node={node} onUpdate={(data) => onUpdateNode(node.id, data)} />}
        {node.type === "chat" && <ChatEditor node={node} />}

        {edges.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">Connected Edges</h3>
            <div className="space-y-2">
              {edges.map((edge) => (
                <div key={edge.id} className="text-xs bg-background p-2 rounded border border-border">
                  <div className="font-medium text-foreground">Weight: {edge.weight}</div>
                  <div className="text-muted-foreground">
                    {edge.from === node.id ? "→" : "←"} {edge.from === node.id ? "to" : "from"} node
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
