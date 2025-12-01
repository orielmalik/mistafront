export interface Position {
  x: number
  y: number
}

export interface Node {
  id: string
  type:
      | "questionnaire"
      | "personality"
      | "dataEntry"
      | "chat"
      | "goal"
      | "scoring"
      | "fileUpload"

  position: Position

  data: {
    label: string
    header?: string
    subtitle?: string

    // === Questionnaire fields ===
    category?: string
    questions?: string[]
    answers?: string[][] // answer options
    scorePerAnswer?: number[][] // scoring per answer
    scorePerQuestion?: number[] // scoring per question

    // === Scoring node specific ===
    filterGender?: { male: boolean; female: boolean }
    filterPosition?: { user: boolean; operator: boolean }
    ageRange?: { min: number; max: number }
    phonePrefix?: string[]
    fixedScore?: number

    // === File upload specific ===
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
