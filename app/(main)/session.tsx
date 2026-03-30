// session.tsx - Workout Session Screen
//
// Checklist-style workout logging with optional Guided Mode.
// Guided Mode: checking a set starts a rest timer; timer end fires haptics +
// audio "GO!" signal; celebratory feedback plays on exercise/workout complete.
//
// TODO Phase 2: Replace MOCK_SESSION with a Firestore fetch.
// TODO Phase 2: Persist completed session to Firestore on finish.

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    ExerciseListItem,
    GuidedTimerBar,
    SessionCompletePanel,
} from "../../components/session";
import { SetOverride } from "../../components/session/ExerciseListItem";
import {
    BorderWidth,
    Colors,
    FontSize,
    Spacing,
    XP_PER_COMPLETED_WORKOUT,
    XP_PER_SET,
} from "../../constants/theme";
import { useGuidedMode } from "../../hooks/useGuidedMode";
import { Exercise, WorkoutSession } from "../../types";

// ─── Mock Data ────────────────────────────────────────────────────────────────

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

// ─── Types ────────────────────────────────────────────────────────────────────

type CheckedSetsMap = Record<string, Set<number>>;
type SetOverridesMap = Record<string, Record<number, SetOverride>>;

// ─── SessionScreen ────────────────────────────────────────────────────────────

