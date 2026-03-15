// ChatMessage - Individual message bubble component
// Displays either a coach message (Pokémon-style dialogue box) or
// user message (compact bubble, right-aligned)

import React from "react";
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { BorderWidth, Colors, FontSize, Spacing } from "../constants/theme";

interface ChatMessageProps {
  role: "user" | "coach"; // Who sent this message
  message: string; // The text content
  sprite?: ImageSourcePropType; // Optional coach sprite (only for coach messages)
  timestamp?: Date; // Optional timestamp
}

export default function ChatMessage({
  role,
  message,
  sprite,
  timestamp,
}: ChatMessageProps) {
  if (role === "coach") {
    // Coach message - full-width Pokémon-style dialogue box
    return (
      <View style={styles.coachContainer}>
        {/* Outer black border */}
        <View style={styles.coachOuterBorder}>
          {/* Inner white border */}
          <View style={styles.coachInnerBorder}>
            {/* Content */}
            <View style={styles.coachContent}>
              {/* Coach sprite (if provided) */}
              {sprite && (
                <View style={styles.spriteContainer}>
                  <Image source={sprite} style={styles.sprite} />
                </View>
              )}

              {/* Message text */}
              <View style={styles.coachTextContainer}>
                <Text style={styles.coachText} allowFontScaling={false}>
                  {message}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    // User message - compact bubble, right-aligned
    return (
      <View style={styles.userContainer}>
        <View style={styles.userOuterBorder}>
          {/* Inner blue border for user messages */}
          <View style={styles.userInnerBorder}>
            <Text style={styles.userText} allowFontScaling={false}>
              {message}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // COACH MESSAGE STYLES (Pokémon dialogue box)
  coachContainer: {
    width: "100%",
    marginBottom: Spacing.md,
  },

  coachOuterBorder: {
    borderWidth: BorderWidth.thickest,
    borderColor: Colors.gb.black,
    backgroundColor: Colors.gb.light, // Cream/grey background
    borderRadius: 0,
    padding: BorderWidth.thin,
  },

  coachInnerBorder: {
    borderWidth: BorderWidth.thin,
    borderColor: Colors.gb.lightest, // White inner border
    borderRadius: 0,
  },

  coachContent: {
    flexDirection: "row",
    padding: Spacing.md,
    minHeight: 80,
  },

  spriteContainer: {
    marginRight: Spacing.md,
    justifyContent: "flex-start",
  },

  sprite: {
    width: 32,
    height: 32,
  },

  coachTextContainer: {
    flex: 1,
    justifyContent: "center",
  },

  coachText: {
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.5,
    color: Colors.gb.black, // Black text on light background
    fontWeight: "500",
  },

  // USER MESSAGE STYLES (compact bubble)
  userContainer: {
    width: "100%",
    alignItems: "flex-end", // Right-align
    marginBottom: Spacing.md,
  },

  userOuterBorder: {
    maxWidth: "80%", // Don't take full width
    borderWidth: BorderWidth.thick,
    borderColor: Colors.gb.black,
    backgroundColor: Colors.gb.dark,
    borderRadius: 0,
    padding: BorderWidth.thin,
  },

  userInnerBorder: {
    borderWidth: BorderWidth.thin,
    borderColor: Colors.gb.blue, // Blue accent for user
    borderRadius: 0,
    padding: Spacing.sm,
  },

  userText: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.4,
    color: Colors.gb.lightest, // White text on dark background
    fontWeight: "500",
  },
});
