export const GRAPH_CONFIG = {
  API_BASE_URL: "https://api.example.com",
  ENDPOINTS: {
    SAVE_GRAPH: "/graphs/save",
    LOAD_GRAPH: "/graphs/load",
    DELETE_GRAPH: "/graphs/delete",
    LIST_GRAPHS: "/graphs/list",
    FETCH_USER_DATA: "/users/profile",
  },
  DEFAULT_PARAMS: {
    graphId: "graph-001",
    userId: "user-123",
    version: 1,
    timestamp: () => new Date().toISOString(),
  },
  NODE_TYPES: {
    QUESTIONNAIRE: "questionnaire",
    PERSONALITY: "personality",
    dataEntry: "data-entry",
    CHAT: "chat",
    GOAL: "goal",
    CUSTOM: "custom-node",
  },
  THEME: {
    LIGHT: "light",
    DARK: "dark",
    AUTO: "auto",
  },
  COLORS: {
    QUESTIONNAIRE: "#3B82F6",
    PERSONALITY: "#8B5CF6",
    dataEntry: "#10B981",
    CHAT: "#F97316",
    GOAL: "#EF4444",
  },
  EDGE_CONFIG: {
    DEFAULT_WEIGHT: 1,
    MIN_WEIGHT: 0,
    MAX_WEIGHT: 100,
    STROKE_WIDTH: 3.5,
  },
  CANVAS_CONFIG: {
    GRID_SIZE: 20,
    SNAP_TO_GRID: true,
    SHOW_GRID: true,
  },
  dataEntryFormulas: {
    salary: (profile: any) => {
      const base = profile.education === "phd" ? 20000 : 12000
      const ageBonus = profile.age > 30 ? 3000 : 0
      const genderBonus = profile.gender === "female" ? 2000 : 0
      return base + ageBonus + genderBonus
    },
    riskScore: (profile: any) => {
      let score = 50
      if (profile.age < 25) score += 20
      if (profile.education === "highschool") score += 15
      return Math.min(100, score)
    },
  },
} as const
