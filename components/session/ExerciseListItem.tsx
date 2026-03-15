// ExerciseListItem - A single exercise row in the workout plan list.
// Styled like Pokémon's item list — bordered box with zebra striping.
// Shows completion state (checkmark), active state (gold border + arrow),
// and progress (X/Y sets counter).

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BorderWidth, Colors, FontSize, Spacing } from "../../constants/theme";
import { Exercise } from "../../types";

interface ExerciseListItemProps {
  exercise: Exercise;
  isActive: boolean; // Currently selected for logging
  completedSetCount: number; // How many sets have been logged
  onPress: () => void;
}

export default function ExerciseListItem({
  exercise,
  isActive,
  completedSetCount,
  onPress,
}: ExerciseListItemProps) {
  const isFullyDone = completedSetCount >= exercise.sets;

  // Inner border color encodes state: gold = active, green = done, mid = idle
  const innerBorderColor = isActive
    ? Colors.gb.gold
    : isFullyDone
      ? Colors.gb.green
      : Colors.gb.mid;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isFullyDone} // Completed exercises aren't tappable
    >
      {/* Outer black border */}
      <View style={styles.outer}>
        {/* Inner colored border — encodes state */}
        <View style={[styles.inner, { borderColor: innerBorderColor }]}>
          <View style={styles.content}>
            {/* Left: checkmark (done) or X/Y counter (in progress) */}
            <View style={styles.statusBox}>
              {isFullyDone ? (
                <Text style={styles.checkmark} allowFontScaling={false}>
                  ✓
                </Text>
              ) : (
                <Text style={styles.setCounter} allowFontScaling={false}>
                  {completedSetCount}/{exercise.sets}
                </Text>
              )}
            </View>

            {/* Center: exercise name + target */}
            <View style={styles.info}>
              <Text
                style={[
                  styles.name,
                  isActive && styles.nameActive,
                  isFullyDone && styles.nameDone,
                ]}
                allowFontScaling={false}
              >
                {exercise.name.toUpperCase()}
              </Text>
              <Text style={styles.meta} allowFontScaling={false}>
                {exercise.sets} × {exercise.reps} @ {exercise.weight} lbs
              </Text>
            </View>

            {/* Right: active indicator arrow */}
            {isActive && (
              <Text style={styles.arrow} allowFontScaling={false}>
                ▶
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderWidth: BorderWidth.thick,
    borderColor: Colors.gb.black,
    backgroundColor: Colors.gb.dark,
    marginBottom: Spacing.xs,
    padding: BorderWidth.thin,
    borderRadius: 0,
  },

  inner: {
    borderWidth: BorderWidth.thin,
    borderRadius: 0,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minHeight: 64,
  },

  statusBox: {
    width: 32,
    alignItems: "center",
    marginRight: Spacing.sm,
  },

  checkmark: {
    fontSize: FontSize.lg,
    color: Colors.gb.green,
    fontWeight: "bold",
  },

  setCounter: {
    fontSize: FontSize.xs,
    color: Colors.gb.mid,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  info: {
    flex: 1,
    gap: 4,
  },

  name: {
    fontSize: FontSize.sm,
    fontWeight: "bold",
    color: Colors.gb.lightest,
    letterSpacing: 0.5,
  },

  nameActive: {
    color: Colors.gb.gold,
  },

  nameDone: {
    color: Colors.gb.light,
  },

  meta: {
    fontSize: FontSize.xs,
    color: Colors.gb.mid,
    letterSpacing: 0.5,
  },

  arrow: {
    fontSize: FontSize.sm,
    color: Colors.gb.gold,
    marginLeft: Spacing.sm,
  },
});
