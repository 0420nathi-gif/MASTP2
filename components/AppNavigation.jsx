import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link, usePathname } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { HoverablePressable } from "./InteractiveControls";
import { fontFamilies, useAppTheme } from "../constants/theme-context";

const destinations = [
  { href: "/home", label: "Add dish", icon: "pen-to-square" },
  { href: "/Menu", label: "Menu", icon: "utensils" },
  { href: "/Stats", label: "Stats", icon: "chart-simple" },
  { href: "/contact", label: "Support", icon: "circle-question" },
];

export default function AppNavigation() {
  const pathname = usePathname().toLowerCase();
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.navigation} accessibilityLabel="Main navigation">
      {destinations.map((destination) => {
        const selected = pathname === destination.href.toLowerCase();

        return (
          <Link key={destination.href} href={destination.href} asChild>
            <HoverablePressable
              accessibilityRole="link"
              accessibilityLabel={`${destination.label}${selected ? ", current page" : ""}`}
              accessibilityState={{ selected }}
              style={StyleSheet.flatten([
                styles.destination,
                selected && styles.selectedDestination,
              ])}
            >
              <FontAwesome6
                name={destination.icon}
                size={17}
                color={selected ? theme.primary : theme.muted}
              />
              <Text
                style={StyleSheet.flatten([
                  styles.label,
                  selected && styles.selectedLabel,
                ])}
              >
                {destination.label}
              </Text>
            </HoverablePressable>
          </Link>
        );
      })}
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    navigation: {
      alignItems: "stretch",
      backgroundColor: theme.surface,
      borderTopColor: theme.chipBorder,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
      justifyContent: "space-around",
      paddingHorizontal: 8,
      paddingTop: 7,
    },
    destination: {
      alignItems: "center",
      borderRadius: 10,
      justifyContent: "center",
      minHeight: 52,
      minWidth: 64,
      paddingHorizontal: 8,
      paddingVertical: 5,
    },
    selectedDestination: { backgroundColor: theme.tagBackground },
    label: {
      color: theme.muted,
      fontFamily: fontFamilies.medium,
      fontSize: 10,
      marginTop: 4,
    },
    selectedLabel: {
      color: theme.primary,
      fontFamily: fontFamilies.bold,
    },
  });
