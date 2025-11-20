"use client"

import type React from "react"

import { forwardRef, useRef, useState } from "react"
import type { Node, Edge } from "@/types/graph"
import GraphNode from "@/components/graph-node"
import HelpTutorial from "@/components/help-tutorial"

interface CanvasProps {
  nodes: Node[]
  edges: Edge[]
  selectedNodeId: string | null
  connectingFromId: string | null
  onSelectNode: (id: string | null) => void
  onUpdateNodePosition: (id: string, position: { x: number; y: number }) => void
  onStartConnection: (nodeId: string) => void
  onCompleteConnection: (nodeId: string) => void
  onDeleteNode: (id: string) => void
  onDeleteEdge: (id: string) => void
  onUpdateEdgeWeight: (edgeId: string, weight: number) => void
  isDark: boolean
}

const calculateBezierPath = (x1: number, y1: number, x2: number, y2: number): string => {
  const dx = x2 - x1
  const dy = y2 - y1
  const controlX = x1 + dx * 0.5
  const controlY = y1 + dy * 0.25

  return `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`
}

const getNodeTypeColor = (nodeType: string): string => {
  const colors: Record<string, string> = {
    questionnaire: "rgb(96, 165, 250)",
    personality: "rgb(168, 85, 247)",
    dataEntry: "rgb(34, 197, 94)",
    chat: "rgb(249, 115, 22)",
    goal: "rgb(239, 68, 68)",
  }
  return colors[nodeType] || "rgb(59, 130, 246)"
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  (
    {
      nodes,
      edges,
      selectedNodeId,
      connectingFromId,
      onSelectNode,
      onUpdateNodePosition,
      onStartConnection,
      onCompleteConnection,
      onDeleteNode,
      onDeleteEdge,
      onUpdateEdgeWeight,
      isDark,
    },
    ref,
  ) => {
    const draggedNodeRef = useRef<{ id: string; offset: { x: number; y: number } } | null>(null)
    const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null)
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
    const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("[data-node]")) return
      if (e.button === 2) return

      onSelectNode(null)
      setSelectedEdgeId(null)
    }

    const handleNodeMouseDown = (
      nodeId: string,
      e: React.MouseEvent<HTMLDivElement>,
      pos: { x: number; y: number },
    ) => {
      e.stopPropagation()
      if (e.button !== 0) return

      onSelectNode(nodeId)
      setSelectedEdgeId(null)
      draggedNodeRef.current = {
        id: nodeId,
        offset: {
          x: e.clientX - pos.x,
          y: e.clientY - pos.y,
        },
      }
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref || typeof ref === "function") return

      const canvas = ref as React.MutableRefObject<HTMLDivElement>
      if (!canvas.current) return

      const rect = canvas.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (connectingFromId) {
        setMousePos({ x, y })
      }

      if (!draggedNodeRef.current) return

      const nodeX = x - draggedNodeRef.current.offset.x
      const nodeY = y - draggedNodeRef.current.offset.y

      onUpdateNodePosition(draggedNodeRef.current.id, { x: nodeX, y: nodeY })
    }

    const handleMouseUp = () => {
      draggedNodeRef.current = null
      setMousePos(null)
    }

    return (
      <div
        ref={ref}
        className="flex-1 bg-background relative overflow-hidden cursor-move border-l-4 border-yellow-500"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {edges.length === 0 && nodes.length >= 2 && <HelpTutorial isDark={isDark} />}

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from)
            const toNode = nodes.find((n) => n.id === edge.to)

            if (!fromNode || !toNode) return null

            const x1 = fromNode.position.x + 100
            const y1 = fromNode.position.y + 50
            const x2 = toNode.position.x + 100
            const y2 = toNode.position.y + 50

            const bezierPath = calculateBezierPath(x1, y1, x2, y2)
            const midX = (x1 + x2) / 2
            const midY = (y1 + y2) / 2
            const edgeColor = getNodeTypeColor(fromNode.type)
            const isEdgeSelected = selectedEdgeId === edge.id

            return (
              <g key={edge.id}>
                {isEdgeSelected && (
                  <path
                    d={bezierPath}
                    stroke={edgeColor}
                    strokeWidth={8}
                    fill="none"
                    opacity={0.2}
                    className="pointer-events-none"
                  />
                )}
                <path
                  d={bezierPath}
                  stroke={edgeColor}
                  strokeWidth={isEdgeSelected ? 5 : 3.5}
                  fill="none"
                  markerEnd={`url(#arrowhead-${fromNode.type})`}
                  opacity={isEdgeSelected ? 1 : 0.8}
                  strokeDasharray={isEdgeSelected ? "5,3" : undefined}
                  className="pointer-events-auto transition-all"
                  onMouseEnter={() => setHoveredEdgeId(edge.id)}
                  onMouseLeave={() => setHoveredEdgeId(null)}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedEdgeId(isEdgeSelected ? null : edge.id)
                  }}
                  style={{ cursor: "pointer" }}
                />
                <text
                  x={midX}
                  y={midY - 15}
                  textAnchor="middle"
                  className="text-sm font-bold pointer-events-auto select-none transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    const newWeight = prompt("Enter weight:", edge.weight.toString())
                    if (newWeight !== null) {
                      const weight = Number.parseFloat(newWeight)
                      if (!Number.isNaN(weight)) {
                        onUpdateEdgeWeight(edge.id, weight)
                      }
                    }
                  }}
                  style={{
                    cursor: "pointer",
                    fill: isEdgeSelected ? edgeColor : isDark ? "#ffffff" : "#000000",
                    textShadow: isEdgeSelected
                      ? `0 0 8px ${edgeColor}, 0 0 4px rgba(0,0,0,0.5)`
                      : "2px 2px 4px rgba(0,0,0,0.8)",
                    fontSize: isEdgeSelected ? "14px" : "12px",
                    fontWeight: isEdgeSelected ? "bold" : "normal",
                  }}
                >
                  {edge.weight}
                </text>

                {hoveredEdgeId === edge.id && (
                  <circle
                    cx={midX}
                    cy={midY}
                    r={8}
                    fill="rgb(239, 68, 68)"
                    className="pointer-events-auto cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteEdge(edge.id)
                      setSelectedEdgeId(null)
                    }}
                    style={{ filter: "drop-shadow(0 0 4px rgba(239, 68, 68, 0.8))" }}
                  />
                )}
              </g>
            )
          })}

          {connectingFromId &&
            mousePos &&
            (() => {
              const fromNode = nodes.find((n) => n.id === connectingFromId)
              if (!fromNode) return null

              const x1 = fromNode.position.x + 100
              const y1 = fromNode.position.y + 50
              const x2 = mousePos.x
              const y2 = mousePos.y

              const bezierPath = calculateBezierPath(x1, y1, x2, y2)
              const fromColor = getNodeTypeColor(fromNode.type)

              return (
                <path
                  d={bezierPath}
                  stroke={fromColor}
                  strokeWidth={3}
                  fill="none"
                  strokeDasharray="8,4"
                  opacity={0.9}
                  markerEnd={`url(#arrowhead-${fromNode.type})`}
                />
              )
            })()}

          <defs>
            {["questionnaire", "personality", "dataEntry", "chat", "goal"].map((type) => (
              <marker
                key={`arrowhead-${type}`}
                id={`arrowhead-${type}`}
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill={getNodeTypeColor(type)} />
              </marker>
            ))}
          </defs>
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: `${node.position.x}px`,
              top: `${node.position.y}px`,
            }}
            onMouseDown={(e) => handleNodeMouseDown(node.id, e, node.position)}
            data-node
          >
            <GraphNode
              node={node}
              isSelected={selectedNodeId === node.id}
              isConnecting={connectingFromId === node.id}
              onSelect={() => onSelectNode(node.id)}
              onStartConnection={() => onStartConnection(node.id)}
              onCompleteConnection={() => onCompleteConnection(node.id)}
              onDelete={() => onDeleteNode(node.id)}
            />
          </div>
        ))}
      </div>
    )
  },
)

Canvas.displayName = "Canvas"

export default Canvas
