// Updated test screen with BorderedPanel

import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import BorderedPanel from "../components/BorderedPanel";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import IronButton from "../components/IronButton";
import QuestCard from "../components/QuestCard";
import StatDisplay from "../components/StatDisplay";
import XpBar from "../components/XpBar";
import { Colors, FontSize, Spacing } from "../constants/theme";
import { auth, db } from "../services/firebase";
import { ChatMessage as ChatMessageType } from "../types";

export default function TestScreen() {
  // State for Xp bar test
  const [xp, setXp] = useState(150);
  const [level, setLevel] = useState(5);
  const [streak, setStreak] = useState(8);
  const maxXp = 500;

  // State for chat test
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "1",
      role: "coach",
      content:
        "Hey! Ready to get started? I've prepared a workout for you based on your goals.",
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    console.log("Firebase Auth:", auth ? "Connected ✓" : "Not connected ✗");
    console.log("Firebase Firestore:", db ? "Connected ✓" : "Not connected ✗");
  }, []);

  const addXp = () => {
    const newXp = xp + 50;
    if (newXp >= maxXp) {
      setLevel((prev) => prev + 1);
      setXp(newXp - maxXp);
    } else {
      setXp(newXp);
    }
  };

  const resetXp = () => {
    setXp(0);
    setLevel(5);
  };

  const handleSendMessage = (text: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const responses = [
        "Great question! Let me explain...",
        "Absolutely! Here's what I recommend...",
        "Good thinking. We can definitely adjust that.",
        "That's a smart approach. Let's modify the plan.",
      ];

      const coachMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: "coach",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, coachMessage]);
    }, 500);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>IRON</Text>
        <Text style={styles.subtitle}>Component Test</Text>

        {/* Bordered Panel Test */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BORDERED PANELS</Text>

          <BorderedPanel variant="gold">
            <Text style={styles.panelText}>Gold border panel</Text>
            <Text style={styles.panelSubtext}>
              Use for primary/important content
            </Text>
          </BorderedPanel>

          <BorderedPanel variant="blue">
            <Text style={styles.panelText}>Blue border panel</Text>
            <Text style={styles.panelSubtext}>
              Use for informational content
            </Text>
          </BorderedPanel>

          <BorderedPanel variant="green">
            <Text style={styles.panelText}>Green border panel</Text>
            <Text style={styles.panelSubtext}>Use for success states</Text>
          </BorderedPanel>

          <BorderedPanel variant="red">
            <Text style={styles.panelText}>Red border panel</Text>
            <Text style={styles.panelSubtext}>
              Use for warnings or intense content
            </Text>
          </BorderedPanel>

          <BorderedPanel variant="default">
            <Text style={styles.panelText}>Default border panel</Text>
            <Text style={styles.panelSubtext}>
              Use for neutral/secondary content
            </Text>
          </BorderedPanel>
        </View>

        {/* Quest Card Test */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QUEST CARD</Text>

          <QuestCard
            title="TODAY'S WORKOUT"
            subtitle="Chest & Triceps"
            description="Focus on compound movements with progressive overload. We'll hit bench press, incline work, and finish with tricep isolation."
            exerciseCount={6}
            estimatedDuration={45}
            difficulty="medium"
            onPress={() => console.log("Quest card pressed!")}
            isActive={true}
          />
        </View>

        {/* Stat Display Test */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>STAT DISPLAYS</Text>

          <View style={styles.statRow}>
            <StatDisplay label="LEVEL" value={level} variant="gold" />

            <StatDisplay
              label="STREAK"
              value={streak}
              icon="🔥"
              variant="default"
            />
          </View>
        </View>

        {/* Interactive Chat Test */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INTERACTIVE CHAT</Text>

          <View style={styles.chatContainer}>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                message={msg.content}
                timestamp={msg.timestamp}
              />
            ))}
          </View>

          <ChatInput onSend={handleSendMessage} placeholder="Ask coach..." />
        </View>

        {/* Xp Bar Test */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>XP BAR</Text>
          <XpBar
            currentXp={xp}
            maxXp={maxXp}
            showLabel={true}
            showNumbers={true}
          />

          <View style={styles.xpButtons}>
            <IronButton
              title="ADD XP"
              onPress={addXp}
              variant="primary"
              size="small"
            />
            <IronButton
              title="RESET"
              onPress={resetXp}
              variant="secondary"
              size="small"
            />
          </View>
        </View>

        {/* Button Variants Test */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BUTTONS</Text>

          <IronButton
            title="PRIMARY"
            onPress={() => console.log("Primary pressed")}
            variant="primary"
            size="large"
            fullWidth
          />

          <IronButton
            title="SECONDARY"
            onPress={() => console.log("Secondary pressed")}
            variant="secondary"
            size="medium"
            fullWidth
          />

          <IronButton
            title="DANGER"
            onPress={() => console.log("Danger pressed")}
            variant="danger"
            size="medium"
            fullWidth
          />

          <IronButton
            title="DISABLED"
            onPress={() => console.log("Should not fire")}
            disabled={true}
            size="medium"
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.gb.darkest,
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: Spacing.lg,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.gb.gold,
    marginBottom: Spacing.sm,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gb.light,
    marginBottom: Spacing.xl,
  },
  section: {
    width: "100%",
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: "bold",
    color: Colors.gb.lightest,
    marginBottom: Spacing.sm,
    letterSpacing: 1,
  },
  panelText: {
    fontSize: FontSize.base,
    fontWeight: "bold",
    color: Colors.gb.lightest,
    marginBottom: 4,
  },
  panelSubtext: {
    fontSize: FontSize.sm,
    color: Colors.gb.light,
  },
  statRow: {
    flexDirection: "row",
    gap: Spacing.md,
    justifyContent: "center",
  },
  chatContainer: {
    minHeight: 200,
    marginBottom: Spacing.md,
  },
  xpButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
