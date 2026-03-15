// ActiveSetPanel - The main interaction panel during a workout session.
// Visual reference: Pokémon battle screen — clear, information-dense, easy to tap.
// Shows the current exercise name, set number, +/− controls for reps and weight,
// an optional coach note, and the LOG SET button.
// Completed sets are shown in the separate CompletedSetsList component below.

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BorderWidth, Colors, FontSize, Spacing } from "../../constants/theme";
import { Exercise } from "../../types";
import IronButton from "../IronButton";

interface ActiveSetPanelProps {
  exercise: Exercise;
  currentSetNumber: number; // 1-indexed set we're about to log
  loggedReps: number; // Current value in the reps input
  loggedWeight: number; // Current value in the weight input
  onRepsChange: (delta: number) => void;
  onWeightChange: (delta: number) => void;
  onLogSet: () => void;
}

export default function ActiveSetPanel({
  exercise,
  currentSetNumber,
  loggedReps,
  loggedWeight,
  onRepsChange,
  onWeightChange,
  onLogSet,
}: ActiveSetPanelProps) {
  return (
    <View style={styles.container}>
      {/* Exercise title — "TEAM ROCKET HQ" label box style */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText} allowFontScaling={false}>
          {exercise.name.toUpperCase()}
        </Text>
      </View>

      <View style={styles.body}>
        {/* Set number display */}
        <View style={styles.setNumberRow}>
          <Text style={styles.setNumberLabel} allowFontScaling={false}>
            SET
          </Text>
          <Text style={styles.setNumberValue} allowFontScaling={false}>
            {currentSetNumber}
            <Text style={styles.setNumberOf}> / {exercise.sets}</Text>
          </Text>
        </View>

        {/* Reps + Weight +/− controls */}
        <View style={styles.inputRow}>
          <InputControl
            label="REPS"
            value={loggedReps}
            step={1}
            onDecrement={() => onRepsChange(-1)}
            onIncrement={() => onRepsChange(1)}
          />

          <View style={styles.inputDivider} />

          <InputControl
            label="WEIGHT (LBS)"
            value={loggedWeight}
            step={5}
            onDecrement={() => onWeightChange(-5)}
            onIncrement={() => onWeightChange(5)}
          />
        </View>

        {/* Coach note (blue accent, shown only if the exercise has notes) */}
        {exercise.notes ? (
          <View style={styles.coachNote}>
            <Text style={styles.coachNoteText} allowFontScaling={false}>
              ▸ {exercise.notes}
            </Text>
          </View>
        ) : null}

        {/* LOG SET button */}
        <View style={styles.logButtonContainer}>
          <IronButton
            title={`LOG SET ${currentSetNumber}`}
            onPress={onLogSet}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </View>
    </View>
  );
}

// ─── InputControl ─────────────────────────────────────────────────────────────
// Reusable +/− control used for both reps and weight.
// Kept private to this file since it's only used here.

interface InputControlProps {
  label: string;
  value: number;
  step: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

function InputControl({
  label,
  value,
  onDecrement,
  onIncrement,
}: InputControlProps) {
  return (
    <View style={inputStyles.group}>
      <Text style={inputStyles.label} allowFontScaling={false}>
        {label}
      </Text>
      <View style={inputStyles.control}>
        <TouchableOpacity
          style={inputStyles.button}
          onPress={onDecrement}
          activeOpacity={0.7}
        >
          <Text style={inputStyles.buttonText} allowFontScaling={false}>
            −
          </Text>
        </TouchableOpacity>

        <View style={inputStyles.valueBox}>
          <Text style={inputStyles.value} allowFontScaling={false}>
            {value}
          </Text>
        </View>

        <TouchableOpacity
          style={inputStyles.button}
          onPress={onIncrement}
          activeOpacity={0.7}
        >
          <Text style={inputStyles.buttonText} allowFontScaling={false}>
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    borderWidth: BorderWidth.thickest,
    borderColor: Colors.gb.black,
    backgroundColor: Colors.gb.dark,
    borderRadius: 0,
  },

  titleBar: {
    backgroundColor: Colors.gb.lightest,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.gb.black,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },

  titleText: {
    fontSize: FontSize.base,
    fontWeight: "bold",
    color: Colors.gb.black,
    letterSpacing: 2,
    textAlign: "center",
  },

  body: {
    padding: Spacing.md,
    gap: Spacing.md,
  },

  setNumberRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: Spacing.sm,
  },

  setNumberLabel: {
    fontSize: FontSize.sm,
    fontWeight: "bold",
    color: Colors.gb.mid,
    letterSpacing: 2,
  },

  setNumberValue: {
    fontSize: FontSize.xxl,
    fontWeight: "bold",
    color: Colors.gb.gold,
    letterSpacing: 1,
  },

  setNumberOf: {
    fontSize: FontSize.lg,
    color: Colors.gb.light,
  },

  inputRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },

  inputDivider: {
    width: BorderWidth.thin,
    backgroundColor: Colors.gb.mid,
    alignSelf: "stretch",
    marginVertical: Spacing.sm,
  },

  coachNote: {
    borderWidth: BorderWidth.thin,
    borderColor: Colors.gb.blue,
    backgroundColor: Colors.gb.darkest,
    borderRadius: 0,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },

  coachNoteText: {
    fontSize: FontSize.xs,
    color: Colors.gb.blue,
    letterSpacing: 0.5,
    lineHeight: FontSize.xs * 1.5,
  },

  logButtonContainer: {},
});

const inputStyles = StyleSheet.create({
  group: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.sm,
  },

  label: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.mid,
    letterSpacing: 1,
  },

  control: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  button: {
    width: 40,
    height: 40,
    borderWidth: BorderWidth.thick,
    borderColor: Colors.gb.black,
    backgroundColor: Colors.gb.dark,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
  },

  buttonText: {
    fontSize: FontSize.xl,
    fontWeight: "bold",
    color: Colors.gb.gold,
    lineHeight: FontSize.xl + 4,
  },

  valueBox: {
    minWidth: 56,
    height: 56,
    borderWidth: BorderWidth.thick,
    borderColor: Colors.gb.black,
    backgroundColor: Colors.gb.darkest,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
    paddingHorizontal: Spacing.xs,
  },

  value: {
    fontSize: FontSize.xl,
    fontWeight: "bold",
    color: Colors.gb.lightest,
    letterSpacing: 1,
    textAlign: "center",
  },
});
