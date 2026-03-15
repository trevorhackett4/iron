/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

// This file centralizes all the Game Boy Color design tokens for Iron.
// By keeping colors, spacing, and other design values here, we ensure
// consistency across all components and make it easy to tweak the theme.

// Color palette based on Game Boy Color games (Pokémon, Zelda)
export const Colors = {
  gb: {
    // Grayscale - used everywhere as base
    black: "#000000", // All borders and outlines
    darkest: "#0f0f1e", // Screen backgrounds
    dark: "#2d2b3a", // Card/panel backgrounds
    mid: "#5a5568", // Inactive borders, secondary elements
    light: "#9c9ca4", // Secondary text, disabled states
    lightest: "#f0ece3", // Primary text, important numbers

    // Accent colors - use ONE per screen as dominant
    gold: "#f0c000", // XP, levels, achievements (most common)
    blue: "#4080f0", // AI coach, info, calm contexts
    red: "#e84030", // Intensity, warnings, PRs
    green: "#40c040", // Success, completion, health
    sand: "#d8c870", // Warm neutrals, paths
    grass: "#40a840", // Nature accents, growth
  },

  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

// Spacing values - everything snaps to 8px grid
// Use these instead of arbitrary numbers to maintain GBC aesthetic
export const Spacing = {
  xs: 4, // Half-unit (rare)
  sm: 8, // Base unit
  md: 16, // Standard padding
  lg: 24, // Large padding
  xl: 32, // Extra large
  xxl: 48, // Section spacing
};

// Border widths - GBC games used thick, visible borders
export const BorderWidth = {
  thin: 2, // Inner borders, decorative elements
  thick: 3, // Standard UI borders
  thickest: 4, // Outer borders, important panels
};

// XP system constants
// These control how XP is awarded and how leveling works
export const XP_PER_SET = 10; // Each logged set
export const XP_PER_COMPLETED_WORKOUT = 50; // Bonus for finishing
export const XP_PER_PR = 100; // Personal record bonus
export const XP_TO_LEVEL = (level: number) => level * 100; // XP needed for next level

// Font sizes - only use 8px increments (GBC constraint)
export const FontSize = {
  xs: 12, // Small labels
  sm: 14, // Secondary text
  base: 16, // Body text, most UI
  lg: 18, // Large numbers (weight, reps)
  xl: 20, // Headings
  xxl: 24, // Big display numbers (level)
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
