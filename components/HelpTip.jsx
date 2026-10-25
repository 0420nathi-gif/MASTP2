import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { fontFamilies, useAppTheme } from "../constants/theme-context";

export default function HelpTip({ title, children }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container} accessibilityRole="summary">
      <FontAwesome6
        name="lightbulb"
        size={16}
        color={theme.primary}
        style={styles.icon}
      />
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{children}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      alignItems: "flex-start",
      backgroundColor: theme.tagBackground,
      borderRadius: 12,
      flexDirection: "row",
      marginTop: 16,
      padding: 14,
    },
    icon: { marginRight: 10, marginTop: 2 },
    copy: { flex: 1 },
    title: {
      color: theme.ink,
      fontFamily: fontFamilies.bold,
      fontSize: 13,
    },
    message: {
      color: theme.muted,
      fontFamily: fontFamilies.regular,
      fontSize: 12,
      lineHeight: 18,
      marginTop: 4,
    },
  });
