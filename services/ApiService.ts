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
    CREATE_HUMAN: `/human`,
    GET_ALL_HUMANS: `/human`,
    DELETE_ALL_HUMANS: `/human`,
    CREATE_GRAPH: `/graph`,
    LOAD_GRAPH: `/graph`,
    CREATE_TEST: `/tests`,
    GET_TEST_QUESTIONS: `/tests/testall`,
    DELETE_ALL_TESTS: `/tests`,
    SAVE_GRAPH: `/graphs/save`,
  }

  constructor(baseUrl = "http://localhost:8085/mistaa") {
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
    return this.post<T>(`${encodeURIComponent(email)}/${encodeURIComponent(password)}`, null);
  }
  public async register<T>(userData: any) {
    return this.post<T>(this.endpoints.CREATE_HUMAN, userData)
  }

  public async saveGraph<T>(graphData: any) {
    return this.post<T>(this.endpoints.SAVE_GRAPH, graphData)
  }

  public async loadGraph<T>(graphId: string) {
    return this.get<T>(this.endpoints.LOAD_GRAPH, { id: graphId })
  }
}

// Singleton instance
export const apiService = new ApiService(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8085/mistaa")
