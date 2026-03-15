// SessionCompletePanel - Shown when all exercises in the session are logged.
// Displays XP earned and total volume lifted, with a button to return home.

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BorderWidth, Colors, FontSize, Spacing } from "../../constants/theme";
import IronButton from "../IronButton";

interface SessionCompletePanelProps {
  xpEarned: number;
  totalVolume: number;
  onFinish: () => void;
}

export default function SessionCompletePanel({
  xpEarned,
  totalVolume,
  onFinish,
}: SessionCompletePanelProps) {
  return (
    <View style={styles.container}>
      {/* Outer black border */}
      <View style={styles.outer}>
        {/* Inner gold border — gold is the dominant accent for achievements */}
        <View style={styles.inner}>
          {/* Title bar */}
          <View style={styles.titleBar}>
            <Text style={styles.titleText} allowFontScaling={false}>
              SESSION COMPLETE!
            </Text>
          </View>

          <View style={styles.body}>
            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statLabel} allowFontScaling={false}>
                  XP EARNED
                </Text>
                <Text style={styles.statValue} allowFontScaling={false}>
                  +{xpEarned}
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.stat}>
                <Text style={styles.statLabel} allowFontScaling={false}>
                  TOTAL VOLUME
                </Text>
                <Text style={styles.statValue} allowFontScaling={false}>
                  {totalVolume} lbs
                </Text>
              </View>
            </View>

            {/* Back to home */}
            <IronButton
              title="BACK TO HOME"
              onPress={onFinish}
              variant="primary"
              size="large"
              fullWidth
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.md,
  },

  outer: {
    borderWidth: BorderWidth.thickest,
    borderColor: Colors.gb.black,
    backgroundColor: Colors.gb.dark,
    borderRadius: 0,
    padding: BorderWidth.thin,
  },

  inner: {
    borderWidth: BorderWidth.thin,
    borderColor: Colors.gb.gold,
    borderRadius: 0,
  },

  titleBar: {
    backgroundColor: Colors.gb.lightest,
    borderBottomWidth: BorderWidth.thin,
    borderBottomColor: Colors.gb.black,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },

  titleText: {
    fontSize: FontSize.base,
    fontWeight: "bold",
    color: Colors.gb.black,
    letterSpacing: 2,
    textAlign: "center",
  },

  body: {
    padding: Spacing.md,
    gap: Spacing.md,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  stat: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: Spacing.sm,
  },

  statDivider: {
    width: BorderWidth.thin,
    backgroundColor: Colors.gb.mid,
    alignSelf: "stretch",
    marginVertical: Spacing.xs,
  },

  statLabel: {
    fontSize: FontSize.xs,
    fontWeight: "bold",
    color: Colors.gb.mid,
    letterSpacing: 1,
  },

  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: "bold",
    color: Colors.gb.gold,
    letterSpacing: 1,
  },
});
