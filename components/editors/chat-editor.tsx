"use client"

import type { Node } from "@/types/graph"

interface ChatEditorProps {
  node: Node
}

export default function ChatEditor({ node }: ChatEditorProps) {
  return (
    <div className="text-center text-muted-foreground py-8">
      <p className="text-sm">Chat with Representative node placeholder</p>
      <p className="text-xs mt-2">Configuration available in chat interface</p>
    </div>
  )
}
