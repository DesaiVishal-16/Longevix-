import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { useAuth } from "@/src/contexts/auth.context";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const { setHasSeenWelcome } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = async () => {
    await setHasSeenWelcome();
    router.push("/(auth)/onboarding");
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#0EA684", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={styles.content}>
        {/* Logo/Icon Section */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.iconCircle}>
            <View style={styles.iconInner}>
              <Image 
                source={require("@/assets/images/Longevix.png")} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>
          <Text style={styles.appName}>Longevix</Text>
          <Text style={styles.tagline}>Your Smart Nutrition Assistant</Text>
        </Animated.View>

        {/* Features Section */}
        <Animated.View
          style={[
            styles.featuresContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <FeatureItem
            icon="camera-outline"
            title="AI Food Scanner"
            text="Instantly analyze any meal with our advanced AI"
          />
          <FeatureItem
            icon="analytics-outline"
            title="Smart Tracking"
            text="Monitor your nutrition with detailed insights"
          />
          <FeatureItem
            icon="trophy-outline"
            title="Personal Goals"
            text="Achieve your health goals with guided plans"
          />
        </Animated.View>

        {/* CTA Buttons */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#2E7D32" />
          </TouchableOpacity>
        </Animated.View>

        </View>
      </LinearGradient>
    </>
  );
}

const FeatureItem = ({
  icon,
  title,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
}) => (
  <View style={styles.featureItem}>
    <LinearGradient
      colors={["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.featureGradient}
    >
      <View style={styles.featureIconContainer}>
        <LinearGradient
          colors={["#2E7D32", "#1B5E20"]}
          style={styles.featureIconGradient}
        >
          <Ionicons name={icon} size={24} color="#fff" />
        </LinearGradient>
      </View>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureText}>{text}</Text>
      </View>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    gap: 15,
    maxHeight: height,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  iconCircle: {
    width: Math.min(110, width * 0.25),
    height: Math.min(110, width * 0.25),
    borderRadius: Math.min(55, width * 0.125),
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Math.min(24, width * 0.06),
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  iconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  appName: {
    fontSize: Math.min(42, width * 0.08),
    fontWeight: "800",
    color: "#333",
    marginBottom: 8,
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tagline: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  featuresContainer: {
    gap: 20,
  },
  featureItem: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  featureGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Math.min(20, width * 0.05),
    paddingHorizontal: Math.min(20, width * 0.05),
    borderRadius: 20,
  },
  featureIconContainer: {
    marginRight: 16,
  },
  featureIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Math.min(18, width * 0.045),
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  featureText: {
    fontSize: Math.min(14, width * 0.035),
    color: "#666",
    fontWeight: "500",
    lineHeight: Math.min(20, width * 0.05),
  },
  buttonContainer: {
    gap: 14,
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  primaryButtonText: {
    color: "#2E7D32",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

});
