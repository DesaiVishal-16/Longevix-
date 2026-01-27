import { API_CONFIG } from "@/src/config/api.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

class AuthService {
  private readonly TOKEN_KEY = "auth_token";

  async register(data: RegisterData): Promise<AuthResponse> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        throw new Error(errorData.message || "Registration failed");
      }

      const result: AuthResponse = await response.json();
      
      await this.storeToken(result.accessToken);
      return result;
    } catch (error) {
      console.error("authService.register error:", error);
      throw error;
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }

      const result: AuthResponse = await response.json();
      await this.storeToken(result.accessToken);
      return result;
    } catch (error) {
      console.error("authService.login error:", error);
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    const token = await this.getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.PROFILE}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch profile");
    }

    return await response.json();
  }

  async storeToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.TOKEN_KEY, token);
      
    } catch (error) {
      console.error("Error storing token:", error);
      throw new Error("Failed to store authentication token");
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(this.TOKEN_KEY);
      
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.TOKEN_KEY);
      
    } catch (error) {
      console.error("Error removing token:", error);
      throw new Error("Failed to remove authentication token");
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  async logout(): Promise<void> {
    await this.removeToken();
  }

  async setHasSeenWelcome(): Promise<void> {
    try {
      await AsyncStorage.setItem("has_seen_welcome", "true");
    } catch (error) {
      console.error("Error setting welcome flag:", error);
    }
  }

  async getHasSeenWelcome(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem("has_seen_welcome");
      return value === "true";
    } catch (error) {
      console.error("Error getting welcome flag:", error);
      return false;
    }
  }
}

export const authService = new AuthService();
