"use client"

import { useState, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import Toolbar from "@/components/toolbar"
import Canvas from "@/components/canvas"
import Editor from "@/components/editor"
import type { Node, Edge } from "@/types/graph"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
  </div>
)

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

export default function Home() {
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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-black dark:via-slate-900 dark:to-black overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              Welcome to the Future
            </span>
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            GraphStudio{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Pro</span>
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Real-time insights for operators
          </motion.p>

          <motion.div
            className="grid sm:grid-cols-2 gap-6 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Link href="/auth">
              <motion.button
                className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Link>

            <motion.div
              className="mt-16 p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">MISSION STATEMENT</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We empower organizations with intelligent graph-based systems to visualize complex relationships,
                conduct AI-powered interviews, and make data-driven decisions. Our platform enables seamless
                collaboration between users and operators to build, manage, and optimize knowledge graphs in real-time.
              </p>
            </motion.div>
          </motion.div>

          <motion.p
            className="mt-12 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Create interactive knowledge graphs with AI-powered insights
          </motion.p>
        </motion.div>
      </div>

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
    </div>
  )
}
