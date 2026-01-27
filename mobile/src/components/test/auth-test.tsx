import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { authService, RegisterData } from "@/src/services";

export default function AuthTestComponent() {
  const [formData, setFormData] = useState({
    fname: "John",
    lname: "Doe",
    email: "test@example.com",
    password: "password123",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const result = await authService.register(formData as RegisterData);
      Alert.alert(
        "Success",
        `User registered with token: ${result.accessToken.substring(0, 20)}...`,
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auth Test</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.fname}
        onChangeText={(text) => setFormData({ ...formData, fname: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={formData.lname}
        onChangeText={(text) => setFormData({ ...formData, lname: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
      />

      <Button
        title={loading ? "Registering..." : "Test Register"}
        onPress={handleRegister}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
