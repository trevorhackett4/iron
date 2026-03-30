// useGuidedMode - Guided workout mode state machine.
//
// States:
//   idle     — guided mode is off, or between sets with no timer running
//   resting  — rest timer counting down after a set was checked off
//   ready    — timer hit zero, "GO!" signal fired, waiting for user to start
//
// Feedback (per moment):
//   Set checked off       → short buzz + low beep  (start rest timer)
//   Rest timer ends       → double buzz + high beep ("GO!" signal)
//   Exercise completed    → triple buzz pattern + mid beep
//   Workout completed     → long buzz pattern + ascending 3-note jingle

import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

export type GuidedState = "idle" | "resting" | "ready";

interface UseGuidedModeReturn {
  guidedEnabled: boolean;
  guidedState: GuidedState;
  restSecondsRemaining: number;
  toggleGuided: () => void;
  onSetChecked: (restSeconds: number) => void;
  onExerciseCompleted: () => void;
  onWorkoutCompleted: () => void;
}

// ─── Audio helpers ────────────────────────────────────────────────────────────
// Tiny Web Audio synth — square wave for that authentic 8-bit beep.
// Gracefully no-ops on platforms where AudioContext isn't available.

function getAudioContext(): AudioContext | null {
  if (Platform.OS !== "web") return null;
  if (typeof window === "undefined") return null;
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    return Ctx ? new Ctx() : null;
  } catch {
    return null;
  }
}

function playTone(
  frequency: number,
  durationMs: number,
  delayMs: number = 0,
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const startTime = ctx.currentTime + delayMs / 1000;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square"; // 8-bit square wave
  osc.frequency.setValueAtTime(frequency, startTime);

  // Quick attack, short sustain, immediate cut — GBC beep style
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.18, startTime + 0.01);
  gain.gain.setValueAtTime(0.18, startTime + durationMs / 1000 - 0.01);
  gain.gain.linearRampToValueAtTime(0, startTime + durationMs / 1000);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + durationMs / 1000 + 0.05);
}

// ─── Haptic helpers ───────────────────────────────────────────────────────────

async function buzz(
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium,
) {
  try {
    await Haptics.impactAsync(style);
  } catch {
    // Haptics not available on all platforms
  }
}

async function notification(
  type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType
    .Success,
) {
  try {
    await Haptics.notificationAsync(type);
  } catch {}
}

// ─── Feedback patterns ────────────────────────────────────────────────────────

// Set checked off — small acknowledgement
async function feedbackSetChecked() {
  buzz(Haptics.ImpactFeedbackStyle.Light);
  playTone(330, 80); // short low beep
}

// Rest timer ended — "GO!" signal
async function feedbackRestComplete() {
  buzz(Haptics.ImpactFeedbackStyle.Heavy);
  setTimeout(() => buzz(Haptics.ImpactFeedbackStyle.Heavy), 120);
  playTone(660, 100); // high beep
  playTone(660, 100, 130); // repeat
}

// Exercise fully completed — stronger celebration
async function feedbackExerciseComplete() {
  notification(Haptics.NotificationFeedbackType.Success);
  setTimeout(() => buzz(Haptics.ImpactFeedbackStyle.Heavy), 80);
  setTimeout(() => buzz(Haptics.ImpactFeedbackStyle.Medium), 200);
  // Ascending two-note phrase
  playTone(440, 100);
  playTone(550, 150, 120);
}

// Entire workout done — big celebration
async function feedbackWorkoutComplete() {
  // Rhythmic buzz pattern: short-short-long
  buzz(Haptics.ImpactFeedbackStyle.Heavy);
  setTimeout(() => buzz(Haptics.ImpactFeedbackStyle.Heavy), 150);
  setTimeout(() => buzz(Haptics.ImpactFeedbackStyle.Heavy), 300);
  setTimeout(() => notification(Haptics.NotificationFeedbackType.Success), 500);
  // Ascending 3-note jingle (like a Pokémon victory fanfare)
  playTone(440, 100); // A4
  playTone(550, 100, 130); // C#5
  playTone(660, 200, 270); // E5
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGuidedMode(): UseGuidedModeReturn {
  const [guidedEnabled, setGuidedEnabled] = useState(false);
  const [guidedState, setGuidedState] = useState<GuidedState>("idle");
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remainingRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Clean up on unmount
  useEffect(() => () => clearTimer(), [clearTimer]);

  const toggleGuided = useCallback(() => {
    setGuidedEnabled((prev) => {
      if (prev) {
        // Turning off — reset everything
        clearTimer();
        setGuidedState("idle");
        setRestSecondsRemaining(0);
      }
      return !prev;
    });
  }, [clearTimer]);

  // Called when the user checks off a set in guided mode
  const onSetChecked = useCallback(
    (restSeconds: number) => {
      if (!guidedEnabled) return;

      feedbackSetChecked();
      clearTimer();

      remainingRef.current = restSeconds;
      setRestSecondsRemaining(restSeconds);
      setGuidedState("resting");

      timerRef.current = setInterval(() => {
        remainingRef.current -= 1;
        setRestSecondsRemaining(remainingRef.current);

        if (remainingRef.current <= 0) {
          clearTimer();
          setGuidedState("ready");
          feedbackRestComplete();
        }
      }, 1000);
    },
    [guidedEnabled, clearTimer],
  );

  // Called when the last set of an exercise is checked off
  const onExerciseCompleted = useCallback(() => {
    if (!guidedEnabled) return;
    feedbackExerciseComplete();
  }, [guidedEnabled]);

  // Called when the very last set of the session is checked off
  const onWorkoutCompleted = useCallback(() => {
    feedbackWorkoutComplete();
  }, []);

  return {
    guidedEnabled,
    guidedState,
    restSecondsRemaining,
    toggleGuided,
    onSetChecked,
    onExerciseCompleted,
    onWorkoutCompleted,
  };
}
