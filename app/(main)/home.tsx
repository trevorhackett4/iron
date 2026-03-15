// Home screen - Main dashboard
// Shows today's workout, level, XP, and streak

import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import BorderedPanel from "../../components/BorderedPanel";
import IronButton from "../../components/IronButton";
import QuestCard from "../../components/QuestCard";
import StatDisplay from "../../components/StatDisplay";
import XpBar from "../../components/XpBar";
import { Colors, FontSize, Spacing } from "../../constants/theme";
import { auth, db } from "../../services/firebase";
import { User } from "../../types";

export default function HomeScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (!auth.currentUser) return;

      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            id: userDoc.id,
            email: data.email,
            createdAt: data.createdAt.toDate(),
            level: data.level || 1,
            xp: data.xp || 0,
            streak: data.streak || 0,
            experienceLevel: data.experienceLevel || "beginner",
            availableEquipment: data.availableEquipment || [],
            preferredUnits: data.preferredUnits || "lbs",
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const goToCoach = () => {
    router.push("/(main)/coach");
  };

  const startWorkout = () => {
    // TODO: Navigate to workout session screen
    console.log("Start workout pressed");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Calculate XP needed for next level
  const xpToNextLevel = (userData?.level || 1) * 100;

  return (
    <View style={styles.container}>
      {/* Top corner stats */}
      <View style={styles.cornerStats}>
        <StatDisplay
          label="LEVEL"
          value={userData?.level || 1}
          variant="gold"
          style={styles.statLeft}
        />
        <StatDisplay
          label="STREAK"
          value={userData?.streak || 0}
          icon="🔥"
          variant="default"
          style={styles.statRight}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title}>IRON</Text>
        <Text style={styles.subtitle}>Your AI Strength Coach</Text>

        {/* XP Bar */}
        <View style={styles.section}>
          <XpBar
            currentXp={userData?.xp || 0}
            maxXp={xpToNextLevel}
            showLabel={true}
            showNumbers={true}
          />
        </View>

        {/* Today's Workout Card */}
        <View style={styles.section}>
          <QuestCard
            title="TODAY'S WORKOUT"
            subtitle="Chest & Triceps"
            description="Focus on compound movements with progressive overload. We'll hit bench press, incline work, and finish with tricep isolation."
            exerciseCount={6}
            estimatedDuration={45}
            difficulty="medium"
            onPress={startWorkout}
            isActive={true}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <BorderedPanel variant="blue">
            <Text style={styles.panelTitle}>NEED HELP?</Text>
            <Text style={styles.panelText}>
              Chat with your AI coach about your workout, goals, or form tips.
            </Text>
            <IronButton
              title="TALK TO COACH"
              onPress={goToCoach}
              variant="secondary"
              size="medium"
              fullWidth
            />
          </BorderedPanel>
        </View>

        {/* Logout (temporary, we'll move this to settings later) */}
        <View style={styles.section}>
          <IronButton
            title="LOGOUT"
            onPress={handleLogout}
            variant="danger"
            size="small"
            fullWidth
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gb.darkest,
  },
  cornerStats: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    zIndex: 10,
  },
  statLeft: {
    // StatDisplay already has styling
  },
  statRight: {
    // StatDisplay already has styling
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 140, // Space for corner stats
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.gb.gold,
    textAlign: "center",
    marginBottom: Spacing.xs,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.gb.light,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  loadingText: {
    fontSize: FontSize.lg,
    color: Colors.gb.light,
    textAlign: "center",
  },
  panelTitle: {
    fontSize: FontSize.base,
    fontWeight: "bold",
    color: Colors.gb.lightest,
    marginBottom: Spacing.sm,
    letterSpacing: 1,
  },
  panelText: {
    fontSize: FontSize.sm,
    color: Colors.gb.light,
    lineHeight: FontSize.sm * 1.4,
    marginBottom: Spacing.md,
  },
});
