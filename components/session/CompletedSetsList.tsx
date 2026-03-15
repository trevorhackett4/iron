// CompletedSetsList - Unified chronological log of all completed sets
// across all exercises in the session. Shown below the ActiveSetPanel
// on the session screen.

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BorderWidth, Colors, FontSize, Spacing } from "../../constants/theme";
import { CompletedSet, Exercise, WorkoutSession } from "../../types";

interface CompletedSetsListProps {
  exercises: Exercise[];
  completedSets: WorkoutSession["completedSets"];
}

interface FlatSet {
  exerciseName: string;
  set: CompletedSet;
}

export default function CompletedSetsList({
  exercises,
  completedSets,
}: CompletedSetsListProps) {
  // Flatten all completed sets across all exercises into one list,
  // then sort by timestamp so they appear in the order they were logged.
  const flatSets: FlatSet[] = exercises.flatMap((exercise) =>
    (completedSets[exercise.id] ?? []).map((set) => ({
      exerciseName: exercise.name,
      set,
    })),
  );

  flatSets.sort(
    (a, b) => a.set.timestamp.getTime() - b.set.timestamp.getTime(),
  );

  if (flatSets.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Section label */}
      <View style={styles.sectionLabel}>
        <Text style={styles.sectionLabelText} allowFontScaling={false}>
          COMPLETED SETS
        </Text>
      </View>

      {/* Outer border wrapping the whole list */}
      <View style={styles.listOuter}>
        <View style={styles.listInner}>
          {flatSets.map((item, index) => (
            <View
              key={`${item.exerciseName}-${item.set.setNumber}-${index}`}
              style={[
                styles.row,
                // Zebra stripe — alternating dark/darkest background
                index % 2 === 0
                  ? { backgroundColor: Colors.gb.dark }
                  : { backgroundColor: Colors.gb.darkest },
                // No bottom border on last row
                index < flatSets.length - 1 && styles.rowBorder,
              ]}
            >
              {/* Checkmark */}
              <Text style={styles.check} allowFontScaling={false}>
                ✓
              </Text>

              {/* Exercise name + set details */}
              <View style={styles.rowInfo}>
                <Text style={styles.exerciseName} allowFontScaling={false}>
                  {item.exerciseName.toUpperCase()}
                </Text>
                <Text style={styles.setDetail} allowFontScaling={false}>
                  {item.set.reps} reps @ {item.set.weight} lbs
                </Text>
              </View>

              {/* PR badge */}
              {item.set.isPR && (
                <Text style={styles.prBadge} allowFontScaling={false}>
                  PR!
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },

  sectionLabel: {
    borderWidth: BorderWidth.thickest,
    borderColor: Colors.gb.black,
    backgroundColor: Colors.gb.lightest,
    alignSelf: "flex-start",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 0,
  },

  sectionLabelText: {
    fontSize: FontSize.sm,
    fontWeight: "bold",
    color: Colors.gb.black,
    letterSpacing: 1,
  },

  listOuter: {
    borderWidth: BorderWidth.thick,
    borderColor: Colors.gb.black,
    borderRadius: 0,
    padding: BorderWidth.thin,
  },

  listInner: {
    borderWidth: BorderWidth.thin,
    borderColor: Colors.gb.green,
    borderRadius: 0,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minHeight: 56,
    gap: Spacing.sm,
  },

  rowBorder: {
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.gb.mid,
  },

  check: {
    fontSize: FontSize.base,
    color: Colors.gb.green,
    fontWeight: "bold",
    width: 20,
  },

  rowInfo: {
    flex: 1,
    gap: 2,
  },

  exerciseName: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.lightest,
    letterSpacing: 0.5,
  },

  setDetail: {
    fontSize: FontSize.sm,
    color: Colors.gb.light,
  },

  prBadge: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.red,
    letterSpacing: 1,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.gb.red,
    borderRadius: 0,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 1,
  },
});
