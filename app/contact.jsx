import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { fontFamilies, ThemeToggle, useAppTheme } from "../constants/theme-context";

export default function Contact() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [message, setMessage] = useState("");

  const openEmailDraft = async (body = "") => {
    const bodyQuery = body ? `&body=${encodeURIComponent(body)}` : "";
    try {
      await Linking.openURL(
        `mailto:0420nathi@gmail.com?subject=${encodeURIComponent(
          "FRNA kitchen support",
        )}${bodyQuery}`,
      );
      if (body) {
        Alert.alert(
          "Email draft opened",
          "Review the message and tap Send in your email app.",
        );
      }
    } catch (error) {
      console.error("Could not open the email app.", error);
      Alert.alert(
        "Couldn't open email",
        "Set up an email app on your device, or email 0420nathi@gmail.com directly.",
      );
    }
  };

  const sendMessage = () => {
    if (!message.trim()) {
      Alert.alert("Message needed", "Write a message before sending.");
      return;
    }

    openEmailDraft(message.trim());
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar style={theme.background === "#20231F" ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>KITCHEN SUPPORT</Text>
        <Text style={styles.title}>Let's keep service moving.</Text>
        <Text style={styles.subtitle}>
          Reach the team for menu questions, account help, or a little kitchen
          wisdom.
        </Text>
        <ThemeToggle />

        <View style={styles.contactCard}>
          <Text style={styles.cardLabel}>EMAIL</Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => openEmailDraft()}
          >
            <Text style={styles.cardValue}>0420nathi@gmail.com</Text>
          </Pressable>
          <Text style={styles.cardHint}>Tap to open your email app.</Text>
        </View>

        <View style={styles.messageCard}>
          <Text style={styles.cardLabel}>SEND A MESSAGE</Text>
          <Text style={styles.messageTitle}>What can we help with?</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
            placeholder="Tell us what's on your mind..."
            placeholderTextColor={theme.placeholder}
            style={styles.messageInput}
          />
          <Pressable
            accessibilityRole="button"
            onPress={sendMessage}
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.sendButtonText}>Open email draft</Text>
          </Pressable>
          <Text style={styles.cardHint}>
            Your email app will open with this message ready to review and send.
          </Text>
        </View>

        <Link href="/Home" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to menu builder</Text>
          </Pressable>
        </Link>
        <Link href="/Menu" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>View current menu</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    content: { padding: 24, paddingBottom: 44 },
    eyebrow: {
      color: theme.primary,
      fontFamily: fontFamilies.bold,
      fontSize: 10,
      letterSpacing: 1.4,
      marginBottom: 10,
    },
    title: {
      color: theme.ink,
      fontFamily: fontFamilies.bold,
      fontSize: 32,
      lineHeight: 37,
      maxWidth: 330,
    },
    subtitle: {
      color: theme.muted,
      fontFamily: fontFamilies.regular,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 25,
      marginTop: 10,
    },
    contactCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      marginBottom: 11,
      padding: 18,
    },
    cardLabel: {
      color: theme.primary,
      fontFamily: fontFamilies.bold,
      fontSize: 10,
      letterSpacing: 1.3,
      marginBottom: 8,
    },
    cardValue: {
      color: theme.ink,
      fontFamily: fontFamilies.bold,
      fontSize: 17,
    },
    cardHint: {
      color: theme.muted,
      fontFamily: fontFamilies.regular,
      fontSize: 13,
      marginTop: 5,
    },
    messageCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      marginTop: 14,
      padding: 18,
    },
    messageTitle: {
      color: theme.ink,
      fontFamily: fontFamilies.bold,
      fontSize: 18,
      marginBottom: 13,
    },
    messageInput: {
      backgroundColor: theme.inputBackground,
      borderColor: theme.inputBorder,
      borderRadius: 11,
      borderWidth: 1,
      color: theme.ink,
      fontFamily: fontFamilies.regular,
      fontSize: 15,
      height: 105,
      padding: 13,
    },
    sendButton: {
      alignItems: "center",
      backgroundColor: theme.ink,
      borderRadius: 11,
      marginTop: 13,
      paddingVertical: 14,
    },
    pressed: { opacity: 0.8 },
    sendButtonText: {
      color: theme.surface,
      fontFamily: fontFamilies.bold,
      fontSize: 15,
    },
    backButton: {
      alignItems: "center",
      borderColor: theme.ink,
      borderRadius: 11,
      borderWidth: 1,
      marginTop: 17,
      paddingVertical: 13,
    },
    backButtonText: {
      color: theme.ink,
      fontFamily: fontFamilies.bold,
      fontSize: 14,
    },
  });
