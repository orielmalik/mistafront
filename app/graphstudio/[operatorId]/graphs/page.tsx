"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import SidebarNav from "@/components/sidebar-nav"
import GraphCard from "@/components/graph-card"
import NewGraphModal from "@/components/new-graph-modal"

interface GraphListPageProps {
  params: {
    operatorId: string
  }
}

export default function GraphsPage({ params }: GraphListPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [graphs, setGraphs] = useState([
    {
      id: "g-001",
      name: "Q4 Sales Forecast",
      goal: "Analyze sales trends and forecast Q4 revenue",
      createdAt: "2025-01-15T10:30:00Z",
      updatedAt: "2025-01-20T14:45:00Z",
    },
    {
      id: "g-002",
      name: "Customer Satisfaction",
      goal: "Track customer satisfaction metrics",
      createdAt: "2025-01-10T09:00:00Z",
      updatedAt: "2025-01-18T11:20:00Z",
    },
  ])

  const handleCreateGraph = (data: { name: string; goal: string; tags: string[] }) => {
    const newGraph = {
      id: `g-${Date.now()}`,
      name: data.name,
      goal: data.goal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setGraphs([...graphs, newGraph])
  }

  const handleDuplicateGraph = (graphId: string) => {
    const graph = graphs.find((g) => g.id === graphId)
    if (graph) {
      const newGraph = {
        ...graph,
        id: `g-${Date.now()}`,
        name: `${graph.name} (Copy)`,
        createdAt: new Date().toISOString(),
      }
      setGraphs([...graphs, newGraph])
    }
  }

  const handleDeleteGraph = (graphId: string) => {
    setGraphs(graphs.filter((g) => g.id !== graphId))
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black">
      <SidebarNav operatorId={params.operatorId} />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Graphs</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and organize your graph projects</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              New Graph
            </button>
          </div>

          {graphs.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No graphs created yet</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Create your first graph
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {graphs.map((graph) => (
                <GraphCard
                  key={graph.id}
                  id={graph.id}
                  name={graph.name}
                  goal={graph.goal}
                  createdAt={graph.createdAt}
                  updatedAt={graph.updatedAt}
                  operatorId={params.operatorId}
                  onDuplicate={() => handleDuplicateGraph(graph.id)}
                  onDelete={() => handleDeleteGraph(graph.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <NewGraphModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreateGraph={handleCreateGraph} />
    </div>
  )
}
