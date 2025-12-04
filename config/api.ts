export const API_BASE =process.env.NEXT_PUBLIC_API_BASE;

export const API_ENDPOINTS = {
  CREATE_GRAPH: `${API_BASE}/graph`,

  CREATE_HUMAN: `${API_BASE}/human`,
  GET_ALL_HUMANS: `${API_BASE}/human`,
  GET_HUMAN_BY_EMAIL_PASS: (email: string, password: string) =>
      `${API_BASE}/human/${email}/${password}`,
  UPDATE_HUMAN: (email: string, password: string) =>
      `${API_BASE}/human/${email}/${password}`,
  DELETE_ALL_HUMANS: `${API_BASE}/human`,

  CREATE_TEST: `${API_BASE}/tests`,
  GET_TEST_QUESTIONS: `${API_BASE}/tests/testall`,
  DELETE_ALL_TESTS: `${API_BASE}/tests`,
} as const;

export const buildApiUrl = (
    endpoint: string,
    params?: Record<string, string | number>
) => {
  const url = new URL(endpoint);
  if (params) {
    Object.entries(params).forEach(([key, value]) =>
        url.searchParams.append(key, String(value))
    );
  }
  return url.toString();
};

export const apiCall = async <T = any>(
    endpoint: string,
    options?: RequestInit
): Promise<{ data: T; error: null } | { data: null; error: Error }> => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
};
