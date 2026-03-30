// Signup screen - Create new account
// GBC-styled signup form with email/password

import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
import { auth, db } from "../../services/firebase";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Validation
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
      });

      console.log("Signup successful!");
      // Navigation will be handled by auth state listener
    } catch (error: any) {
      console.error("Signup error:", error);

      let errorMessage = "Signup failed. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Use at least 6 characters.";
      }

      Alert.alert("Signup Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.back();
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
        <Text style={styles.subtitle}>Create Account</Text>

        {/* Signup Form */}
        <BorderedPanel variant="gold" style={styles.formPanel}>
          <Text style={styles.formTitle}>SIGN UP</Text>

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
                placeholder="Min 6 characters"
                placeholderTextColor={Colors.gb.mid}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                allowFontScaling={false}
                editable={!loading}
              />
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>CONFIRM PASSWORD</Text>
            <View style={styles.inputBorder}>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter password"
                placeholderTextColor={Colors.gb.mid}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                allowFontScaling={false}
                editable={!loading}
              />
            </View>
          </View>

          {/* Signup Button */}
          <IronButton
            title={loading ? "CREATING..." : "CREATE ACCOUNT"}
            onPress={handleSignup}
            variant="primary"
            size="large"
            fullWidth
            disabled={loading}
          />
        </BorderedPanel>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <IronButton
            title="LOGIN"
            onPress={goToLogin}
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
  loginContainer: {
    alignItems: "center",
    gap: Spacing.md,
  },
  loginText: {
    fontSize: FontSize.sm,
    color: Colors.gb.light,
  },
});
