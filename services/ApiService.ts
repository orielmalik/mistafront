/**
 * API Service Class
 * Centralized REST API client with configurable endpoints and methods
 * Usage: const apiService = new ApiService(baseUrl); await apiService.post('/endpoint', data);
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

  // Centralized endpoints
  private endpoints: Record<string, string> = {
   HUMAN: `/human`,
    GRAPH: "/graph",//CREATE OR LOAD
    LIST_GRAPHS: "/graph/graphs",
    CREATE_TEST: `/tests`,
    GET_TEST_QUESTIONS: `/tests/testall`,
    DELETE_ALL_TESTS: `/tests`,
    SAVE_GRAPH: `/graphs/save`,
  }

  constructor(baseUrl =baseUrl = process.env.NEXT_PUBLIC_API_BASE!) {
    this.baseUrl = baseUrl
  }

  public setEndpoint(key: string, path: string): void {
    this.endpoints[key] = path
  }

  private getUrl(endpoint: string, params?: Record<string, string | number>): string {
    let url = `${this.baseUrl}${endpoint}`
    if (params) {
      const query = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => query.append(key, String(value)))
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

      const response = await fetch(url, { ...fetchOptions, signal: controller.signal })
      clearTimeout(timeoutId)

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      const data = await response.json()
      return { data, error: null, status: response.status }
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error occurred")
      return { data: null, error: err, status: 0 }
    }
  }

  // HTTP methods
  public async get<T>(endpoint: string, params?: Record<string, string | number>, options?: ApiRequestOptions) {
    return this.request<T>(this.getUrl(endpoint, params), "GET", undefined, options)
  }

  public async post<T>(endpoint: string, body?: any, options?: ApiRequestOptions) {
    return this.request<T>(this.getUrl(endpoint), "POST", body, options)
  }

  public async put<T>(endpoint: string, body?: any, options?: ApiRequestOptions) {
    return this.request<T>(this.getUrl(endpoint), "PUT", body, options)
  }

  public async patch<T>(endpoint: string, body?: any, options?: ApiRequestOptions) {
    return this.request<T>(this.getUrl(endpoint), "PATCH", body, options)
  }

  public async delete<T>(endpoint: string, options?: ApiRequestOptions) {
    return this.request<T>(this.getUrl(endpoint), "DELETE", undefined, options)
  }

  // Convenience methods
  public async login<T>(email: string, password: string) {
    return this.get<T>(`${this.endpoints.HUMAN}/${encodeURIComponent(email)}/${encodeURIComponent(password)}`);
  }
  public async register<T>(userData: any) {
    return this.post<T>(this.endpoints.HUMAN, userData)
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

  public async listGraphIds(operatorId: string): Promise<string[]> {
    const response = await fetch(this.getUrl(this.endpoints.GRAPHS, { operatorId }), {
      headers: { Accept: "text/event-stream" },
    })

    if (!response.ok || !response.body) return []

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    const ids: string[] = []

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data:")) {
            const id = line.slice(5).trim()
            if (id) ids.push(id)
          }
        }
      }
    } catch {
      return ids
    }
    return ids
  }
}

// Singleton instance
export const apiService = new ApiService(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8085/mistaa")
