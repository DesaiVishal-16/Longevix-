import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, useAuth } from "@/src/contexts/auth.context";
import { MealsProvider } from "@/src/contexts/meals.context";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading, hasSeenWelcome } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated) {
      
      if (!hasSeenWelcome) {
        if (segments[1] !== "welcome" && segments[1] !== "onboarding") {
          router.replace("/(auth)/welcome");
        }
      } 
      
      else {
        if (inAuthGroup && segments[1] !== "login" && segments[1] !== "signup") {
          router.replace("/(auth)/login");
        } else if (!inAuthGroup) {
          router.replace("/(auth)/login");
        }
      }
    } else {
      
      if (inAuthGroup) {
        router.replace("/(tabs)");
      }
    }
  }, [isAuthenticated, isLoading, hasSeenWelcome, segments]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Auth Stack - Welcome, Login, Signup */}
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        {/* Main App Tabs - Home, Scan, Nutrition, Profile */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        {/* Modal screens (Camera, etc.) */}
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            title: "Camera",
            headerShown: true,
          }}
        />
        {/* 404 Not Found */}{" "}
        <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <MealsProvider>
        <RootLayoutNav />
      </MealsProvider>
    </AuthProvider>
  );
}
