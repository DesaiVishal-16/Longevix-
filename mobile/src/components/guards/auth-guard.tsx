import { useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "@/src/contexts/auth.context";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/(auth)/welcome");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    // You can return a loading spinner here
    return null;
  }

  return isAuthenticated ? <>{children}</> : null;
}

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    // You can return a loading spinner here
    return null;
  }

  return !isAuthenticated ? <>{children}</> : null;
}
