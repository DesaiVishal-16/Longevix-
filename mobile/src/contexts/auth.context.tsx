import { authService, User } from "@/src/services";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  hasSeenWelcome: boolean;
  setHasSeenWelcome: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenWelcome, setHasSeenWelcomeState] = useState(false);

  const isAuthenticated = !!user;

  const checkAuth = async () => {
    try {
      const [isAuth, seenWelcome] = await Promise.all([
        authService.isAuthenticated(),
        authService.getHasSeenWelcome(),
      ]);

      setHasSeenWelcomeState(seenWelcome);

      if (isAuth) {
        const userData = await authService.getProfile();
        setUser(userData);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      await authService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.login({ email, password });
      const userData = await authService.getProfile();
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    setIsLoading(true);
    try {
      await authService.register({ username, email, password });
      const userData = await authService.getProfile();
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const setHasSeenWelcome = async () => {
    await authService.setHasSeenWelcome();
    setHasSeenWelcomeState(true);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    hasSeenWelcome,
    setHasSeenWelcome,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
