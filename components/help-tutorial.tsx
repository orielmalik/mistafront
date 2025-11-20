"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { X } from "lucide-react"

interface HelpTutorialProps {
  isDark: boolean
}

export default function HelpTutorial({ isDark }: HelpTutorialProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`absolute top-4 left-4 z-40 max-w-sm rounded-lg shadow-lg border ${
            isDark ? "bg-gray-900 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"
          }`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm">How to Add Edges with Weights</h3>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 hover:bg-opacity-20 rounded transition-colors ${
                  isDark ? "hover:bg-white" : "hover:bg-black"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex gap-3">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-white ${isDark ? "bg-blue-600" : "bg-blue-500"}`}
                >
                  1
                </div>
                <div>
                  <p className="font-medium">Click the Link Icon</p>
                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Click the chain icon on a node to start creating an edge
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-white ${isDark ? "bg-blue-600" : "bg-blue-500"}`}
                >
                  2
                </div>
                <div>
                  <p className="font-medium">Drag to Target Node</p>
                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Move your cursor to another node while holding the button
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-white ${isDark ? "bg-blue-600" : "bg-blue-500"}`}
                >
                  3
                </div>
                <div>
                  <p className="font-medium">Release to Connect</p>
                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Release on the target node to create the edge (weight = 1)
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-white ${isDark ? "bg-green-600" : "bg-green-500"}`}
                >
                  4
                </div>
                <div>
                  <p className="font-medium">Edit Weight</p>
                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Click on the number shown on the edge to change its weight
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`mt-3 p-2 rounded text-xs font-medium ${isDark ? "bg-amber-900/30 text-amber-200" : "bg-amber-100 text-amber-900"}`}
            >
              💡 Tip: Create at least 2 nodes first, then connect them!
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
