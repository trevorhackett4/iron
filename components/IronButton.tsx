// IronButton - A Game Boy Color styled button component
// This is the primary interactive element in Iron. It mimics the chunky,
// bordered buttons from GBC games like Pokémon's menu buttons.

import React from "react";
import {
    GestureResponderEvent,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";
import { BorderWidth, Colors, FontSize, Spacing } from "../constants/theme";

// Define the props (inputs) this component accepts
interface IronButtonProps {
  title: string; // The text on the button
  onPress: (event: GestureResponderEvent) => void; // Function to call when pressed
  variant?: "primary" | "secondary" | "danger"; // Button style variant
  disabled?: boolean; // Is the button disabled?
  fullWidth?: boolean; // Should it stretch to fill container?
  size?: "small" | "medium" | "large"; // Size preset
}

export default function IronButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  fullWidth = false,
  size = "medium",
}: IronButtonProps) {
  // Determine colors based on variant
  const getColors = () => {
    if (disabled) {
      return {
        background: Colors.gb.dark,
        border: Colors.gb.mid,
        text: Colors.gb.mid,
      };
    }

    switch (variant) {
      case "primary":
        return {
          background: Colors.gb.dark,
          border: Colors.gb.gold,
          text: Colors.gb.lightest,
        };
      case "secondary":
        return {
          background: Colors.gb.dark,
          border: Colors.gb.blue,
          text: Colors.gb.lightest,
        };
      case "danger":
        return {
          background: Colors.gb.dark,
          border: Colors.gb.red,
          text: Colors.gb.lightest,
        };
    }
  };

  // Get size-specific values
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: Spacing.sm,
          paddingHorizontal: Spacing.md,
          fontSize: FontSize.sm,
        };
      case "medium":
        return {
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.lg,
          fontSize: FontSize.base,
        };
      case "large":
        return {
          paddingVertical: Spacing.lg,
          paddingHorizontal: Spacing.xl,
          fontSize: FontSize.lg,
        };
    }
  };

  const colors = getColors();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={1} // We'll handle the press feedback ourselves
      style={[
        styles.button,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          width: fullWidth ? "100%" : "auto",
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: sizeStyles.fontSize,
          },
        ]}
        allowFontScaling={false} // Prevents OS-level text scaling from breaking our pixel aesthetic
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    // GBC thick border style - black outer border
    borderWidth: BorderWidth.thickest,
    borderColor: Colors.gb.black,

    // Inner colored border (we'll add this with a nested View later if needed)
    // For now, we use the borderColor from props

    // No border radius - GBC buttons are square
    borderRadius: 0,

    // Center the text
    alignItems: "center",
    justifyContent: "center",

    // Minimum touch target size (iOS HIG recommends 44pt)
    minHeight: 48,

    // Make it feel "pressable"
    // Note: We'll add press animation in a future enhancement
  },

  text: {
    // We'll use a pixel font here once we install it
    // For now, using system font bold
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1, // Slight letter spacing for readability

    // Text shadow for that GBC "embossed" look
    textShadowColor: Colors.gb.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0, // Sharp shadow, no blur
  },
});
