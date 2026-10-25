import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import HelpTip from "../components/HelpTip";
import AppNavigation from "../components/AppNavigation";
import { getMenuStatistics } from "../constants/menu-utils.cjs";
import { useMenu } from "../constants/menu-context";
import {
  fontFamilies,
  ThemeToggle,
  useAppTheme,
} from "../constants/theme-context";

export default function Stats() {
  const { menuItems, isLoading, storageError } = useMenu();
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { totalItems, averagePrice, availableItems } =
    getMenuStatistics(menuItems);
  const metrics = [
    {
      label: "TOTAL MENU ITEMS",
      value: String(totalItems),
      detail: "Dishes saved on your menu",
      icon: "utensils",
    },
    {
      label: "AVERAGE PRICE",
      value: `R${averagePrice.toFixed(2)}`,
      detail:
        totalItems > 0
          ? "Average across all menu items"
          : "Add dishes to calculate an average",
      icon: "money-bill-wave",
    },
    {
      label: "ITEMS AVAILABLE",
      value: String(availableItems),
      detail: `Of ${totalItems} total menu items`,
      icon: "circle-check",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemeToggle />
        <Text style={styles.eyebrow}>MENU OVERVIEW</Text>
        <Text style={styles.title}>Menu statistics</Text>
        <Text style={styles.subtitle}>
          A quick look at your dishes, pricing, and availability.
        </Text>
        <HelpTip title="Understanding these numbers">
          Average price includes every dish, even unavailable ones. Change a
          dish&apos;s availability from the menu list to update the available
          count.
        </HelpTip>

        {storageError ? (
          <Text style={styles.storageError}>{storageError}</Text>
        ) : null}

        {metrics.map((metric) => (
          <View style={styles.metricCard} key={metric.label}>
            <View style={styles.metricIcon}>
              <FontAwesome6
                name={metric.icon}
                size={20}
                color={theme.primary}
              />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>
                {isLoading ? "—" : metric.value}
              </Text>
              <Text style={styles.metricDetail}>{metric.detail}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
      <AppNavigation />
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
      marginBottom: 8,
    },
    title: {
      color: theme.ink,
      fontFamily: fontFamilies.bold,
      fontSize: 32,
      marginTop: 22,
    },
    subtitle: {
      color: theme.muted,
      fontFamily: fontFamilies.regular,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 22,
      marginTop: 8,
    },
    storageError: {
      backgroundColor: theme.error,
      borderRadius: 10,
      color: theme.surface,
      fontFamily: fontFamilies.medium,
      marginBottom: 14,
      padding: 12,
    },
    metricCard: {
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: 16,
      flexDirection: "row",
      marginBottom: 12,
      padding: 18,
    },
    metricIcon: {
      alignItems: "center",
      backgroundColor: theme.tagBackground,
      borderRadius: 25,
      height: 50,
      justifyContent: "center",
      marginRight: 15,
      width: 50,
    },
    metricContent: { flex: 1 },
    metricLabel: {
      color: theme.primary,
      fontFamily: fontFamilies.bold,
      fontSize: 10,
      letterSpacing: 1.1,
    },
    metricValue: {
      color: theme.ink,
      fontFamily: fontFamilies.bold,
      fontSize: 28,
      marginTop: 3,
    },
    metricDetail: {
      color: theme.muted,
      fontFamily: fontFamilies.regular,
      fontSize: 12,
      marginTop: 3,
    },
  });
