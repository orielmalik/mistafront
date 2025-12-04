// app/studio/[operatorId]/[graphId]/page.tsx
"use client"
import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useRef, useState } from "react"
import Canvas from "@/components/canvas"
import Toolbar from "@/components/toolbar"
import Editor from "@/components/editor"
import type {Node, Edge, Position} from "@/types/graph"
import { Save, Download, CheckCircle } from "lucide-react"
import {apiService} from "@/services/ApiService";

export const dynamic = "force-dynamic"
export default function StudioPage() {
  const params = useParams<{ operatorId: string; graphId: string }>()
  const operatorId = params?.operatorId ?? "unknown"
  const graphId = params?.graphId ?? "untitled"

  const displayName = graphId
      .replace(/-/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

  const canvasRef = useRef<HTMLDivElement|null>(null)

  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null)
  const [isDark] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  // Delete selected node + all its edges
  const deleteSelectedNode = () => {
    if (!selectedNodeId) return
    setNodes(prev => prev.filter(n => n.id !== selectedNodeId))
    setEdges(prev => prev.filter(e => e.from !== selectedNodeId && e.to !== selectedNodeId))
    setSelectedNodeId(null)
  }

  // Add new node
  const addNode = (type: Node["type"]) => {
    if (type === "dataEntry" && nodes.some(n => n.type === "dataEntry")) {
      alert("Only one Data Entry node is allowed per graph.")
      return
    }

    const id = `node-${Date.now()}`
    const newNode: Node = {
      id,
      type,
      position: {
        x: 200 + Math.random() * 600,
        y: 100 + Math.random() * 400,
      },
      data: {
        label: type === "goal" ? "Goal Node" : `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
      },
    }

    setNodes(prev => [...prev, newNode])
    setSelectedNodeId(id)
  }

  // Save graph (mock – replace with real API later)
  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus("saving")

    try {
      // TODO: Replace with real API call
      await apiService.updateGraph(graphId,gra)
      console.log("Graph saved:", { operatorId, graphId, nodes, edges })

      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (err) {
      setSaveStatus("error")
      console.error("Save failed:", err)
    } finally {
      setIsSaving(false)
    }
  }

  // Export graph as JSON
  const handleExport = () => {
    const exportData = {
      name: displayName,
      graphId,
      operatorId,
      exportedAt: new Date().toISOString(),
      nodes,
      edges,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${displayName.replace(/\s+/g, "_")}_${graphId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const selectedNode = nodes.find(n => n.id === selectedNodeId)

  return (
      <div className="flex flex-col h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">
            {displayName || "Untitled Graph"}
          </h1>

          <div className="flex items-center gap-4">
            <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                    saveStatus === "saving"
                        ? "bg-yellow-600"
                        : saveStatus === "saved"
                            ? "bg-green-600"
                            : saveStatus === "error"
                                ? "bg-red-600"
                                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:scale-105"
                }`}
            >
              {saveStatus === "saving" && "Saving..."}
              {saveStatus === "saved" && (
                  <>
                    <CheckCircle className="w-5 h-5" /> Saved!
                  </>
              )}
              {saveStatus === "error" && "Save Failed"}
              {saveStatus === "idle" && (
                  <>
                    <Save className="w-5 h-5" /> Save Graph
                  </>
              )}
            </button>

            <button
                onClick={handleExport}
                className="flex items-center gap-3 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all hover:scale-105"
            >
              <Download className="w-5 h-5" /> Export JSON
            </button>
          </div>
        </header>

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Toolbar */}
          <Toolbar onAddNode={addNode} isDark={isDark} />

          {/* Canvas – Main Area */}
          <div className="flex-1 relative">
            <Canvas
                key={nodes.length + edges.length}
                ref={canvasRef}
                nodes={nodes}
                edges={edges}
                selectedNodeId={selectedNodeId}
                connectingFromId={connectingFromId}
                onSelectNode={setSelectedNodeId}
                onUpdateNodePosition={(id, position) => {
                  setNodes(prev =>
                      prev.map(node =>
                          node.id === id
                              ? { ...node, position: { x: position.x, y: position.y } }
                              : node
                      )
                  )
                }}
                onUpdateNodeData={(id, data) =>
                    setNodes(prev =>
                        prev.map(n =>
                            n.id === id ? { ...n, data: { ...n.data, ...data } } : n
                        )
                    )
                }
                onStartConnection={setConnectingFromId}
                onCompleteConnection={(toId) => {
                  if (
                      connectingFromId &&
                      toId &&
                      connectingFromId !== toId &&
                      !edges.some(e => e.from === connectingFromId && e.to === toId)
                  ) {
                    const sourceNode = nodes.find(n => n.id === connectingFromId)
                    if (sourceNode?.type !== "goal") {
                      setEdges(prev => [
                        ...prev,
                        {
                          id: `edge-${connectingFromId}-${toId}-${Date.now()}`,
                          from: connectingFromId,
                          to: toId,
                          weight: 1,
                        },
                      ])
                    }
                  }
                  setConnectingFromId(null)
                }}
                onDeleteNode={deleteSelectedNode}
                onDeleteEdge={(id) => setEdges(prev => prev.filter(e => e.id !== id))}
                onUpdateEdgeWeight={(edgeId, weight) =>
                    setEdges(prev =>
                        prev.map(e => (e.id === edgeId ? { ...e, weight } : e))
                    )
                }
                isDark={isDark}
            />
          </div>

          {/* Right Editor Panel */}
          <Editor
              node={selectedNode ?? null}
              edges={edges}
              onUpdateNode={(data) => {
                if (!selectedNodeId) return
                setNodes(prev =>
                    prev.map(n =>
                        n.id === selectedNodeId
                            ? { ...n, data: { ...n.data, ...data } }
                            : n
                    )
                )
              }}
              onDeleteNode={deleteSelectedNode}
              isDark={isDark}
          />
        </div>
      </div>
  )
}