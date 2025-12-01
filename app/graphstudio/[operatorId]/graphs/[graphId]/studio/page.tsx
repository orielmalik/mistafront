"use client"

import { useState, useRef } from "react"
import { useParams } from "next/navigation"
import Canvas from "@/components/canvas"
import Toolbar from "@/components/toolbar"
import Editor from "@/components/editor"
import type { Node, Edge } from "@/types/graph"
import { Save, Download, CheckCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default function StudioPage() {
  const params = useParams<{ operatorId: string; graphId: string }>()

  const operatorId = params?.operatorId ?? "unknown"
  const graphId = params?.graphId ?? "untitled"

  const displayName = graphId
      .replace(/-/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase())

  const canvasRef = useRef<HTMLDivElement | null>(null)

  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null)
  const [isDark] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle")

  const handleDeleteSelectedNode = () => {
    if (!selectedNodeId) return
    setNodes(prev => prev.filter(n => n.id !== selectedNodeId))
    setEdges(prev => prev.filter(e => e.from !== selectedNodeId && e.to !== selectedNodeId))
    setSelectedNodeId(null)
  }

  const addNode = (type: Node["type"]) => {
    if (type === "dataEntry" && nodes.some(n => n.type === "dataEntry")) {
      alert("Only one Data Entry node allowed per graph")
      return
    }
    const id = `node-${Date.now()}`
    const newNode: Node = {
      id,
      type,
      position: { x: 150 + Math.random() * 600, y: 100 + Math.random() * 400 },
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
    }
    setNodes(prev => [...prev, newNode])
    setSelectedNodeId(id)
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaveStatus("saved")
    setTimeout(() => setSaveStatus("idle"), 3000)
    setIsSaving(false)
  }

  const handleExport = () => {
    const data = { timestamp: new Date().toISOString(), operatorId, graphId, name: displayName, nodes, edges }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${displayName}-${graphId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const selectedNode = nodes.find(n => n.id === selectedNodeId)

  return (
      <div className="flex flex-col h-screen bg-gray-100 dark:bg-black">
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{displayName}</h1>
          <div className="flex items-center gap-4">
            <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg font-bold text-white transition-all ${
                    isSaving ? "bg-yellow-600" : saveStatus === "saved" ? "bg-green-600" : "bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg hover:scale-105"
                }`}
            >
              {isSaving ? "Saving..." : saveStatus === "saved" ? <><CheckCircle className="w-5 h-5" /> Saved!</> : <><Save className="w-5 h-5" /> Save Graph</>}
            </button>
            <button
                onClick={handleExport}
                className="flex items-center gap-3 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all hover:scale-105"
            >
              <Download className="w-5 h-5" /> Export
            </button>
          </div>
        </div>

        <div className="flex flex-1">
          <Toolbar onAddNode={addNode} isDark={isDark} />
          <Canvas
              ref={canvasRef}
              nodes={nodes}
              edges={edges}
              selectedNodeId={selectedNodeId}
              connectingFromId={connectingFromId}
              onSelectNode={setSelectedNodeId}
              onUpdateNodePosition={(id, pos) =>
                  setNodes(prev => prev.map(n => n.id === id ? { ...n, position: pos } : n))
              }
              onUpdateNodeData={(id, data) =>                     // ← חדש! חובה!
                  setNodes(prev => prev.map(n =>
                      n.id === id ? { ...n, data: { ...n.data, ...data } } : n
                  ))
              }
              onStartConnection={setConnectingFromId}
              onCompleteConnection={(toId) => {
                if (connectingFromId && connectingFromId !== toId && !edges.some(e => e.from === connectingFromId && e.to === toId)) {
                  setEdges(prev => [...prev, { id: `edge-${Date.now()}`, from: connectingFromId, to: toId, weight: 1 }])
                }
                setConnectingFromId(null)
              }}
              onDeleteNode={handleDeleteSelectedNode}
              onDeleteEdge={(id) => setEdges(prev => prev.filter(e => e.id !== id))}
              onUpdateEdgeWeight={(edgeId, weight) =>
                  setEdges(prev => prev.map(e => e.id === edgeId ? { ...e, weight } : e))
              }
              isDark={isDark}
          />
          <Editor
              node={selectedNode ?? null}
              edges={edges}
              onUpdateNode={(data) => {
                if (!selectedNodeId) return
                setNodes(prev => prev.map(n =>
                    n.id === selectedNodeId
                        ? { ...n, data: { ...n.data, ...data } }
                        : n
                ))
              }}
              onDeleteNode={handleDeleteSelectedNode}
              isDark={isDark}
          />
        </div>
      </div>
  )
}