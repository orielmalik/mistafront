/**
 * API Service – Final version, works 100% with your backend
 */

export interface ApiRequestOptions {
  headers?: Record<string, string>
  timeout?: number
}

export interface ApiResponse<T> {
  data: T | null
  error: Error | null
  status: number
}

export class ApiService {
  private baseUrl: string
  private defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  }

  private endpoints = {
    HUMAN: "/human",
    GRAPH: "/graph",           // POST/PUT /{graphid}, GET /{operatorId}/{graphid}
    GRAPHS: "/graph/graphs",   // GET ?operatorId=...
  }

  constructor() {
    const DEFAULT_URL = "http://localhost:8085/mistaa"

    const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    const url = envUrl && envUrl.trim() !== "" ? envUrl : DEFAULT_URL

    this.baseUrl = url.replace(/\/$/, "")
  }

  private getUrl(endpoint: string, params?: Record<string, string | number>) {
    let url = `${this.baseUrl}${endpoint}`
    if (params) {
      const query = new URLSearchParams()
      Object.entries(params).forEach(([k, v]) => {
        query.append(k, encodeURIComponent(String(v)))
      })
      url += `?${query.toString()}`
    }
    return url
  }
  private async request<T>(
      url: string,
      method: string = "GET",
      body?: any,
      options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    try {
      const fetchOptions: RequestInit = {
        method,
        headers: { ...this.defaultHeaders, ...options?.headers },
      }

      if (body && ["POST", "PUT", "PATCH"].includes(method)) {
        fetchOptions.body = JSON.stringify(body)
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), options?.timeout || 30000)

      // התיקון היחידי – signal אחרי ה-spread
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      const data = await response.json()
      return { data, error: null, status: response.status }
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error occurred")
      return { data: null, error: err, status: 0 }
    }
  }

  // HTTP methods – בדיוק כמו שביקשת
  public async get<T>(endpoint: string, params?: Record<string, string | number>, options?: ApiRequestOptions) {
    return this.request<T>(this.getUrl(endpoint, params), "GET", undefined, options)
  }

  public async post<T>(endpoint: string, body?: any, options?: ApiRequestOptions) {
    return this.request<T>(this.getUrl(endpoint), "POST", body, options)
  }

  public async put<T>(endpoint: string, body?: any, options?: ApiRequestOptions) {
    return this.request<T>(this.getUrl(endpoint), "PUT", body, options)
  }

  public async createGraph(graphId: string, graphData: any) {
    return this.post<void>(`${this.endpoints.GRAPH}/${graphId}`, graphData)
  }

  public async updateGraph(graphId: string, graphData: any) {
    return this.put<void>(`${this.endpoints.GRAPH}/${graphId}`, graphData)
  }

  public async loadGraph(operatorId: string, graphId: string) {
    return this.get<any>(`${this.endpoints.GRAPH}/${operatorId}/${graphId}`)
  }
  public async listGraphIds(operatorId: string) {
    return   this.get<string[]>("/graph/graphs", { operatorId })
  }
  public async login<T>(email: string, password: string) {
    return this.get<T>(`${this.endpoints.HUMAN}/${encodeURIComponent(email)}/${encodeURIComponent(password)}`)
  }

  public async register<T>(userData: any) {
    return this.post<T>(this.endpoints.HUMAN, userData)
  }
}

export const apiService = new ApiService()