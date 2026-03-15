// XpBar - Game Boy Color experience bar component
// This mimics the HP/EXp bars from Pokémon games - chunky, bordered,
// and fills in discrete steps rather than smoothly.

import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { BorderWidth, Colors, FontSize, Spacing } from "../constants/theme";

interface XpBarProps {
  currentXp: number; // Current Xp amount
  maxXp: number; // Xp needed for next level
  showLabel?: boolean; // Show "Xp" label above bar
  showNumbers?: boolean; // Show "450 / 500" text
  height?: number; // Bar height (default 16)
  animated?: boolean; // Animate when Xp changes (default true)
}

export default function XpBar({
  currentXp,
  maxXp,
  showLabel = true,
  showNumbers = true,
  height = 16,
  animated = true,
}: XpBarProps) {
  // Calculate percentage (0-100)
  const percentage = Math.min((currentXp / maxXp) * 100, 100);

  // Animated value for the fill width
  const fillWidth = useRef(new Animated.Value(percentage)).current;

  // When currentXp changes, animate to new percentage
  useEffect(() => {
    if (animated) {
      // Animate in discrete steps (every 10%) to mimic GBC
      // We'll use a timing animation but with steps
      Animated.timing(fillWidth, {
        toValue: percentage,
        duration: 300, // 300ms total
        useNativeDriver: false, // Can't use native driver for width animations
      }).start();
    } else {
      fillWidth.setValue(percentage);
    }
  }, [currentXp, maxXp, animated, percentage, fillWidth]);

  return (
    <View style={styles.container}>
      {/* Label and numbers row */}
      {(showLabel || showNumbers) && (
        <View style={styles.labelRow}>
          {showLabel && (
            <Text style={styles.label} allowFontScaling={false}>
              Xp
            </Text>
          )}
          {showNumbers && (
            <Text style={styles.numbers} allowFontScaling={false}>
              {currentXp} / {maxXp}
            </Text>
          )}
        </View>
      )}

      {/* The bar itself */}
      <View style={[styles.barContainer, { height }]}>
        {/* Outer black border */}
        <View style={styles.barOuter}>
          {/* Inner colored fill */}
          <Animated.View
            style={[
              styles.barFill,
              {
                width: fillWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },

  label: {
    fontSize: FontSize.sm,
    fontWeight: "bold",
    color: Colors.gb.lightest,
    letterSpacing: 1,
  },

  numbers: {
    fontSize: FontSize.sm,
    fontWeight: "bold",
    color: Colors.gb.light,
    letterSpacing: 0.5,
  },

  barContainer: {
    width: "100%",
  },

  barOuter: {
    flex: 1,
    backgroundColor: Colors.gb.darkest, // Empty/background color
    borderWidth: BorderWidth.thin,
    borderColor: Colors.gb.black,
    borderRadius: 0, // Square, no rounding
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    backgroundColor: Colors.gb.gold, // The gold fill
    // We could add a subtle gradient or texture here later
  },
});
