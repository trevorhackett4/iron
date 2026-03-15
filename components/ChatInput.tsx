// ChatInput - Fixed bottom input for chatting with AI coach
// Styled like a GBC text entry box with send button

import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { BorderWidth, Colors, FontSize, Spacing } from "../constants/theme";
import IronButton from "./IronButton";

interface ChatInputProps {
  onSend: (message: string) => void; // Callback when user sends a message
  placeholder?: string; // Placeholder text
  disabled?: boolean; // Disable input (e.g., while AI is responding)
}

export default function ChatInput({
  onSend,
  placeholder = "Ask coach...",
  disabled = false,
}: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim().length > 0) {
      onSend(text.trim());
      setText(""); // Clear input after sending
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        {/* Outer black border */}
        <View style={styles.outerBorder}>
          {/* Inner blue border (accent) */}
          <View style={styles.innerBorder}>
            <View style={styles.inputRow}>
              {/* Text input */}
              <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder={placeholder}
                placeholderTextColor={Colors.gb.mid}
                allowFontScaling={false}
                editable={!disabled}
                multiline={false} // Single line for now
                returnKeyType="send"
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
              />

              {/* Send button */}
              <View style={styles.buttonContainer}>
                <IronButton
                  title="SEND"
                  onPress={handleSend}
                  variant="primary"
                  size="small"
                  disabled={disabled || text.trim().length === 0}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gb.darkest,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: BorderWidth.thin,
    borderTopColor: Colors.gb.black,
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
    borderColor: Colors.gb.blue, // Blue accent
    borderRadius: 0,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
  },

  input: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.gb.lightest,
    fontWeight: "500",
    minHeight: 40,
    // Remove default styling
    paddingVertical: 0,
    paddingHorizontal: Spacing.sm,
  },

  buttonContainer: {
    marginLeft: Spacing.sm,
  },
});
