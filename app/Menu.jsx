import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getCategoryIcon } from "../constants/food-categories";
import { useMenu } from "../constants/menu-context";
import {
  fontFamilies,
  ThemeToggle,
  useAppTheme,
} from "../constants/theme-context";
import { filterMenuItems } from "../constants/menu-utils.cjs";

export default function About() {
  const { menuItems, removeItem, isLoading, storageError } = useMenu();
  const canModifyMenu = !isLoading && !storageError;
  const [search, setSearch] = useState("");
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const filteredItems = useMemo(
    () => filterMenuItems(menuItems, search),
    [menuItems, search],
  );

  const confirmRemove = (item) => {
    const remove = () => removeItem(item.id);

    if (Platform.OS === "web") {
      if (globalThis.confirm(`Delete "${item.name}" from your menu?`)) remove();
      return;
    }

    Alert.alert("Delete dish?", `Remove ${item.name} from your menu?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: remove },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar style={theme.background === "#20231F" ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>CURRENT MENU</Text>
        <ThemeToggle />
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Your dishes</Text>
            <Text style={styles.subtitle}>
              Everything ready for tonight&apos;s service.
            </Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countNumber}>{menuItems.length}</Text>
            <Text style={styles.countLabel}>DISHES</Text>
          </View>
        </View>

        {storageError ? (
          <Text style={styles.storageError}>{storageError}</Text>
        ) : null}

        <View style={styles.searchField}>
          <FontAwesome6 name="magnifying-glass" size={16} color={theme.muted} />
          <TextInput
            accessibilityLabel="Search menu"
            value={search}
            onChangeText={setSearch}
            placeholder="Search dishes or courses"
            placeholderTextColor={theme.placeholder}
            returnKeyType="search"
            style={styles.searchInput}
          />
          {search ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={8}
              onPress={() => setSearch("")}
            >
              <FontAwesome6 name="xmark" size={15} color={theme.muted} />
            </Pressable>
          ) : null}
        </View>

        {isLoading ? (
          <Text style={styles.emptyText}>Loading your saved menu...</Text>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome6
              name={search ? "magnifying-glass" : "utensils"}
              size={24}
              color={theme.primary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>
              {search ? "No dishes found." : "Your menu is waiting."}
            </Text>
            <Text style={styles.emptyText}>
              {search
                ? "Try another dish name, description, or course."
                : "Add a dish from the menu builder to see it here."}
            </Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <View style={styles.menuItem} key={item.id}>
              <View style={styles.menuItemTop}>
                <View style={styles.courseTag}>
                  <FontAwesome6
                    name={getCategoryIcon(item.course)}
                    size={12}
                    color={theme.primary}
                  />
                  <Text style={styles.courseTagText}>
                    {item.course.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.price}>R{item.price}</Text>
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <View style={styles.actions}>
                <Link
                  href={{ pathname: "/Home", params: { editId: item.id } }}
                  asChild
                >
                  <Pressable
                    accessibilityRole="button"
                    disabled={!canModifyMenu}
                    style={styles.editButton}
                  >
                    <FontAwesome6
                      name="pen"
                      size={12}
                      color={theme.ink}
                    />
                    <Text style={styles.editButtonText}>Edit</Text>
                  </Pressable>
                </Link>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${item.name}`}
                  onPress={() => confirmRemove(item)}
                  disabled={!canModifyMenu}
                  style={styles.deleteButton}
                >
                  <FontAwesome6
                    name="trash"
                    size={12}
                    color={theme.error}
                  />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}

        <Link href="/Home" asChild>
          <Pressable disabled={!canModifyMenu} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add another dish</Text>
          </Pressable>
        </Link>
        <Link href="/Contact" asChild>
          <Pressable style={styles.contactLink}>
            <Text style={styles.contactLinkText}>Contact kitchen support</Text>
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
      marginBottom: 8,
    },
    titleRow: {
      alignItems: "flex-start",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      marginTop: 14,
    },
    title: {
      color: theme.ink,
      fontFamily: fontFamilies.bold,
      fontSize: 32,
    },
    subtitle: {
      color: theme.muted,
      fontFamily: fontFamilies.regular,
      fontSize: 15,
      lineHeight: 21,
      marginTop: 8,
    },
    countBadge: {
      alignItems: "center",
      backgroundColor: theme.ink,
      borderRadius: 34,
      height: 67,
      justifyContent: "center",
      width: 67,
    },
    countNumber: {
      color: theme.accent,
      fontFamily: fontFamilies.bold,
      fontSize: 23,
    },
    countLabel: {
      color: theme.background,
      fontFamily: fontFamilies.bold,
      fontSize: 9,
      letterSpacing: 1,
    },
    storageError: {
      backgroundColor: theme.error,
      borderRadius: 10,
      color: theme.surface,
      fontFamily: fontFamilies.medium,
      marginBottom: 12,
      padding: 12,
    },
    searchField: {
      alignItems: "center",
      backgroundColor: theme.inputBackground,
      borderColor: theme.inputBorder,
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: "row",
      gap: 10,
      marginBottom: 18,
      minHeight: 48,
      paddingHorizontal: 14,
    },
    searchInput: {
      color: theme.ink,
      flex: 1,
      fontFamily: fontFamilies.regular,
      fontSize: 14,
      paddingVertical: 10,
    },
    emptyState: {
      alignItems: "center",
      borderColor: theme.chipBorder,
      borderRadius: 16,
      borderStyle: "dashed",
      borderWidth: 1,
      paddingHorizontal: 20,
      paddingVertical: 28,
    },
    emptyIcon: { marginBottom: 12 },
    emptyTitle: {
      color: theme.ink,
      fontFamily: fontFamilies.bold,
      fontSize: 16,
    },
    emptyText: {
      color: theme.subtle,
      fontFamily: fontFamilies.regular,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 6,
      textAlign: "center",
    },
    menuItem: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      marginBottom: 11,
      padding: 18,
    },
    menuItemTop: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    courseTag: {
      alignItems: "center",
      backgroundColor: theme.tagBackground,
      borderRadius: 5,
      flexDirection: "row",
      gap: 6,
      paddingHorizontal: 8,
      paddingVertical: 5,
    },
    courseTagText: {
      color: theme.primary,
      fontFamily: fontFamilies.bold,
      fontSize: 9,
      letterSpacing: 1,
    },
    price: {
      color: theme.primary,
      fontFamily: fontFamilies.bold,
      fontSize: 16,
    },
    itemName: {
      color: theme.ink,
      fontFamily: fontFamilies.bold,
      fontSize: 18,
      marginTop: 12,
    },
    itemDescription: {
      color: theme.muted,
      fontFamily: fontFamilies.regular,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 5,
    },
    actions: {
      borderTopColor: theme.chipBorder,
      borderTopWidth: 1,
      flexDirection: "row",
      gap: 18,
      marginTop: 15,
      paddingTop: 12,
    },
    editButton: { alignItems: "center", flexDirection: "row", gap: 7 },
    editButtonText: {
      color: theme.ink,
      fontFamily: fontFamilies.medium,
      fontSize: 13,
    },
    deleteButton: { alignItems: "center", flexDirection: "row", gap: 7 },
    deleteButtonText: {
      color: theme.error,
      fontFamily: fontFamilies.medium,
      fontSize: 13,
    },
    addButton: {
      alignItems: "center",
      backgroundColor: theme.ink,
      borderRadius: 11,
      marginTop: 13,
      paddingVertical: 15,
    },
    addButtonText: {
      color: theme.surface,
      fontFamily: fontFamilies.bold,
      fontSize: 15,
    },
    contactLink: { alignItems: "center", paddingVertical: 14 },
    contactLinkText: {
      color: theme.primary,
      fontFamily: fontFamilies.bold,
      fontSize: 14,
    },
  });
