// Coach chat screen - Talk to the AI coach
// Full-screen interactive chat interface

import React from "react";
import { StyleSheet, View } from "react-native";
import ChatScreen from "../../components/ChatScreen";
import { Colors } from "../../constants/theme";

export default function CoachScreen() {
  // Simulate AI responses (we'll connect to real API later)
  const handleSendMessage = async (message: string): Promise<string> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock responses based on keywords
    if (message.toLowerCase().includes("workout")) {
      return "Great question about workouts! Based on your current program, we're focusing on progressive overload. Each week, we'll aim to either increase weight or reps to keep challenging your muscles.";
    } else if (message.toLowerCase().includes("form")) {
      return "Form is crucial! For bench press: keep your shoulder blades retracted, feet flat on the ground, and lower the bar to mid-chest. The bar path should be slightly diagonal, not straight up and down.";
    } else if (message.toLowerCase().includes("rest")) {
      return "Rest periods matter! For compound lifts like squats and deadlifts, take 2-3 minutes between heavy sets. For isolation exercises, 60-90 seconds is usually enough.";
    } else {
      return "I'm here to help! Ask me about your workout plan, exercise form, nutrition, recovery, or anything strength training related.";
    }
  };

  return (
    <View style={styles.container}>
      <ChatScreen
        initialMessages={[
          {
            id: "1",
            role: "coach",
            content:
              "Hey! I'm your AI strength coach. Ask me anything about your training, form, nutrition, or goals. How can I help you today?",
            timestamp: new Date(),
          },
        ]}
        onSendMessage={handleSendMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gb.darkest,
  },
});
