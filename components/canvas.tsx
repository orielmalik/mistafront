// components/canvas.tsx
"use client"

import { forwardRef, useRef, useState } from "react"
import type React from "react"
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
    onUpdateNodeData: (id: string, data: Partial<Node["data"]>) => void
    onStartConnection: (nodeId: string) => void
    onCompleteConnection: (nodeId: string) => void
    onDeleteNode: (id: string) => void
    onDeleteEdge: (id: string) => void
    onUpdateEdgeWeight: (edgeId: string, weight: number) => void
    isDark: boolean
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
    (props: CanvasProps, ref: React.Ref<HTMLDivElement>): React.ReactElement => {
        const {
            nodes,
            edges,
            selectedNodeId,
            connectingFromId,
            onSelectNode,
            onUpdateNodePosition,
            onUpdateNodeData,
            onStartConnection,
            onCompleteConnection,
            onDeleteNode,
            onDeleteEdge,
            onUpdateEdgeWeight,
            isDark,
        } = props

        const draggedNode = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null)
        const [hoveredEdge, setHoveredEdge] = useState<string | null>(null)
        const [tempLine, setTempLine] = useState<{ x: number; y: number } | null>(null)

        const getColor = (type: string): string => {
            const colors: Record<string, string> = {
                questionnaire: "#60a5fa",
                personality: "#a855f7",
                dataEntry: "#22c55e",
                chat: "#f97316",
                goal: "#ef4444",
            }
            return colors[type] ?? "#3b82f6"
        }

        const bezier = (x1: number, y1: number, x2: number, y2: number): string => {
            const cx = x1 + (x2 - x1) * 0.5
            const cy = y1 + (y2 - y1) * 0.25
            return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`
        }

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            const canvasElement = ref && typeof ref !== 'function' ? ref.current : null
            if (!canvasElement) return

            const rect = canvasElement.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            if (connectingFromId) setTempLine({ x, y })

            if (draggedNode.current) {
                const dragged = draggedNode.current
                if (dragged) {
                    onUpdateNodePosition(dragged.id, {
                        x: x - dragged.offsetX,
                        y: y - dragged.offsetY,
                    })
                }
            }

        }

        const handleMouseUp = () => {
            draggedNode.current = null
            setTempLine(null)
        }

        return (
            <div
                ref={ref}
                className="relative flex-1 overflow-hidden bg-background"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={(e) => {
                    if (!(e.target as HTMLElement).closest("[data-node]")) {
                        onSelectNode(null)
                    }
                }}
            >
                {/* SVG – קשתות */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {edges.map((edge) => {
                        const fromNode = nodes.find((n) => n.id === edge.from)
                        const toNode = nodes.find((n) => n.id === edge.to)
                        if (!fromNode || !toNode) return null

                        const x1 = fromNode.position.x
                        const y1 = fromNode.position.y
                        const x2 = toNode.position.x
                        const y2 = toNode.position.y
                        const midX = (x1 + x2) / 2
                        const midY = (y1 + y2) / 2

                        return (
                            <g key={edge.id} pointerEvents="all">
                                {/* עיגול מחיקה */}
                                {hoveredEdge === edge.id && (
                                    <circle
                                        cx={midX}
                                        cy={midY}
                                        r={12}
                                        fill="#ef4444"
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onDeleteEdge(edge.id)
                                        }}
                                    />
                                )}

                                {/* קשת */}
                                <path
                                    d={bezier(x1, y1, x2, y2)}
                                    stroke={getColor(fromNode.type)}
                                    strokeWidth={hoveredEdge === edge.id ? 6 : 4}
                                    fill="none"
                                    markerEnd={`url(#arrow-${fromNode.type})`}
                                    className="cursor-pointer"
                                    onMouseEnter={() => setHoveredEdge(edge.id)}
                                    onMouseLeave={() => setHoveredEdge(null)}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        const input = prompt("משקל חדש:", String(edge.weight))
                                        if (input !== null) {
                                            const num = Number(input)
                                            if (!isNaN(num) && num >= 0) {
                                                onUpdateEdgeWeight(edge.id, num)
                                            }
                                        }
                                    }}
                                />

                                {/* תווית משקל */}
                                <text
                                    x={midX}
                                    y={midY - 10}
                                    textAnchor="middle"
                                    fill={isDark ? "#e2e8f0" : "#1e293b"}
                                    fontSize="14"
                                    fontWeight="bold"
                                    pointerEvents="none"
                                >
                                    {edge.weight}
                                </text>
                            </g>
                        )
                    })}

                    {connectingFromId && tempLine && (
                        (() => {
                            const fromNode = nodes.find((n) => n.id === connectingFromId)
                            if (!fromNode) return null
                            return (
                                <path
                                    d={bezier(fromNode.position.x, fromNode.position.y, tempLine.x, tempLine.y)}
                                    stroke={getColor(fromNode.type)}
                                    strokeWidth={4}
                                    fill="none"
                                    strokeDasharray="10,5"
                                    markerEnd={`url(#arrow-${fromNode.type})`}
                                />
                            )
                        })()
                    )}

                    <defs>
                        {["questionnaire", "personality", "dataEntry", "chat", "goal"].map((type) => (
                            <marker
                                key={type}
                                id={`arrow-${type}`}
                                markerWidth="12"
                                markerHeight="12"
                                refX="10"
                                refY="3"
                                orient="auto"
                            >
                                <polygon points="0,0 12,3 0,6" fill={getColor(type)} />
                            </marker>
                        ))}
                    </defs>
                </svg>
                {nodes.map((node) => (
                    <div
                        key={node.id}
                        className="absolute"
                        style={{
                            left: node.position.x,
                            top: node.position.y,
                            transform: "translate(-50%, -50%)",
                        }}
                        onMouseDown={(e) => {
                            if (e.button !== 0) return
                            e.stopPropagation()
                            onSelectNode(node.id)
                            draggedNode.current = {
                                id: node.id,
                                offsetX: e.clientX - node.position.x,
                                offsetY: e.clientY - node.position.y,
                            }
                        }}
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
                            onUpdateData={(data) => onUpdateNodeData(node.id, data)}
                            isDark={isDark}
                        />
                    </div>
                ))}

                {edges.length === 0 && nodes.length >= 2 && <HelpTutorial isDark={isDark} />}
            </div>
        )
    })

Canvas.displayName = "Canvas"
export default Canvas