"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { apiService } from "@/services/ApiService"

interface GraphData {
  operatorId: string
  name: string
  nodes: any[]
  edges: any[]
}

export default function GraphBuilderPage() {
  const { operatorId, graphId } = useParams()
  const opId = Array.isArray(operatorId) ? operatorId[0] : operatorId
  const gId = Array.isArray(graphId) ? graphId[0] : graphId

  const [graph, setGraph] = useState<GraphData>({
    operatorId: opId!,
    name: gId!,
    nodes: [],
    edges: []
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!operatorId || !graphId) return

    apiService.loadGraph(operatorId as string, graphId as string).then(res => {
      if (!res.error && res.data) {
        setGraph(res.data)
      } else {
        setGraph({
          operatorId: operatorId as string,
          name: "New Graph",
          nodes: [],
          edges: []
        })
      }
    })
  }, [operatorId, graphId])

  const saveGraph = async () => {
    if (!graph || saving) return
    const confirmed = confirm("Save graph?")
    if (!confirmed) return

    setSaving(true)
    const result = await apiService.updateGraph(graphId as string, graph)
    setSaving(false)

    if (!result.error) {
      alert("Graph saved successfully!")
    } else {
      alert("Error saving graph.")
    }
  }

  if (!graph) {
    return (
        <div className="flex h-screen items-center justify-center text-3xl">
          Loading graph...
        </div>
    )
  }

  return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{graph.name || graphId}</h1>
          <div className="flex gap-4">
            <span className="text-sm text-gray-500">ID: {graphId}</span>
            <button
                onClick={saveGraph}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div className="flex-1 bg-gray-100">
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl">
            Graph editing area – React Flow will go here
          </div>
        </div>
      </div>
  )
}
