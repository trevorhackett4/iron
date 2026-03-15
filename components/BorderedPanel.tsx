// BorderedPanel - Generic bordered container component
// A reusable GBC-styled panel with thick borders. Can be used
// for any content that needs the classic bordered look.

import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { BorderWidth, Colors, Spacing } from "../constants/theme";

interface BorderedPanelProps {
  children: ReactNode; // Content to display inside
  variant?: "default" | "gold" | "blue" | "green" | "red"; // Border color variant
  padding?: number; // Custom padding (default: Spacing.md)
  backgroundColor?: string; // Custom background color (default: gb-dark)
  style?: ViewStyle; // Additional custom styles
  innerBorderWidth?: number; // Custom inner border width
}

export default function BorderedPanel({
  children,
  variant = "default",
  padding = Spacing.md,
  backgroundColor = Colors.gb.dark,
  style,
  innerBorderWidth = BorderWidth.thin,
}: BorderedPanelProps) {
  // Determine inner border color based on variant
  const getInnerBorderColor = () => {
    switch (variant) {
      case "gold":
        return Colors.gb.gold;
      case "blue":
        return Colors.gb.blue;
      case "green":
        return Colors.gb.green;
      case "red":
        return Colors.gb.red;
      default:
        return Colors.gb.mid; // Grey for default
    }
  };

  const innerBorderColor = getInnerBorderColor();

  return (
    <View style={[styles.container, style]}>
      {/* Outer black border */}
      <View style={[styles.outerBorder, { backgroundColor }]}>
        {/* Inner colored border */}
        <View
          style={[
            styles.innerBorder,
            {
              borderColor: innerBorderColor,
              borderWidth: innerBorderWidth,
            },
          ]}
        >
          {/* Content with padding */}
          <View style={{ padding }}>{children}</View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  outerBorder: {
    borderWidth: BorderWidth.thickest,
    borderColor: Colors.gb.black,
    borderRadius: 0,
    padding: BorderWidth.thin,
  },

  innerBorder: {
    borderRadius: 0,
  },
});
