// Root layout with auth state management

import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "Logged in" : "Logged out");
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Redirect based on auth state
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // User not logged in, redirect to login
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // User logged in but on auth screen, redirect to main app
      router.replace("/(main)/home");
    }
  }, [user, segments, loading]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#0f0f1e",
          },
        }}
      />
    </>
  );
}
