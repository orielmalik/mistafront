"use client"

import type React from "react"

import type { Node } from "@/types/graph"
import { Upload, File } from "lucide-react"
import { useState } from "react"

interface FileUploadNodeEditorProps {
  node: Node
  onUpdate: (data: any) => void
}

export default function FileUploadNodeEditor({ node, onUpdate }: FileUploadNodeEditorProps) {
  const data = node.data
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      onUpdate({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
      })
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Prompt</label>
        <textarea
          value={data.prompt ?? ""}
          onChange={(e) => onUpdate({ prompt: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
          placeholder="e.g., Upload your medical report (PDF or image)"
        />
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800"
        }`}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Drag & drop files here</p>
        <p className="text-xs text-gray-500 dark:text-gray-500">Accepted: PDF, JPG, JPEG</p>
      </div>

      {data.fileName && (
        <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <File className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{data.fileName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {(data.fileSize / 1024).toFixed(2)} KB • Uploaded: {new Date(data.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