export default function SessionScreen() {
  const router = useRouter();
  const [session] = useState<WorkoutSession>(MOCK_SESSION);

  const [checkedSets, setCheckedSets] = useState<CheckedSetsMap>(() =>
    Object.fromEntries(
      session.exercises.map((ex) => [ex.id, new Set<number>()]),
    ),
  );

  const [setOverrides, setSetOverrides] = useState<SetOverridesMap>(() =>
    Object.fromEntries(session.exercises.map((ex) => [ex.id, {}])),
  );

  const [sessionComplete, setSessionComplete] = useState(false);

  // Guided mode — all timer/feedback logic lives in the hook
  const {
    guidedEnabled,
    guidedState,
    restSecondsRemaining,
    toggleGuided,
    onSetChecked,
    onExerciseCompleted,
    onWorkoutCompleted,
  } = useGuidedMode();

  // Track the rest duration at the moment a set is checked, so the timer bar
  // knows the "total" to calculate its draining progress width.
  const [lastRestSeconds, setLastRestSeconds] = useState(0);

  // ── Derived values ──

  const totalSets = session.exercises.reduce((sum, ex) => sum + ex.sets, 0);

  const totalChecked = Object.values(checkedSets).reduce(
    (sum, s) => sum + s.size,
    0,
  );

  const totalXpEarned =
    totalChecked * XP_PER_SET +
    (sessionComplete ? XP_PER_COMPLETED_WORKOUT : 0);

  const totalVolume = session.exercises.reduce((sum, ex) => {
    const overrides = setOverrides[ex.id] ?? {};
    const checked = checkedSets[ex.id] ?? new Set<number>();
    let exVolume = 0;
    checked.forEach((setNumber) => {
      const reps = overrides[setNumber]?.reps ?? ex.reps;
      const weight = overrides[setNumber]?.weight ?? ex.weight ?? 0;
      exVolume += reps * weight;
    });
    return sum + exVolume;
  }, 0);

  // ── Handlers ──

  const handleToggleSet = (exerciseId: string, setNumber: number) => {
    const exercise = session.exercises.find((ex) => ex.id === exerciseId)!;
    const overrides = setOverrides[exerciseId] ?? {};

    setCheckedSets((prev) => {
      const updated = new Set(prev[exerciseId]);
      const wasChecked = updated.has(setNumber);

      if (wasChecked) {
        updated.delete(setNumber);
      } else {
        updated.add(setNumber);

        // Guided mode feedback on check
        if (guidedEnabled) {
          const restSeconds =
            overrides[setNumber]?.restSeconds ?? exercise.restSeconds;
          const isLastSetOfExercise = updated.size >= exercise.sets;
          const next = { ...prev, [exerciseId]: updated };
          const isLastSetOfWorkout = session.exercises.every(
            (ex) => (next[ex.id]?.size ?? 0) >= ex.sets,
          );

          if (isLastSetOfWorkout) {
            // Workout done — big celebration, no rest timer needed
            onWorkoutCompleted();
          } else if (isLastSetOfExercise) {
            // Exercise done — celebration + start rest for next exercise
            onExerciseCompleted();
            setLastRestSeconds(restSeconds);
            onSetChecked(restSeconds);
          } else {
            // Mid-exercise — start rest timer
            setLastRestSeconds(restSeconds);
            onSetChecked(restSeconds);
          }
        }
      }

      const next = { ...prev, [exerciseId]: updated };

      // Check if entire workout is done
      const allDone = session.exercises.every(
        (ex) => (next[ex.id]?.size ?? 0) >= ex.sets,
      );
      if (allDone) {
        setTimeout(() => setSessionComplete(true), 300);
      }

      return next;
    });
  };

  const handleEditSet = (
    exerciseId: string,
    setNumber: number,
    field: keyof SetOverride,
    value: number,
  ) => {
    setSetOverrides((prev) => {
      const exOverrides = { ...prev[exerciseId] };
      exOverrides[setNumber] = {
        ...(exOverrides[setNumber] ?? {}),
        [field]: value,
      };
      return { ...prev, [exerciseId]: exOverrides };
    });
  };

  const handleEditAllSets = (exerciseId: string, overrides: SetOverride) => {
    const exercise = session.exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    setSetOverrides((prev) => {
      const exOverrides = { ...prev[exerciseId] };
      for (let i = 1; i <= exercise.sets; i++) {
        exOverrides[i] = { ...(exOverrides[i] ?? {}), ...overrides };
      }
      return { ...prev, [exerciseId]: exOverrides };
    });
  };

  const handleFinish = () => {
    router.replace("/(main)/home");
  };

  // ── Render: session complete ──

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

  // ── Render: active session ──

  return (
    <View style={styles.screen}>
      {/* Guided mode timer bar — sits just below the status bar, always visible */}
      <GuidedTimerBar
        state={guidedState}
        secondsRemaining={restSecondsRemaining}
        totalSeconds={lastRestSeconds}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ── */}
        <View style={styles.headerLabel}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerLabelText} allowFontScaling={false}>
              WORKOUT PLAN
            </Text>
            <Text style={styles.headerProgress} allowFontScaling={false}>
              {totalChecked}/{totalSets} SETS
            </Text>
          </View>

          {/* Guided mode toggle */}
          <TouchableOpacity
            style={[
              styles.guidedButton,
              guidedEnabled && styles.guidedButtonActive,
            ]}
            onPress={toggleGuided}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.guidedButtonText,
                guidedEnabled && styles.guidedButtonTextActive,
              ]}
              allowFontScaling={false}
            >
              {guidedEnabled ? "● GUIDED" : "○ GUIDED"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Exercise list ── */}
        {session.exercises.map((exercise: Exercise) => (
          <ExerciseListItem
            key={exercise.id}
            exercise={exercise}
            checkedSets={checkedSets[exercise.id] ?? new Set()}
            setOverrides={setOverrides[exercise.id] ?? {}}
            onToggleSet={(setNumber) => handleToggleSet(exercise.id, setNumber)}
            onEditSet={(setNumber, field, value) =>
              handleEditSet(exercise.id, setNumber, field, value)
            }
            onEditAllSets={(overrides) =>
              handleEditAllSets(exercise.id, overrides)
            }
          />
        ))}
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
    gap: Spacing.xs,
    paddingBottom: Spacing.xxl,
  },

  headerLabel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: BorderWidth.thickest,
    borderColor: Colors.gb.black,
    backgroundColor: Colors.gb.lightest,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: 0,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },

  headerLabelText: {
    fontSize: FontSize.sm,
    fontWeight: "bold",
    color: Colors.gb.black,
    letterSpacing: 1,
  },

  headerProgress: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.mid,
    letterSpacing: 1,
  },

  // Guided mode toggle button
  guidedButton: {
    borderWidth: BorderWidth.thin,
    borderColor: Colors.gb.black,
    backgroundColor: Colors.gb.dark,
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    marginLeft: Spacing.sm,
  },

  guidedButtonActive: {
    backgroundColor: Colors.gb.darkest,
    borderColor: Colors.gb.green,
  },

  guidedButtonText: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.mid,
    letterSpacing: 1,
  },

  guidedButtonTextActive: {
    color: Colors.gb.green,
  },
});
