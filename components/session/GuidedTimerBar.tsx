// GuidedTimerBar - Persistent top bar shown during guided workout mode.
//
// States:
//   resting  — shows a countdown timer and a draining progress bar (red)
//   ready    — shows "GO!" with a gold flash (rest is over, start your set)
//   idle     — renders nothing

import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { BorderWidth, Colors, FontSize, Spacing } from "../../constants/theme";
import { GuidedState } from "../../hooks/useGuidedMode";

interface GuidedTimerBarProps {
  state: GuidedState;
  secondsRemaining: number;
  totalSeconds: number; // used to calculate progress bar width
}

export default function GuidedTimerBar({
  state,
  secondsRemaining,
  totalSeconds,
}: GuidedTimerBarProps) {
  // Animated value for the "GO!" flash
  const flashAnim = useRef(new Animated.Value(0)).current;

  // Pulse the GO! background when state transitions to "ready"
  useEffect(() => {
    if (state === "ready") {
      flashAnim.setValue(0);
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 0.6,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [state, flashAnim]);

  if (state === "idle") return null;

  const progress =
    totalSeconds > 0
      ? Math.max(0, Math.min(1, secondsRemaining / totalSeconds))
      : 0;

  const goFlashColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.gb.dark, Colors.gb.gold],
  });

  if (state === "ready") {
    return (
      <Animated.View
        style={[
          styles.container,
          styles.readyContainer,
          { backgroundColor: goFlashColor },
        ]}
      >
        <Text style={styles.goText} allowFontScaling={false}>
          GO!
        </Text>
        <Text style={styles.goSub} allowFontScaling={false}>
          START YOUR SET
        </Text>
      </Animated.View>
    );
  }

  // "resting" state
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeLabel =
    mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : `${secs}s`;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.restLabel} allowFontScaling={false}>
          REST
        </Text>
        <Text style={styles.countdown} allowFontScaling={false}>
          {timeLabel}
        </Text>
      </View>

      {/* Progress bar — drains from full to empty */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: BorderWidth.thick,
    borderBottomColor: Colors.gb.black,
    backgroundColor: Colors.gb.dark,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: 0,
  },

  readyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: Spacing.sm,
    gap: Spacing.md,
    borderBottomWidth: BorderWidth.thickest,
    borderBottomColor: Colors.gb.black,
  },

  row: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },

  restLabel: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.mid,
    letterSpacing: 2,
  },

  countdown: {
    fontSize: FontSize.xl,
    fontWeight: "bold",
    color: Colors.gb.red,
    letterSpacing: 2,
  },

  progressTrack: {
    height: 8,
    backgroundColor: Colors.gb.darkest,
    borderTopWidth: BorderWidth.thin,
    borderColor: Colors.gb.black,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: Colors.gb.red,
  },

  goText: {
    fontSize: FontSize.xxl,
    fontWeight: "bold",
    color: Colors.gb.black,
    letterSpacing: 3,
  },

  goSub: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.black,
    letterSpacing: 2,
  },
});
