export interface Position {
  x: number
  y: number
}

export interface Node {
  id: string
  type: "questionnaire" | "personality" | "dataEntry" | "chat" | "goal" | "scoring" | "fileUpload"
  position: Position
  data: {
    label: string
    header?: string
    subtitle?: string
    // Scoring node specific
    filterGender?: { male: boolean; female: boolean }
    filterPosition?: { user: boolean; operator: boolean }
    ageRange?: { min: number; max: number }
    phonePrefix?: string[]
    fixedScore?: number
    // File upload specific
    prompt?: string
    fileUrl?: string
    fileName?: string
    fileSize?: number
    fileType?: string
    uploadedAt?: string
    [key: string]: any
  }
}

export interface Edge {
  id: string
  from: string
  to: string
  weight: number
  isSelected?: boolean
}

export interface Graph {
  id: string
  operatorId: string
  name: string
  goal: string
  tags: string[]
  nodes: Node[]
  edges: Edge[]
  createdAt: string
  updatedAt: string
  thumbnail?: string
}

export interface GraphListItem {
  id: string
  name: string
  goal: string
  createdAt: string
  updatedAt: string
  thumbnail?: string
}

export interface ActivityEntry {
  id: string
  userId: string
  graphId: string
  graphName: string
  action: "created" | "updated" | "deleted"
  timestamp: string
  details?: string
}

export interface DataEntryLog {
  id: string
  userId: string
  nodeId: string
  nodeType: string
  graphId: string
  enteredAt: string
  data: Record<string, any>
}
