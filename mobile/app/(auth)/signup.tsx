import { GuestGuard } from "@/src/components/guards/auth-guard";
import { useAuth } from "@/src/contexts/auth.context";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const responsiveSize = (size: number, factor: number = 1) =>
  Math.min(size, SCREEN_WIDTH * factor);

const responsiveHeight = (size: number, factor: number = 1) =>
  Math.min(size, SCREEN_HEIGHT * factor);

export default function SignUpScreen() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
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

  const isFormValid =
    userName &&
    email &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    acceptedTerms;

  const { register: registerUser } = useAuth();

  const handleSignUp = async () => {
    
    
    if (!isFormValid) {
      Alert.alert(
        "Validation Error",
        "Please fill all required fields and accept terms",
      );
      return;
    }

    setIsLoading(true);
    

    try {
      await registerUser(
        userName,
        email.trim(),
        password
      );
      
      
      router.push("/(auth)/profile-setup");
    } catch (error) {
      console.error("Registration error details:", error);
      Alert.alert(
        "Registration Failed",
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
      
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: "", color: "#ccc" };
    if (password.length < 6)
      return { level: 1, text: "Weak", color: "#FF5252" };
    if (password.length < 8)
      return { level: 2, text: "Medium", color: "#FF9800" };
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    )
      return { level: 3, text: "Strong", color: "#4CAF50" };
    return { level: 2, text: "Medium", color: "#FF9800" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <GuestGuard>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#E8F5E9", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={handleBack}
                style={styles.backButton}
                accessibilityLabel="Go back"
              >
                <FontAwesome6 name="arrow-left" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Animated.View
              style={[
                styles.titleSection,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Text style={styles.createTitle}>Create Account</Text>
              <Text style={styles.createSubtitle}>
                Start your personalized nutrition journey today
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.formSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="person-outline" size={22} color="#2E7D32" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#999"
                  value={userName}
                  onChangeText={setUserName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="mail-outline" size={22} color="#2E7D32" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color="#2E7D32"
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              {password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBars}>
                    {[1, 2, 3].map((level) => (
                      <View
                        key={level}
                        style={[
                          styles.strengthBar,
                          {
                            backgroundColor:
                              passwordStrength.level >= level
                                ? passwordStrength.color
                                : "#E0E0E0",
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text
                    style={[
                      styles.strengthText,
                      { color: passwordStrength.color },
                    ]}
                  >
                    {passwordStrength.text}
                  </Text>
                </View>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={22}
                    color="#2E7D32"
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              {confirmPassword.length > 0 && (
                <View style={styles.matchContainer}>
                  <Ionicons
                    name={
                      password === confirmPassword
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={18}
                    color={password === confirmPassword ? "#4CAF50" : "#FF5252"}
                  />
                  <Text
                    style={[
                      styles.matchText,
                      {
                        color:
                          password === confirmPassword ? "#4CAF50" : "#FF5252",
                      },
                    ]}
                  >
                    {password === confirmPassword
                      ? "Passwords match"
                      : "Passwords don't match"}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.termsContainer}
                onPress={() => setAcceptedTerms(!acceptedTerms)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    acceptedTerms && styles.checkboxChecked,
                  ]}
                >
                  {acceptedTerms && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{" "}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.signupButton,
                  !isFormValid && styles.signupButtonDisabled,
                ]}
                onPress={handleSignUp}
                disabled={!isFormValid || isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    isFormValid
                      ? ["#2E7D32", "#1B5E20"]
                      : ["#A5D6A7", "#A5D6A7"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.signupButtonGradient}
                >
                  {isLoading ? (
                    <Ionicons name="sync" size={24} color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.signupButtonText}>
                        Create Account
                      </Text>
                      <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[
                styles.loginSection,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </GuestGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  header: {
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  titleSection: {
    alignItems: "center",
    marginTop: responsiveHeight(10, 0.01),
    marginBottom: responsiveHeight(25, 0.03),
  },
  createTitle: {
    fontSize: responsiveSize(32, 0.08),
    fontWeight: "800",
    color: "#333",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  createSubtitle: {
    fontSize: responsiveSize(15, 0.038),
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 22,
  },

  formSection: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 14,
    paddingHorizontal: 16,
    height: 58,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  inputIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(46, 125, 50, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  eyeButton: {
    padding: 8,
  },

  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    marginTop: -8,
    paddingHorizontal: 4,
  },
  strengthBars: {
    flexDirection: "row",
    gap: 6,
    marginRight: 10,
  },
  strengthBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "600",
  },

  matchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    marginTop: -8,
    paddingHorizontal: 4,
    gap: 6,
  },
  matchText: {
    fontSize: 12,
    fontWeight: "600",
  },

  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#2E7D32",
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    fontWeight: "500",
  },
  termsLink: {
    color: "#2E7D32",
    fontWeight: "700",
  },

  signupButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  signupButtonDisabled: {
    shadowOpacity: 0.1,
  },
  signupButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  loginSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 16,
  },
  loginText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  loginLink: {
    fontSize: 16,
    color: "#2E7D32",
    fontWeight: "700",
  },
});
