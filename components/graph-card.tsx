"use client"

import { MoreVertical, Copy, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface GraphCardProps {
  id: string
  name: string
  goal: string
  createdAt: string
  updatedAt: string
  operatorId: string
  onDuplicate: () => void
  onDelete: () => void
}

export default function GraphCard({
  id,
  name,
  goal,
  createdAt,
  updatedAt,
  operatorId,
  onDuplicate,
  onDelete,
}: GraphCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-slate-700 overflow-hidden group">
      {/* Thumbnail */}
      <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center text-gray-400 dark:text-gray-500">
        <div className="text-center">
          <div className="text-3xl font-bold opacity-20">📊</div>
          <p className="text-xs mt-2">Graph Preview</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate text-lg mb-1">{name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{goal || "No goal set"}</p>

        <div className="space-y-1 mb-4 text-xs text-gray-500 dark:text-gray-400">
          <p>Created: {formatDate(createdAt)}</p>
          <p>Updated: {formatDate(updatedAt)}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/graphstudio/${operatorId}/graphs/${id}/studio`} className="flex-1">
            <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
              <ExternalLink className="w-4 h-4" />
              Open
            </button>
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="px-3 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-10 min-w-40">
                <button
                  onClick={() => {
                    onDuplicate()
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    onDelete()
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm flex items-center gap-2 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
