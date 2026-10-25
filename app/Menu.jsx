import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import HelpTip from "../components/HelpTip";
import AppNavigation from "../components/AppNavigation";
import {
  HoverablePressable,
  HoverableView,
} from "../components/InteractiveControls";
import {
  foodCategories,
  getCategoryIcon,
} from "../constants/food-categories";
import { useMenu } from "../constants/menu-context";
import {
  fontFamilies,
  ThemeToggle,
  useAppTheme,
} from "../constants/theme-context";
import { filterMenuItems } from "../constants/menu-utils.cjs";

export default function About() {
  const {
    menuItems,
    removeItem,
    toggleItemAvailability,
    isLoading,
    storageError,
    saveStatus,
  } = useMenu();
  const canModifyMenu = !isLoading && !storageError;
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const courseFilters = [
    "All",
    ...foodCategories.map((category) => category.name),
  ];
  const availabilityFilters = ["All", "Available", "Unavailable"];
  const filteredItems = useMemo(
    () => filterMenuItems(menuItems, search, courseFilter, availabilityFilter),
    [menuItems, search, courseFilter, availabilityFilter],
  );
  const hasActiveFilters =
    Boolean(search.trim()) ||
    courseFilter !== "All" ||
    availabilityFilter !== "All";

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
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemeToggle />
        <Text style={styles.eyebrow}>CURRENT MENU</Text>
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
        <Text
          accessibilityLiveRegion="polite"
          style={[
            styles.saveStatus,
            saveStatus === "error" && styles.saveStatusError,
          ]}
        >
          {isLoading
            ? "Loading saved menu…"
            : saveStatus === "saving"
              ? "Saving your menu…"
              : saveStatus === "error"
                ? "Menu changes could not be saved"
                : "Menu saved"}
        </Text>

        <HelpTip title="Manage your dishes">
          Search by dish name or description, then filter by course and
          availability. Edit, update stock status, or delete a dish here.
        </HelpTip>

        <HoverableView
          style={styles.searchField}
          hoverStyle={styles.searchFieldHovered}
        >
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
            <HoverablePressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              onPress={() => setSearch("")}
              style={styles.clearSearchButton}
            >
              <FontAwesome6 name="xmark" size={15} color={theme.muted} />
            </HoverablePressable>
          ) : null}
        </HoverableView>

        <Text style={styles.filterLabel}>COURSE</Text>
        <View
          style={styles.filterRow}
          accessibilityLabel="Filter menu by course"
        >
          {courseFilters.map((course) => (
            <HoverablePressable
              key={course}
              accessibilityRole="button"
              accessibilityLabel={`${course} course filter`}
              accessibilityState={{ selected: courseFilter === course }}
              onPress={() => setCourseFilter(course)}
              style={[
                styles.filterChip,
                courseFilter === course && styles.filterChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  courseFilter === course && styles.filterTextSelected,
                ]}
              >
                {course}
              </Text>
            </HoverablePressable>
          ))}
        </View>
        <Text style={styles.filterLabel}>AVAILABILITY</Text>
        <View
          style={[styles.filterRow, styles.availabilityFilters]}
          accessibilityLabel="Filter menu by availability"
        >
          {availabilityFilters.map((availability) => (
            <HoverablePressable
              key={availability}
              accessibilityRole="button"
              accessibilityLabel={`${availability} dishes filter`}
              accessibilityState={{
                selected: availabilityFilter === availability,
              }}
              onPress={() => setAvailabilityFilter(availability)}
              style={[
                styles.filterChip,
                availabilityFilter === availability &&
                  styles.filterChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  availabilityFilter === availability &&
                    styles.filterTextSelected,
                ]}
              >
                {availability}
              </Text>
            </HoverablePressable>
          ))}
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
              {hasActiveFilters
                ? "No dishes match these filters."
                : "Your menu is waiting."}
            </Text>
            <Text style={styles.emptyText}>
              {hasActiveFilters
                ? "Adjust your search or filters to see more dishes."
                : "Add a dish from the menu builder to see it here."}
            </Text>
            {hasActiveFilters ? (
              <HoverablePressable
                accessibilityRole="button"
                accessibilityLabel="Clear menu search and filters"
                onPress={() => {
                  setSearch("");
                  setCourseFilter("All");
                  setAvailabilityFilter("All");
                }}
                style={styles.clearFiltersButton}
              >
                <Text style={styles.clearFiltersText}>Clear filters</Text>
              </HoverablePressable>
            ) : null}
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
              <View
                style={[
                  styles.availabilityTag,
                  item.available === false && styles.unavailableTag,
                ]}
              >
                <FontAwesome6
                  name={
                    item.available === false ? "circle-xmark" : "circle-check"
                  }
                  size={12}
                  color={
                    item.available === false ? theme.error : theme.success
                  }
                />
                <Text
                  style={[
                    styles.availabilityText,
                    item.available === false && styles.unavailableText,
                  ]}
                >
                  {item.available === false ? "UNAVAILABLE" : "AVAILABLE"}
                </Text>
              </View>
              <View style={styles.actions}>
                <Link
                  href={{ pathname: "/home", params: { editId: item.id } }}
                  asChild
                >
                  <HoverablePressable
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${item.name}`}
                    disabled={!canModifyMenu}
                    style={styles.actionButton}
                  >
                    <FontAwesome6
                      name="pen"
                      size={12}
                      color={theme.ink}
                    />
                    <Text style={styles.editButtonText}>Edit</Text>
                  </HoverablePressable>
                </Link>
                <HoverablePressable
                  accessibilityRole="switch"
                  accessibilityLabel={
                    item.available === false
                      ? `Mark ${item.name} available`
                      : `Mark ${item.name} unavailable`
                  }
                  accessibilityState={{
                    checked: item.available !== false,
                    disabled: !canModifyMenu,
                  }}
                  disabled={!canModifyMenu}
                  onPress={() => toggleItemAvailability(item.id)}
                  style={styles.availabilityButton}
                >
                  <FontAwesome6
                    name={item.available === false ? "circle-check" : "ban"}
                    size={12}
                    color={theme.primary}
                  />
                  <Text style={styles.availabilityButtonText}>
                    {item.available === false ? "Available" : "Unavailable"}
                  </Text>
                </HoverablePressable>
                <HoverablePressable
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
                </HoverablePressable>
              </View>
            </View>
          ))
        )}

        <Link href="/home" asChild>
          <HoverablePressable
            disabled={!canModifyMenu}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+ Add another dish</Text>
          </HoverablePressable>
        </Link>
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
    saveStatus: {
      color: theme.muted,
      fontFamily: fontFamilies.regular,
      fontSize: 12,
      marginBottom: 12,
    },
    saveStatusError: { color: theme.error },
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
    searchFieldHovered: {
      borderColor: theme.primary,
      backgroundColor: theme.surface,
    },
    searchInput: {
      color: theme.ink,
      flex: 1,
      fontFamily: fontFamilies.regular,
      fontSize: 14,
      paddingVertical: 10,
    },
    clearSearchButton: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
      minWidth: 44,
    },
    filterLabel: {
      color: theme.muted,
      fontFamily: fontFamilies.bold,
      fontSize: 10,
      letterSpacing: 1,
      marginBottom: 7,
    },
    filterRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 7,
      marginBottom: 14,
    },
    availabilityFilters: { marginBottom: 18 },
    filterChip: {
      alignItems: "center",
      backgroundColor: theme.inputBackground,
      borderColor: theme.chipBorder,
      borderRadius: 20,
      borderWidth: 1,
      justifyContent: "center",
      minHeight: 44,
      paddingHorizontal: 13,
    },
    filterChipSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterText: {
      color: theme.ink,
      fontFamily: fontFamilies.medium,
      fontSize: 12,
    },
    filterTextSelected: {
      color: theme.surface,
      fontFamily: fontFamilies.bold,
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
    clearFiltersButton: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 12,
      minHeight: 44,
      paddingHorizontal: 14,
    },
    clearFiltersText: {
      color: theme.primary,
      fontFamily: fontFamilies.bold,
      fontSize: 13,
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
    availabilityTag: {
      alignSelf: "flex-start",
      backgroundColor: theme.tagBackground,
      borderRadius: 20,
      flexDirection: "row",
      gap: 6,
      marginTop: 11,
      paddingHorizontal: 9,
      paddingVertical: 6,
    },
    unavailableTag: { backgroundColor: `${theme.error}18` },
    availabilityText: {
      color: theme.success,
      fontFamily: fontFamilies.bold,
      fontSize: 9,
      letterSpacing: 0.6,
    },
    unavailableText: { color: theme.error },
    actions: {
      borderTopColor: theme.chipBorder,
      borderTopWidth: 1,
      flexDirection: "row",
      gap: 12,
      marginTop: 15,
      paddingTop: 12,
    },
    actionButton: {
      alignItems: "center",
      flexDirection: "row",
      gap: 5,
      justifyContent: "center",
      minHeight: 44,
      paddingHorizontal: 5,
    },
    editButtonText: {
      color: theme.ink,
      fontFamily: fontFamilies.medium,
      fontSize: 13,
    },
    availabilityButton: {
      alignItems: "center",
      flexDirection: "row",
      gap: 5,
      justifyContent: "center",
      minHeight: 44,
      paddingHorizontal: 5,
    },
    availabilityButtonText: {
      color: theme.primary,
      fontFamily: fontFamilies.medium,
      fontSize: 12,
    },
    deleteButton: {
      alignItems: "center",
      flexDirection: "row",
      gap: 5,
      justifyContent: "center",
      minHeight: 44,
      paddingHorizontal: 5,
    },
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
  });
