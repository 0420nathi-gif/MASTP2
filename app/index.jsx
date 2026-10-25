import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontFamilies, useAppTheme } from "../constants/theme-context";

export default function SplashScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    const timeout = setTimeout(() => router.replace("/Home"), 1800);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <View style={styles.content}>
        <View style={styles.iconFrame}>
          <FontAwesome6 name="bowl-food" size={60} color={theme.primary} />
        </View>
        <Text style={styles.brand}>FoodManager</Text>
        <Text style={styles.tagline}>By VertAgency.</Text>
      </View>
      <Text style={styles.footer}>YOUR KITCHEN, READY TO SERVE</Text>
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    safeArea: {
      alignItems: "center",
      backgroundColor: theme.background,
      flex: 1,
      justifyContent: "space-between",
      paddingBottom: 28,
      paddingTop: 28,
    },
    content: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
    },
    iconFrame: {
      alignItems: "center",
      backgroundColor: theme.surface,
      borderColor: theme.accent,
      borderRadius: 80,
      borderWidth: 1,
      height: 144,
      justifyContent: "center",
      marginBottom: 28,
      width: 144,
    },
    brand: {
      color: theme.ink,
      fontFamily: fontFamilies.bold,
      fontSize: 36,
      letterSpacing: 8,
      marginLeft: 8,
    },
    tagline: {
      color: theme.muted,
      fontFamily: fontFamilies.regular,
      fontSize: 15,
      marginTop: 10,
    },
    footer: {
      color: theme.primary,
      fontFamily: fontFamilies.bold,
      fontSize: 10,
      letterSpacing: 2,
    },
  });
