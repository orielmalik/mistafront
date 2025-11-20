// Type definitions for GRAPH_CONFIG
export interface GraphConfigEndpoints {
  SAVE_GRAPH: string
  SAVE_TEST: string
  SAVE_dataEntry: string
  LOAD_GRAPH?: string
  DELETE_GRAPH?: string
  LIST_GRAPHS?: string
  [key: string]: string | undefined
}

export interface GraphConfigDefaultParams {
  graphId: string
  userId: string
  timestamp: () => string
}

export interface GraphConfigNodeTypes {
  QUESTIONNAIRE: string
  PERSONALITY: string
  dataEntry: string
  CHAT: string
  GOAL: string
  [key: string]: string
}

const GraphConfigTheme = {
  LIGHT: "light",
  DARK: "dark",
  AUTO: "auto",
}

export interface GraphConfigColors {
  QUESTIONNAIRE: string
  PERSONALITY: string
  dataEntry: string
  CHAT: string
  GOAL: string
  [key: string]: string
}

export interface GraphConfigEdgeConfig {
  DEFAULT_WEIGHT: number
  MIN_WEIGHT: number
  MAX_WEIGHT: number
  STROKE_WIDTH: number
}

export interface GraphConfigCanvasConfig {
  GRID_SIZE: number
  SNAP_TO_GRID: boolean
  SHOW_GRID: boolean
}

export type DataEntryFormula = (profile: Record<string, any>) => number

export interface DataEntryFormulas {
  salary: DataEntryFormula
  riskScore: DataEntryFormula
  [key: string]: DataEntryFormula
}

export interface GraphConfigType {
  API_BASE_URL: string
  ENDPOINTS: GraphConfigEndpoints
  DEFAULT_PARAMS: GraphConfigDefaultParams
  NODE_TYPES: GraphConfigNodeTypes
  THEME: typeof GraphConfigTheme
  COLORS: GraphConfigColors
  EDGE_CONFIG: GraphConfigEdgeConfig
  CANVAS_CONFIG: GraphConfigCanvasConfig
  dataEntryFormulas: DataEntryFormulas
}

export type NodeTypeKey = keyof GraphConfigNodeTypes
export type ThemeMode = (typeof GraphConfigTheme)[keyof typeof GraphConfigTheme]
export type FormulaKey = keyof DataEntryFormulas
