// StatDisplay - Corner HUD stat display component
// Mimics the heart counter and rupee display from Zelda games.
// Shows key stats like Level, Streak, etc. in a compact bordered box.

import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { BorderWidth, Colors, FontSize, Spacing } from "../constants/theme";

interface StatDisplayProps {
  label: string; // e.g., "LEVEL", "STREAK"
  value: string | number; // The stat value to display
  icon?: string; // Optional emoji or icon (e.g., "🔥" for streak)
  variant?: "default" | "gold" | "blue" | "green"; // Color accent
  style?: ViewStyle; // Additional custom styles
}

export default function StatDisplay({
  label,
  value,
  icon,
  variant = "default",
  style,
}: StatDisplayProps) {
  // Determine accent color based on variant
  const getAccentColor = () => {
    switch (variant) {
      case "gold":
        return Colors.gb.gold;
      case "blue":
        return Colors.gb.blue;
      case "green":
        return Colors.gb.green;
      default:
        return Colors.gb.lightest;
    }
  };

  const accentColor = getAccentColor();

  return (
    <View style={[styles.container, style]}>
      {/* Outer black border */}
      <View style={styles.outerBorder}>
        {/* Inner white/accent border */}
        <View style={[styles.innerBorder, { borderColor: accentColor }]}>
          {/* Content */}
          <View style={styles.content}>
            {/* Label */}
            <Text style={styles.label} allowFontScaling={false}>
              {label}
            </Text>

            {/* Value with optional icon */}
            <View style={styles.valueRow}>
              <Text
                style={[styles.value, { color: accentColor }]}
                allowFontScaling={false}
              >
                {value}
              </Text>
              {icon && (
                <Text style={styles.icon} allowFontScaling={false}>
                  {icon}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Semi-transparent background so it can overlay other content
    backgroundColor: "rgba(10, 10, 15, 0.9)", // gb-darkest with 90% opacity
    borderRadius: 0,
  },

  outerBorder: {
    borderWidth: BorderWidth.thick,
    borderColor: Colors.gb.black,
    borderRadius: 0,
    padding: BorderWidth.thin,
  },

  innerBorder: {
    borderWidth: BorderWidth.thin,
    borderRadius: 0,
    padding: Spacing.sm,
  },

  content: {
    alignItems: "center",
    minWidth: 80, // Minimum width for readability
  },

  label: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.light,
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  value: {
    fontSize: FontSize.xl,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  icon: {
    fontSize: FontSize.lg,
  },
});
