"use client"

import { useState, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import Toolbar from "@/components/toolbar"
import Canvas from "@/components/canvas"
import Editor from "@/components/editor"
import type { Node, Edge } from "@/types/graph"

function PageHeader() {
  return (
    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border-b border-gray-200 dark:border-slate-700 p-6 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Graph Builder Studio</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Create interactive knowledge graphs with AI-powered interviews and dynamic questionnaires
        </p>
      </div>
    </div>
  )
}

export default function GraphPage() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(false)
  const [isVertexMode, setIsVertexMode] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const addNode = useCallback((type: Node["type"]) => {
    const id = `node-${Date.now()}`
    const newNode: Node = {
      id,
      type,
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        ...(type === "questionnaire" && {
          questions: ["Question 1"],
          answers: [["Answer 1.1", "Answer 1.2"]],
          scorePerAnswer: [[1, 2]],
          scorePerQuestion: [3],
          category: "General",
          createdTimestamp: new Date().toISOString(),
        }),
        ...(type === "personality" && {
          questions: [],
          answers: [],
          aiGenerated: false,
        }),
        ...(type === "dataEntry" && {
          fields: [{ label: "Name", value: "" }],
        }),
        ...(type === "goal" && {
          description: "Goal description",
          targetScore: 100,
        }),
      },
    }
    setNodes((prev) => [...prev, newNode])
    setSelectedNodeId(id)
  }, [])

  const updateNode = useCallback((id: string, data: any) => {
    setNodes((prev) => prev.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...data } } : node)))
  }, [])

  const deleteNode = useCallback((id: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== id))
    setEdges((prev) => prev.filter((edge) => edge.from !== id && edge.to !== id))
    setSelectedNodeId(null)
  }, [])

  const startConnection = useCallback((nodeId: string) => {
    setConnectingFromId(nodeId)
  }, [])

  const completeConnection = useCallback(
    (toId: string) => {
      if (connectingFromId && connectingFromId !== toId) {
        const edgeExists = edges.some((e) => e.from === connectingFromId && e.to === toId)
        if (!edgeExists) {
          setEdges((prev) => [
            ...prev,
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
    },
    [connectingFromId, edges],
  )

  const updateEdgeWeight = useCallback((edgeId: string, weight: number) => {
    setEdges((prev) => prev.map((edge) => (edge.id === edgeId ? { ...edge, weight } : edge)))
  }, [])

  const deleteEdge = useCallback((edgeId: string) => {
    setEdges((prev) => prev.filter((edge) => edge.id !== edgeId))
  }, [])

  const exportGraph = useCallback(() => {
    const data = {
      timestamp: new Date().toISOString(),
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
    a.download = `graph-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [nodes, edges])

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const newDark = !prev
      if (newDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      return newDark
    })
  }, [])

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  return (
    <motion.div
      className="flex flex-col h-screen transition-theme"
      style={{ backgroundColor: isDark ? "#000000" : "#F9FAFB" }}
      initial={{ backgroundColor: "#F9FAFB" }}
      animate={{ backgroundColor: isDark ? "#000000" : "#F9FAFB" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <PageHeader />

      <div className="flex flex-1 pt-40">
        <Toolbar
          onAddNode={addNode}
          onExport={exportGraph}
          onToggleTheme={toggleTheme}
          isDark={isDark}
          isVertexMode={isVertexMode}
          onToggleVertexMode={() => setIsVertexMode(!isVertexMode)}
        />
        <Canvas
          ref={canvasRef}
          nodes={nodes}
          edges={edges}
          selectedNodeId={selectedNodeId}
          connectingFromId={connectingFromId}
          onSelectNode={setSelectedNodeId}
          onUpdateNodePosition={(id, pos) => {
            setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, position: pos } : n)))
          }}
          onStartConnection={startConnection}
          onCompleteConnection={completeConnection}
          onDeleteNode={deleteNode}
          onDeleteEdge={deleteEdge}
          onUpdateEdgeWeight={updateEdgeWeight}
          isDark={isDark}
        />
        <Editor
          node={selectedNode}
          edges={edges.filter((e) => e.from === selectedNodeId || e.to === selectedNodeId)}
          onUpdateNode={updateNode}
          onDeleteNode={deleteNode}
          isDark={isDark}
        />
      </div>
    </motion.div>
  )
}
