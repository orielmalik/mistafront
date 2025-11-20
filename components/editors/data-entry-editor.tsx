"use client"

import type { Node } from "@/types/graph"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface DataEntryEditorProps {
  node: Node
  onUpdate: (data: any) => void
}

export default function DataEntryEditor({ node, onUpdate }: DataEntryEditorProps) {
  const data = node.data as any

  const addField = () => {
    const newFields = [...(data.fields || []), { label: "New Field", value: "" }]
    onUpdate({ fields: newFields })
  }

  const updateField = (idx: number, label: string, value: string) => {
    const newFields = [...data.fields]
    newFields[idx] = { label, value }
    onUpdate({ fields: newFields })
  }

  const deleteField = (idx: number) => {
    const newFields = data.fields.filter((_: any, i: number) => i !== idx)
    onUpdate({ fields: newFields })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground">Fields</label>
        <Button size="sm" onClick={addField} className="gap-1">
          <Plus className="w-3 h-3" /> Add Field
        </Button>
      </div>

      <div className="space-y-2">
        {(data.fields || []).map((field: any, idx: number) => (
          <div key={idx} className="flex gap-2 items-start">
            <div className="flex-1 space-y-1">
              <input
                type="text"
                placeholder="Label"
                value={field.label}
                onChange={(e) => updateField(idx, e.target.value, field.value)}
                className="w-full px-2 py-1 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Value"
                value={field.value}
                onChange={(e) => updateField(idx, field.label, e.target.value)}
                className="w-full px-2 py-1 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => deleteField(idx)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
