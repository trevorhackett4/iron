// ExerciseListItem - Exercise section header with its planned sets listed below.
// No expand/collapse — all sets are always visible.
// Each set row has a checkbox; tapping it dims the row and shows a green checkmark.

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BorderWidth, Colors, FontSize, Spacing } from "../../constants/theme";
import { Exercise } from "../../types";

interface ExerciseListItemProps {
  exercise: Exercise;
  checkedSets: Set<number>; // Which set numbers (1-indexed) have been checked off
  onToggleSet: (setNumber: number) => void;
}

export default function ExerciseListItem({
  exercise,
  checkedSets,
  onToggleSet,
}: ExerciseListItemProps) {
  const allDone = checkedSets.size >= exercise.sets;

  // Build an array of set numbers [1, 2, 3, ...]
  const setNumbers = Array.from({ length: exercise.sets }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {/* ── Exercise header ── */}
      <View style={[styles.header, allDone && styles.headerDone]}>
        <View style={styles.headerLeft}>
          <Text
            style={[styles.exerciseName, allDone && styles.exerciseNameDone]}
            allowFontScaling={false}
          >
            {exercise.name.toUpperCase()}
          </Text>
          <Text style={styles.exerciseMeta} allowFontScaling={false}>
            {exercise.sets} sets · {exercise.category.toUpperCase()}
          </Text>
        </View>

        {/* Progress counter */}
        <Text
          style={[styles.progress, allDone && styles.progressDone]}
          allowFontScaling={false}
        >
          {allDone ? "✓ DONE" : `${checkedSets.size}/${exercise.sets}`}
        </Text>
      </View>

      {/* ── Set rows ── */}
      <View style={styles.setsContainer}>
        {setNumbers.map((setNumber) => {
          const isDone = checkedSets.has(setNumber);
          return (
            <SetRow
              key={setNumber}
              setNumber={setNumber}
              reps={exercise.reps}
              weight={exercise.weight}
              restSeconds={exercise.restSeconds}
              isDone={isDone}
              onToggle={() => onToggleSet(setNumber)}
              isLast={setNumber === exercise.sets}
            />
          );
        })}

        {/* Coach note — shown below all sets if present */}
        {exercise.notes ? (
          <View style={styles.coachNote}>
            <Text style={styles.coachNoteText} allowFontScaling={false}>
              ▸ {exercise.notes}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

// ─── SetRow ───────────────────────────────────────────────────────────────────

interface SetRowProps {
  setNumber: number;
  reps: number;
  weight?: number;
  restSeconds: number;
  isDone: boolean;
  onToggle: () => void;
  isLast: boolean;
}

function SetRow({
  setNumber,
  reps,
  weight,
  restSeconds,
  isDone,
  onToggle,
  isLast,
}: SetRowProps) {
  const restLabel =
    restSeconds >= 60
      ? `${Math.floor(restSeconds / 60)}m rest`
      : `${restSeconds}s rest`;

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={[
        styles.setRow,
        !isLast && styles.setRowBorder,
        isDone && styles.setRowDone,
      ]}
    >
      {/* Checkbox */}
      <View style={[styles.checkbox, isDone && styles.checkboxDone]}>
        {isDone && (
          <Text style={styles.checkmark} allowFontScaling={false}>
            ✓
          </Text>
        )}
      </View>

      {/* Set label */}
      <Text
        style={[styles.setLabel, isDone && styles.setLabelDone]}
        allowFontScaling={false}
      >
        SET {setNumber}
      </Text>

      {/* Set details */}
      <View style={styles.setDetails}>
        <Text
          style={[styles.setDetail, isDone && styles.setDetailDone]}
          allowFontScaling={false}
        >
          {reps} reps
        </Text>
        {weight !== undefined && weight > 0 && (
          <>
            <Text
              style={[styles.detailDot, isDone && styles.setDetailDone]}
              allowFontScaling={false}
            >
              ·
            </Text>
            <Text
              style={[styles.setDetail, isDone && styles.setDetailDone]}
              allowFontScaling={false}
            >
              {weight} lbs
            </Text>
          </>
        )}
        <Text
          style={[styles.detailDot, isDone && styles.setDetailDone]}
          allowFontScaling={false}
        >
          ·
        </Text>
        <Text
          style={[styles.setDetail, isDone && styles.setDetailDone]}
          allowFontScaling={false}
        >
          {restLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    borderWidth: BorderWidth.thick,
    borderColor: Colors.gb.black,
    borderRadius: 0,
    overflow: "hidden",
    marginBottom: Spacing.sm,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.gb.lightest,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.gb.black,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
  },

  headerDone: {
    backgroundColor: Colors.gb.mid,
  },

  headerLeft: {
    flex: 1,
    gap: 2,
  },

  exerciseName: {
    fontSize: FontSize.sm,
    fontWeight: "bold",
    color: Colors.gb.black,
    letterSpacing: 0.5,
  },

  exerciseNameDone: {
    color: Colors.gb.dark,
  },

  exerciseMeta: {
    fontSize: FontSize.xs,
    color: Colors.gb.mid,
    letterSpacing: 0.5,
  },

  progress: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.mid,
    letterSpacing: 1,
    marginLeft: Spacing.md,
  },

  progressDone: {
    color: Colors.gb.green,
  },

  // ── Sets container ──
  setsContainer: {
    backgroundColor: Colors.gb.dark,
  },

  // ── Set row ──
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
    gap: Spacing.sm,
    backgroundColor: Colors.gb.dark,
  },

  setRowBorder: {
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.gb.black,
  },

  setRowDone: {
    backgroundColor: Colors.gb.darkest,
    opacity: 0.6,
  },

  // ── Checkbox ──
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: BorderWidth.thin,
    borderColor: Colors.gb.mid,
    backgroundColor: Colors.gb.darkest,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
    flexShrink: 0,
  },

  checkboxDone: {
    borderColor: Colors.gb.green,
    backgroundColor: Colors.gb.darkest,
  },

  checkmark: {
    fontSize: FontSize.xs,
    color: Colors.gb.green,
    fontWeight: "bold",
    lineHeight: FontSize.xs + 2,
  },

  // ── Set label ──
  setLabel: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.light,
    letterSpacing: 1,
    width: 40,
    flexShrink: 0,
  },

  setLabelDone: {
    color: Colors.gb.mid,
  },

  // ── Set details ──
  setDetails: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },

  setDetail: {
    fontSize: FontSize.sm,
    color: Colors.gb.lightest,
    letterSpacing: 0.5,
  },

  setDetailDone: {
    color: Colors.gb.mid,
  },

  detailDot: {
    fontSize: FontSize.sm,
    color: Colors.gb.mid,
  },

  // ── Coach note ──
  coachNote: {
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.gb.black,
    backgroundColor: Colors.gb.darkest,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },

  coachNoteText: {
    fontSize: FontSize.xs,
    color: Colors.gb.blue,
    letterSpacing: 0.5,
    lineHeight: FontSize.xs * 1.6,
  },
});
