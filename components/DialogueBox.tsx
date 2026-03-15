// DialogueBox - Pokémon-style dialogue box component
// This creates the classic bottom-screen dialogue box with borders
// and optional coach sprite, just like talking to an NPC in Pokémon.

import React from "react";
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { BorderWidth, Colors, FontSize, Spacing } from "../constants/theme";

interface DialogueBoxProps {
  message: string; // The text to display
  sprite?: ImageSourcePropType; // Optional coach sprite image
  showContinueArrow?: boolean; // Show ▼ arrow in bottom-right
  backgroundColor?: string; // Background color (default: gb-light)
}

export default function DialogueBox({
  message,
  sprite,
  showContinueArrow = false,
  backgroundColor = Colors.gb.light,
}: DialogueBoxProps) {
  return (
    <View style={styles.container}>
      {/* Outer black border */}
      <View style={[styles.outerBorder, { backgroundColor }]}>
        {/* Inner white border (classic Pokémon style) */}
        <View style={styles.innerBorder}>
          {/* Content area */}
          <View style={styles.content}>
            {/* Coach sprite (if provided) */}
            {sprite && (
              <View style={styles.spriteContainer}>
                <Image
                  source={sprite}
                  style={styles.sprite}
                  resizeMode="contain"
                />
              </View>
            )}

            {/* Message text */}
            <View style={styles.textContainer}>
              <Text style={styles.text} allowFontScaling={false}>
                {message}
              </Text>

              {/* Continue arrow (▼) in bottom-right */}
              {showContinueArrow && (
                <Text style={styles.arrow} allowFontScaling={false}>
                  ▼
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
    width: "100%",
  },

  outerBorder: {
    // Thick black border (outer)
    borderWidth: BorderWidth.thickest,
    borderColor: Colors.gb.black,
    borderRadius: 0,
    padding: BorderWidth.thin, // Space for inner border
  },

  innerBorder: {
    // White/light inner border (classic Pokémon)
    borderWidth: BorderWidth.thin,
    borderColor: Colors.gb.lightest,
    borderRadius: 0,
  },

  content: {
    flexDirection: "row",
    padding: Spacing.md,
    minHeight: 80, // Minimum height for dialogue box
  },

  spriteContainer: {
    marginRight: Spacing.md,
    justifyContent: "flex-start",
  },

  sprite: {
    width: 32,
    height: 32,
    // We'll use pixel art sprites here
  },

  textContainer: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },

  text: {
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.5, // 1.5x line height for readability
    color: Colors.gb.black, // Black text on light background (like Pokémon)
    fontWeight: "500",
  },

  arrow: {
    position: "absolute",
    bottom: -8,
    right: 0,
    fontSize: FontSize.base,
    color: Colors.gb.black,
  },
});
