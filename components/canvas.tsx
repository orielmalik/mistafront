// components/canvas.tsx
"use client"

import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    NodeTypes,
} from "reactflow"
import "reactflow/dist/style.css"
import GraphNode from "./graph-node"

const nodeTypes = { custom: GraphNode } as NodeTypes
const toFlowNodes = (nodes: any[]) =>
    nodes.map(n => ({
        id: n.id,
        type: "custom",
        position: n.position,
        data: {
            label: n.data.label || "untitled",
            type: n.type,
        },
    }))

const toFlowEdges = (edges: any[]) =>
    edges.map(e => ({
        id: e.id,
        source: e.from,
        target: e.to,
        animated: true,
        style: { stroke: "#f59e0b", strokeWidth: 3 },
        markerEnd: { type: "arrowclosed", color: "#f59e0b" },
    }))

interface CanvasProps {
    nodes: any[]
    edges: any[]
    selectedNodeId: string | null
    connectingFromId: string | null
    onSelectNode: (id: string | null) => void
    onUpdateNodePosition: (id: string, position: { x: number; y: number }) => void
    onStartConnection: (id: string) => void
    onCompleteConnection: (toId: string) => void
    onDeleteNode: (id: string) => void
    onDeleteEdge: (id: string) => void
    isDark: boolean
}

export default function Canvas({
                                   nodes: propNodes,
                                   edges: propEdges,
                                   selectedNodeId,
                                   connectingFromId,
                                   onSelectNode,
                                   onUpdateNodePosition,
                                   onStartConnection,
                                   onCompleteConnection,
                                   onDeleteNode,
                                   onDeleteEdge,
                                   isDark,
                               }: CanvasProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(toFlowNodes(propNodes))
    const [edges, setEdges, onEdgesChange] = useEdgesState(toFlowEdges(propEdges) as any[]);    const onConnect = (connection: Connection) => {
        const sourceNode = propNodes.find(n => n.id === connection.source)
        if (sourceNode?.type === "goal") {
            alert("cant connect edge from Goal")
            return
        }

        onCompleteConnection(connection.target!)
    }

    // עדכון מיקום
    const onNodeDragStop = (_: any, node: any) => {
        onUpdateNodePosition(node.id, node.position)
    }

    return (
        <div className="w-full h-full bg-gray-50 dark:bg-gray-900">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDragStop={onNodeDragStop}
                onNodeClick={(_, node) => onSelectNode(node.id)}
                onPaneClick={() => onSelectNode(null)}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background variant="dots" gap={20} />
                <Controls />
                <MiniMap nodeColor={(n) => (n.data.type === "goal" ? "#10b981" : "#3b82f6")} />
            </ReactFlow>
        </div>
    )
}