// session.tsx - Workout Session Screen
// This file is pure orchestration: state management and layout only.
// All visual components live in components/session/.
//
// TODO Phase 2: Replace MOCK_SESSION with a Firestore fetch.
// TODO Phase 2: Replace handleFinish console.log with router.replace("/(main)/home").

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
    ActiveSetPanel,
    CompletedSetsList,
    ExerciseListItem,
    SessionCompletePanel,
} from "../../components/session";
import {
    BorderWidth,
    Colors,
    FontSize,
    Spacing,
    XP_PER_COMPLETED_WORKOUT,
    XP_PER_SET,
} from "../../constants/theme";
import { CompletedSet, Exercise, WorkoutSession } from "../../types";

// ─── Mock Data ────────────────────────────────────────────────────────────────
// Replace with a Firestore fetch in Phase 2.

const MOCK_SESSION: WorkoutSession = {
  id: "session-001",
  userId: "user-001",
  date: new Date(),
  exercises: [
    {
      id: "ex-1",
      name: "Bench Press",
      category: "chest",
      sets: 3,
      reps: 8,
      weight: 185,
      restSeconds: 90,
      notes: "Drive through the chest. Control the descent.",
    },
    {
      id: "ex-2",
      name: "Incline Dumbbell Press",
      category: "chest",
      sets: 3,
      reps: 10,
      weight: 65,
      restSeconds: 60,
    },
    {
      id: "ex-3",
      name: "Cable Fly",
      category: "chest",
      sets: 3,
      reps: 12,
      weight: 40,
      restSeconds: 60,
      notes: "Squeeze at the peak contraction.",
    },
    {
      id: "ex-4",
      name: "Tricep Pushdown",
      category: "arms",
      sets: 3,
      reps: 12,
      weight: 50,
      restSeconds: 60,
    },
  ],
  completedSets: {},
  completed: false,
  totalVolume: 0,
  xpEarned: 0,
};

// ─── SessionScreen ────────────────────────────────────────────────────────────

export default function SessionScreen() {
  const router = useRouter();
  const [session, setSession] = useState<WorkoutSession>(MOCK_SESSION);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [loggedReps, setLoggedReps] = useState(MOCK_SESSION.exercises[0].reps);
  const [loggedWeight, setLoggedWeight] = useState(
    MOCK_SESSION.exercises[0].weight ?? 0,
  );
  const [sessionComplete, setSessionComplete] = useState(false);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);

  const activeExercise = session.exercises[activeExerciseIndex];
  const currentSetNumber =
    (session.completedSets[activeExercise.id] ?? []).length + 1;

  // ── Handlers ──

  const handleRepsChange = (delta: number) => {
    setLoggedReps((prev) => Math.max(1, prev + delta));
  };

  const handleWeightChange = (delta: number) => {
    setLoggedWeight((prev) => Math.max(0, prev + delta));
  };

  // Tapping an exercise row in the list switches the active panel to it,
  // unless it's already fully completed.
  const handleSelectExercise = (index: number) => {
    const ex = session.exercises[index];
    const alreadyDone = (session.completedSets[ex.id] ?? []).length;
    if (alreadyDone < ex.sets) {
      setActiveExerciseIndex(index);
      setLoggedReps(ex.reps);
      setLoggedWeight(ex.weight ?? 0);
    }
  };

  const handleLogSet = () => {
    const exerciseId = activeExercise.id;
    const existing: CompletedSet[] = session.completedSets[exerciseId] ?? [];

    // PR detection: first set for this exercise is always a PR;
    // subsequent sets are a PR only if the weight exceeds the previous best.
    const previousBest = existing.reduce(
      (best, s) => Math.max(best, s.weight),
      0,
    );
    const isPR =
      existing.length === 0 ? loggedWeight > 0 : loggedWeight > previousBest;

    const newSet: CompletedSet = {
      setNumber: existing.length + 1,
      reps: loggedReps,
      weight: loggedWeight,
      timestamp: new Date(),
      isPR,
    };

    const updatedSets = [...existing, newSet];
    const updatedCompletedSets = {
      ...session.completedSets,
      [exerciseId]: updatedSets,
    };

    setSession((prev) => ({ ...prev, completedSets: updatedCompletedSets }));
    setTotalVolume((v) => v + loggedReps * loggedWeight);
    setTotalXpEarned((x) => x + XP_PER_SET);

    // If this exercise is now fully done, advance to the next incomplete one.
    if (updatedSets.length >= activeExercise.sets) {
      const nextIndex = session.exercises.findIndex((ex, i) => {
        if (i <= activeExerciseIndex) return false;
        return (updatedCompletedSets[ex.id] ?? []).length < ex.sets;
      });

      if (nextIndex !== -1) {
        setActiveExerciseIndex(nextIndex);
        setLoggedReps(session.exercises[nextIndex].reps);
        setLoggedWeight(session.exercises[nextIndex].weight ?? 0);
      } else {
        // All exercises done — award completion bonus and show summary.
        setTotalXpEarned((x) => x + XP_PER_COMPLETED_WORKOUT);
        setSessionComplete(true);
      }
    }
  };

  const handleFinish = () => {
    // TODO Phase 2: router.replace("/(main)/home");
    console.log(
      "Session finished — XP:",
      totalXpEarned,
      "Volume:",
      totalVolume,
    );
    router.replace("/(main)/home");
  };

  // ── Render ──

  if (sessionComplete) {
    return (
      <View style={styles.screen}>
        <SessionCompletePanel
          xpEarned={totalXpEarned}
          totalVolume={totalVolume}
          onFinish={handleFinish}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Exercise list ── */}
        <View style={styles.section}>
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelText} allowFontScaling={false}>
              WORKOUT PLAN
            </Text>
          </View>

          {session.exercises.map((exercise: Exercise, index: number) => {
            const done = (session.completedSets[exercise.id] ?? []).length;
            return (
              <ExerciseListItem
                key={exercise.id}
                exercise={exercise}
                isActive={index === activeExerciseIndex}
                completedSetCount={done}
                onPress={() => handleSelectExercise(index)}
              />
            );
          })}
        </View>

        {/* ── Active set panel ── */}
        <ActiveSetPanel
          exercise={activeExercise}
          currentSetNumber={currentSetNumber}
          loggedReps={loggedReps}
          loggedWeight={loggedWeight}
          onRepsChange={handleRepsChange}
          onWeightChange={handleWeightChange}
          onLogSet={handleLogSet}
        />

        {/* ── Unified completed sets log ── */}
        <CompletedSetsList
          exercises={session.exercises}
          completedSets={session.completedSets}
        />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.gb.darkest,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },

  section: {
    gap: Spacing.xs,
  },

  // "WORKOUT PLAN" label box — white box with black border, like Pokémon labels
  sectionLabel: {
    borderWidth: BorderWidth.thickest,
    borderColor: Colors.gb.black,
    backgroundColor: Colors.gb.lightest,
    alignSelf: "flex-start",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: 0,
  },

  sectionLabelText: {
    fontSize: FontSize.sm,
    fontWeight: "bold",
    color: Colors.gb.black,
    letterSpacing: 1,
  },
});
