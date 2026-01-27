
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? process.env.EXPO_PUBLIC_DEV_API_URL || "http://localhost:3000"
    : process.env.EXPO_PUBLIC_API_URL || "https://your-production-api.com",

  ENDPOINTS: {
    AUTH: {
      REGISTER: "/api/auth/register",
      LOGIN: "/api/auth/login",
      PROFILE: "/api/auth/profile",
    },
    AI: {
      CHAT: "/chat",
      GENERATE_NUTRIENT: "/generate-nutrients",
    },
    MEALS: {
      BASE: "/api/meals",
      TODAY: "/api/meals/today",
      CREATE: "/api/meals",
      GET: "/api/meals/:id",
      ADD_FOOD: "/api/meals/add-food",
      REMOVE_FOOD: "/api/meals/:mealId/food/:foodId",
    },
  },
};
