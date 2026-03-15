// Login screen - Email/password authentication
// GBC-styled login form with bordered inputs and buttons

import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import BorderedPanel from "../../components/BorderedPanel";
import IronButton from "../../components/IronButton";
import { BorderWidth, Colors, FontSize, Spacing } from "../../constants/theme";
import { auth } from "../../services/firebase";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation will be handled by auth state listener
      console.log("Login successful!");
    } catch (error: any) {
      console.error("Login error:", error);

      // User-friendly error messages
      let errorMessage = "Login failed. Please try again.";
      if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password.";
      }

      Alert.alert("Login Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goToSignup = () => {
    router.push("/(auth)/signup");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <Text style={styles.title}>IRON</Text>
        <Text style={styles.subtitle}>AI Strength Coach</Text>

        {/* Login Form */}
        <BorderedPanel variant="gold" style={styles.formPanel}>
          <Text style={styles.formTitle}>LOGIN</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>EMAIL</Text>
            <View style={styles.inputBorder}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor={Colors.gb.mid}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                allowFontScaling={false}
                editable={!loading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>PASSWORD</Text>
            <View style={styles.inputBorder}>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Colors.gb.mid}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                allowFontScaling={false}
                editable={!loading}
              />
            </View>
          </View>

          {/* Login Button */}
          <IronButton
            title={loading ? "LOGGING IN..." : "LOGIN"}
            onPress={handleLogin}
            variant="primary"
            size="large"
            fullWidth
            disabled={loading}
          />
        </BorderedPanel>

        {/* Signup Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <IronButton
            title="SIGN UP"
            onPress={goToSignup}
            variant="secondary"
            size="medium"
            disabled={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gb.darkest,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: Spacing.lg,
    paddingTop: 60,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.gb.gold,
    textAlign: "center",
    marginBottom: Spacing.sm,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.gb.light,
    textAlign: "center",
    marginBottom: Spacing.xxl,
  },
  formPanel: {
    marginBottom: Spacing.xl,
  },
  formTitle: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    color: Colors.gb.lightest,
    textAlign: "center",
    marginBottom: Spacing.lg,
    letterSpacing: 2,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "bold",
    color: Colors.gb.light,
    marginBottom: Spacing.xs,
    letterSpacing: 1,
  },
  inputBorder: {
    borderWidth: BorderWidth.thick,
    borderColor: Colors.gb.black,
    backgroundColor: Colors.gb.darkest,
    borderRadius: 0,
    padding: BorderWidth.thin,
  },
  input: {
    fontSize: FontSize.base,
    color: Colors.gb.lightest,
    padding: Spacing.sm,
    minHeight: 44,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.gb.mid,
    borderRadius: 0,
  },
  signupContainer: {
    alignItems: "center",
    gap: Spacing.md,
  },
  signupText: {
    fontSize: FontSize.sm,
    color: Colors.gb.light,
  },
});
