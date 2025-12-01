// components/editor.tsx
"use client"

import type { Node } from "@/types/graph"
import { Trash2 } from "lucide-react"

// קבצים שכבר קיימים אצלך ב-./editors
import QuestionnaireEditor from "./editors/questionnaire-editor"
import DataEntryEditor from "./editors/data-entry-editor"
import ChatEditor from "./editors/chat-editor"
import PersonalityEditor from "./editors/personality-editor"

interface EditorProps {
    node: Node | null
    onUpdateNode: (updates: Partial<Node["data"]>) => void
    onDeleteNode: () => void
}

export default function Editor({ node, onUpdateNode, onDeleteNode }: EditorProps) {
    if (!node) {
        return (
            <div className="w-96 border-l border-border bg-card p-10 text-center text-muted-foreground">
                <div className="mx-auto w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <p className="text-lg font-medium">Select a node to configure</p>
                <p className="text-sm mt-2">Click any node on the canvas</p>
            </div>
        )
    }

    const handleUpdate = (updates: Partial<Node["data"]>) => {
        onUpdateNode(updates)
    }

    return (
        <div className="w-96 border-l border-border bg-card flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                    <h2 className="text-2xl font-bold">Configure: {node.type}</h2>
                    <p className="text-sm text-muted-foreground">ID: {node.id}</p>
                </div>
                <button
                    onClick={onDeleteNode}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-600 transition"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {node.type === "questionnaire" && (
                    <QuestionnaireEditor node={node} onUpdate={handleUpdate} />
                )}

                {node.type === "dataEntry" && (
                    <DataEntryEditor node={node} onUpdate={handleUpdate} />
                )}

                {node.type === "chat" && (
                    <ChatEditor node={node} onUpdate={handleUpdate} />
                )}

                {node.type === "personality" && (
                    <PersonalityEditor node={node} onUpdate={handleUpdate} />
                )}

                {![
                    "questionnaire",
                    "dataEntry",
                    "chat",
                    "personality"
                ].includes(node.type) && (
                    <div className="text-center py-16 text-muted-foreground">
                        <p className="text-lg font-medium">{node.type} Editor</p>
                        <p className="text-sm mt-2">Coming soon...</p>
                    </div>
                )}
            </div>
        </div>
    )
}