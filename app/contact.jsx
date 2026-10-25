import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  HoverablePressable,
  HoverableView,
} from "../components/InteractiveControls";
import AppNavigation from "../components/AppNavigation";
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
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
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
            <HoverablePressable
              accessibilityRole="link"
              accessibilityLabel="Email kitchen support"
              onPress={() => openEmailDraft()}
              style={styles.emailButton}
            >
              <Text style={styles.cardValue}>0420nathi@gmail.com</Text>
            </HoverablePressable>
            <Text style={styles.cardHint}>Tap to open your email app.</Text>
          </View>

          <View style={styles.messageCard}>
            <Text style={styles.cardLabel}>SEND A MESSAGE</Text>
            <Text style={styles.messageTitle}>What can we help with?</Text>
            <HoverableView
              style={styles.messageInputShell}
              hoverStyle={styles.messageInputHovered}
            >
              <TextInput
                accessibilityLabel="Message for kitchen support"
                value={message}
                onChangeText={setMessage}
                multiline
                textAlignVertical="top"
                placeholder="Tell us what's on your mind..."
                placeholderTextColor={theme.placeholder}
                style={styles.messageInput}
              />
            </HoverableView>
            <HoverablePressable
              accessibilityRole="button"
              onPress={sendMessage}
              style={styles.sendButton}
            >
              <Text style={styles.sendButtonText}>Open email draft</Text>
            </HoverablePressable>
            <Text style={styles.cardHint}>
              Your email app will open with this message ready to review and
              send.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AppNavigation />
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    keyboardView: { flex: 1 },
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
    emailButton: { justifyContent: "center", minHeight: 44 },
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
    messageInputShell: {
      backgroundColor: theme.inputBackground,
      borderColor: theme.inputBorder,
      borderRadius: 11,
      borderWidth: 1,
    },
    messageInputHovered: {
      borderColor: theme.primary,
      backgroundColor: theme.surface,
    },
    messageInput: {
      backgroundColor: "transparent",
      borderRadius: 11,
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
    sendButtonText: {
      color: theme.surface,
      fontFamily: fontFamilies.bold,
      fontSize: 15,
    },
  });
