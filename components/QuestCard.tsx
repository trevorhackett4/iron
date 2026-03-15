// QuestCard - Today's workout displayed as a quest/mission card
// The main call-to-action on the home screen. Styled like a GBC
// quest notification or mission briefing.

import React from "react";
import {
    GestureResponderEvent,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BorderWidth, Colors, FontSize, Spacing } from "../constants/theme";

interface QuestCardProps {
  title: string; // e.g., "Today's Workout"
  subtitle?: string; // e.g., "Chest & Triceps"
  description?: string; // Brief summary of the workout
  exerciseCount?: number; // Number of exercises
  estimatedDuration?: number; // Duration in minutes
  difficulty?: "easy" | "medium" | "hard"; // Optional difficulty indicator
  onPress?: (event: GestureResponderEvent) => void; // Action when card is tapped
  isActive?: boolean; // Highlight as active/selected
}

export default function QuestCard({
  title,
  subtitle,
  description,
  exerciseCount,
  estimatedDuration,
  difficulty,
  onPress,
  isActive = true,
}: QuestCardProps) {
  // Determine difficulty color
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy":
        return Colors.gb.green;
      case "medium":
        return Colors.gb.gold;
      case "hard":
        return Colors.gb.red;
      default:
        return Colors.gb.light;
    }
  };

  const difficultyColor = getDifficultyColor();
  const borderColor = isActive ? Colors.gb.gold : Colors.gb.mid;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
      style={styles.container}
    >
      {/* Outer black border */}
      <View style={styles.outerBorder}>
        {/* Inner colored border (gold if active, grey if not) */}
        <View style={[styles.innerBorder, { borderColor }]}>
          {/* Title bar (like "TEAM ROCKET HQ" label) */}
          <View style={styles.titleBar}>
            <Text style={styles.title} allowFontScaling={false}>
              {title}
            </Text>
          </View>

          {/* Content area */}
          <View style={styles.content}>
            {/* Subtitle */}
            {subtitle && (
              <Text style={styles.subtitle} allowFontScaling={false}>
                {subtitle}
              </Text>
            )}

            {/* Description */}
            {description && (
              <Text
                style={styles.description}
                allowFontScaling={false}
                numberOfLines={3}
              >
                {description}
              </Text>
            )}

            {/* Stats row */}
            <View style={styles.statsRow}>
              {exerciseCount !== undefined && (
                <View style={styles.stat}>
                  <Text style={styles.statLabel} allowFontScaling={false}>
                    EXERCISES
                  </Text>
                  <Text style={styles.statValue} allowFontScaling={false}>
                    {exerciseCount}
                  </Text>
                </View>
              )}

              {estimatedDuration !== undefined && (
                <View style={styles.stat}>
                  <Text style={styles.statLabel} allowFontScaling={false}>
                    TIME
                  </Text>
                  <Text style={styles.statValue} allowFontScaling={false}>
                    {estimatedDuration}m
                  </Text>
                </View>
              )}

              {difficulty && (
                <View style={styles.stat}>
                  <Text style={styles.statLabel} allowFontScaling={false}>
                    DIFFICULTY
                  </Text>
                  <Text
                    style={[styles.statValue, { color: difficultyColor }]}
                    allowFontScaling={false}
                  >
                    {difficulty.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  outerBorder: {
    borderWidth: BorderWidth.thickest,
    borderColor: Colors.gb.black,
    backgroundColor: Colors.gb.dark,
    borderRadius: 0,
    padding: BorderWidth.thin,
  },

  innerBorder: {
    borderWidth: BorderWidth.thin,
    borderRadius: 0,
  },

  titleBar: {
    backgroundColor: Colors.gb.lightest, // White title bar (like Pokémon labels)
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.gb.black,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },

  title: {
    fontSize: FontSize.base,
    fontWeight: "bold",
    color: Colors.gb.black, // Black text on white background
    letterSpacing: 1,
    textAlign: "center",
  },

  content: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },

  subtitle: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    color: Colors.gb.gold,
    letterSpacing: 0.5,
  },

  description: {
    fontSize: FontSize.sm,
    color: Colors.gb.light,
    lineHeight: FontSize.sm * 1.4,
  },

  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.sm,
    flexWrap: "wrap",
  },

  stat: {
    flex: 1,
    minWidth: 80,
  },

  statLabel: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.mid,
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  statValue: {
    fontSize: FontSize.base,
    fontWeight: "bold",
    color: Colors.gb.lightest,
    letterSpacing: 0.5,
  },
});
