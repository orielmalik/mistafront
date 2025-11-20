"use client"

import { useState } from "react"
import Canvas from "@/components/canvas"
import Toolbar from "@/components/toolbar"
import Editor from "@/components/editor"
import type { Node, Edge } from "@/types/graph"
import { Save, Download } from "lucide-react"

interface StudioPageProps {
  params: {
    operatorId: string
    graphId: string
  }
}

export default function StudioPage({ params }: StudioPageProps) {
  const [graphName, setGraphName] = useState("Untitled Graph")
  const [isEditingName, setIsEditingName] = useState(false)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(false)

  const addNode = (type: Node["type"]) => {
    // Check if trying to add dataEntry when one already exists
    if (type === "dataEntry" && nodes.some((n) => n.type === "dataEntry")) {
      alert("Only one Data Entry node allowed per graph")
      return
    }

    const id = `node-${Date.now()}`
    const newNode: Node = {
      id,
      type,
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
    }
    setNodes([...nodes, newNode])
    setSelectedNodeId(id)
  }

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      graphId: params.graphId,
      graphName,
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map((edge) => ({
        sourceNodeId: edge.from,
        targetNodeId: edge.to,
        weight: edge.weight,
      })),
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${graphName}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  return (
    <div className="flex flex-col h-screen bg-background dark:bg-black">
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isEditingName ? (
            <input
              autoFocus
              value={graphName}
              onChange={(e) => setGraphName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
              className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <h1
              onClick={() => setIsEditingName(true)}
              className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {graphName}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        <Toolbar onAddNode={addNode} onExport={handleExport} isDark={isDark} />
        <Canvas
          nodes={nodes}
          edges={edges}
          selectedNodeId={selectedNodeId}
          connectingFromId={connectingFromId}
          onSelectNode={setSelectedNodeId}
          onUpdateNodePosition={(id, pos) => {
            setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, position: pos } : n)))
          }}
          onStartConnection={setConnectingFromId}
          onCompleteConnection={(toId) => {
            if (connectingFromId && connectingFromId !== toId) {
              const edgeExists = edges.some((e) => e.from === connectingFromId && e.to === toId)
              if (!edgeExists) {
                setEdges([
                  ...edges,
                  {
                    id: `edge-${Date.now()}`,
                    from: connectingFromId,
                    to: toId,
                    weight: 1,
                  },
                ])
              }
            }
            setConnectingFromId(null)
          }}
          onDeleteNode={(id) => {
            setNodes((prev) => prev.filter((n) => n.id !== id))
            setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id))
            setSelectedNodeId(null)
          }}
          onDeleteEdge={(id) => {
            setEdges((prev) => prev.filter((e) => e.id !== id))
          }}
          onUpdateEdgeWeight={(id, weight) => {
            setEdges((prev) => prev.map((e) => (e.id === id ? { ...e, weight } : e)))
          }}
          isDark={isDark}
        />
        <Editor
          node={selectedNode}
          edges={edges.filter((e) => e.from === selectedNodeId || e.to === selectedNodeId)}
          onUpdateNode={(data) => {
            setNodes((prev) => prev.map((n) => (n.id === selectedNodeId ? { ...n, data: { ...n.data, ...data } } : n)))
          }}
          onDeleteNode={(id) => {
            setNodes((prev) => prev.filter((n) => n.id !== id))
            setSelectedNodeId(null)
          }}
          isDark={isDark}
        />
      </div>
    </div>
  )
}
