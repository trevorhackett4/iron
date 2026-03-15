// ChatScreen - Full interactive AI coach chat interface
// This is a complete screen that shows conversation history and input

import React, { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet
} from "react-native";
import { Colors, Spacing } from "../constants/theme";
import { ChatMessage as ChatMessageType } from "../types";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

interface ChatScreenProps {
  initialMessages?: ChatMessageType[]; // Pre-populate with conversation
  onSendMessage: (message: string) => Promise<string>; // Send message, get AI response
  coachSprite?: any; // Optional coach sprite image
}

export default function ChatScreen({
  initialMessages = [],
  onSendMessage,
  coachSprite,
}: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    // Add user message immediately
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the onSendMessage callback (this will hit the LLM API)
      const response = await onSendMessage(text);

      // Add coach response
      const coachMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: "coach",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, coachMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message from coach
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: "coach",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Message history */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            message={msg.content}
            sprite={msg.role === "coach" ? coachSprite : undefined}
            timestamp={msg.timestamp}
          />
        ))}

        {/* Loading indicator (when AI is responding) */}
        {isLoading && (
          <ChatMessage role="coach" message="..." sprite={coachSprite} />
        )}
      </ScrollView>

      {/* Fixed input at bottom */}
      <ChatInput
        onSend={handleSend}
        disabled={isLoading}
        placeholder={isLoading ? "Coach is thinking..." : "Ask coach..."}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gb.darkest,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
  },
});
