import {
  Link,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import HelpTip from "../components/HelpTip";
import AppNavigation from "../components/AppNavigation";
import {
  HoverablePressable,
  HoverableView,
} from "../components/InteractiveControls";
import { foodCategories } from "../constants/food-categories";
import { useMenu } from "../constants/menu-context";
import {
  fontFamilies,
  ThemeToggle,
  useAppTheme,
} from "../constants/theme-context";

const emptyForm = { name: "", description: "", course: "Main", price: "" };

export default function Home() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState("");
  const {
    addItem,
    updateItem,
    menuItems,
    isLoading,
    storageError,
    saveStatus,
  } = useMenu();
  const { editId } = useLocalSearchParams();
  const router = useRouter();
  const initializedEditId = useRef(null);
  const inputRefs = useRef({});
  const editingItem =
    typeof editId === "string"
      ? menuItems.find((item) => item.id === editId)
      : null;
  const theme = useAppTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    if (isLoading) return;

    if (typeof editId === "string") {
      if (initializedEditId.current === editId) return;
      const item = menuItems.find((menuItem) => menuItem.id === editId);
      if (!item) {
        router.replace("/Menu");
        return;
      }

      initializedEditId.current = editId;
      setForm({
        name: item.name,
        description: item.description,
        course: item.course,
        price: item.price,
      });
      setErrors({});
      setConfirmation("");
      return;
    }

    if (initializedEditId.current !== null) {
      setForm(emptyForm);
      setErrors({});
      setConfirmation("");
    }
    initializedEditId.current = null;
  }, [editId, isLoading, menuItems, router]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: "" }));
    setConfirmation("");
  };

  const validate = () => {
    const nextErrors = {};
    const price = Number(form.price.replace(",", "."));
    if (!form.name.trim()) nextErrors.name = "Enter a dish name.";
    if (!form.description.trim())
      nextErrors.description = "Add a short description.";
    if (!form.course) nextErrors.course = "Choose a course.";
    if (!form.price.trim()) nextErrors.price = "Enter a price.";
    else if (!Number.isFinite(price) || price <= 0)
      nextErrors.price = "Use a price greater than 0.";
    setErrors(nextErrors);
    const firstInvalidField = ["name", "description", "price"].find(
      (field) => nextErrors[field],
    );
    if (firstInvalidField) inputRefs.current[firstInvalidField]?.focus();
    return Object.keys(nextErrors).length === 0;
  };

  const saveMenuItem = () => {
    if (isLoading || storageError) return;
    if (!validate()) return;
    const savedItem = {
      name: form.name.trim(),
      description: form.description.trim(),
      course: form.course,
      price: Number(form.price.replace(",", ".")).toFixed(2),
    };

    if (editingItem) {
      updateItem(editingItem.id, savedItem);
      router.replace("/Menu");
      return;
    }

    addItem(savedItem);
    setForm(emptyForm);
    setErrors({});
    setConfirmation(`${savedItem.name} was added to your menu.`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      {storageError ? (
        <Text style={styles.storageError}>{storageError}</Text>
      ) : null}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemeToggle />
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>FOODIE'S MENU MANAGER</Text>
              <Text style={styles.title}>By Sisonke.</Text>
              <Text style={styles.subtitle}>
                For every dish, detail, and price ready for service.
              </Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countNumber}>{menuItems.length}</Text>
              <Text style={styles.countLabel}>DISHES</Text>
            </View>
          </View>
          <View style={styles.quickNavigation}>
            <Link href="/Menu" asChild>
              <HoverablePressable
                accessibilityRole="link"
                style={styles.quickNavigationButton}
              >
                <FontAwesome6 name="utensils" size={14} color={theme.primary} />
                <Text style={styles.quickNavigationText}>Menu</Text>
              </HoverablePressable>
            </Link>
            <Link href="/Stats" asChild>
              <HoverablePressable
                accessibilityRole="link"
                style={styles.quickNavigationButton}
              >
                <FontAwesome6
                  name="chart-simple"
                  size={14}
                  color={theme.primary}
                />
                <Text style={styles.quickNavigationText}>Statistics</Text>
              </HoverablePressable>
            </Link>
          </View>
          <HelpTip title="Getting started">
            Add a dish name, description, course, and price, then tap Add dish.
            Your menu is saved automatically.
          </HelpTip>

          <View style={styles.formCard}>
            <Text style={styles.sectionEyebrow}>
              {editingItem ? "EDIT DISH" : "NEW DISH"}
            </Text>
            <Text style={styles.sectionTitle}>
              {editingItem ? "Update this dish" : "Add to the menu"}
            </Text>
            <Field
              label="Dish name"
              value={form.name}
              onChangeText={(value) => updateField("name", value)}
              placeholder="e.g. Charred lemon chicken"
              error={errors.name}
              inputRef={(ref) => {
                inputRefs.current.name = ref;
              }}
              returnKeyType="next"
              onSubmitEditing={() => inputRefs.current.description?.focus()}
            />
            <Field
              label="Description"
              value={form.description}
              onChangeText={(value) => updateField("description", value)}
              placeholder="What makes this dish special?"
              error={errors.description}
              multiline
              inputRef={(ref) => {
                inputRefs.current.description = ref;
              }}
            />

            <Text style={styles.label}>Course</Text>
            <View style={styles.courseRow}>
              {foodCategories.map((category) => (
                <HoverablePressable
                  key={category.name}
                  accessibilityRole="button"
                  accessibilityLabel={`${category.name} course`}
                  accessibilityState={{
                    selected: form.course === category.name,
                  }}
                  onPress={() => updateField("course", category.name)}
                  style={[
                    styles.courseChip,
                    form.course === category.name && styles.courseChipSelected,
                  ]}
                >
                  <FontAwesome6
                    name={category.icon}
                    size={13}
                    color={
                      form.course === category.name
                        ? theme.surface
                        : theme.primary
                    }
                  />
                  <Text
                    style={[
                      styles.courseText,
                      form.course === category.name && styles.courseTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </HoverablePressable>
              ))}
            </View>
            {errors.course ? (
              <Text accessibilityLiveRegion="polite" style={styles.error}>
                {errors.course}
              </Text>
            ) : null}
            <Field
              label="Price"
              value={form.price}
              onChangeText={(value) => updateField("price", value)}
              placeholder="0.00"
              error={errors.price}
              keyboardType="decimal-pad"
              prefix="R"
              inputRef={(ref) => {
                inputRefs.current.price = ref;
              }}
              returnKeyType="done"
              onSubmitEditing={saveMenuItem}
            />

            <HoverablePressable
              onPress={saveMenuItem}
              disabled={isLoading || Boolean(storageError)}
              style={({ pressed }) => [
                styles.addButton,
                (pressed || isLoading || storageError) && styles.buttonPressed,
              ]}
            >
              <Text style={styles.addButtonText}>
                {isLoading
                  ? "Loading saved menu..."
                  : editingItem
                    ? "Save changes"
                    : "+ Add dish to menu"}
              </Text>
            </HoverablePressable>
            {confirmation ? (
              <View style={styles.confirmation}>
                <Text style={styles.confirmationMark}>✓</Text>
                <Text
                  accessibilityLiveRegion="polite"
                  style={styles.confirmationText}
                >
                  {confirmation}
                </Text>
              </View>
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
            {confirmation ? (
              <Link href="/Menu" asChild>
                <HoverablePressable
                  accessibilityRole="link"
                  style={styles.confirmationAction}
                >
                  <Text style={styles.confirmationActionText}>
                    View your menu
                  </Text>
                </HoverablePressable>
              </Link>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AppNavigation />
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline,
  keyboardType,
  prefix,
  inputRef,
  returnKeyType,
  onSubmitEditing,
}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <HoverableView
        style={[styles.inputShell, error && styles.inputError]}
        hoverStyle={error ? null : styles.inputHovered}
      >
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          ref={inputRef}
          accessibilityLabel={label}
          accessibilityHint={error || undefined}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.placeholder}
          style={[styles.input, multiline && styles.textArea]}
          multiline={multiline}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          textAlignVertical={multiline ? "top" : "center"}
        />
      </HoverableView>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    keyboardView: { flex: 1 },
    content: { padding: 24, paddingBottom: 44 },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 26,
    },
    eyebrow: {
      color: theme.primary,
      fontFamily: fontFamilies.bold,
      fontSize: 11,
      letterSpacing: 1.5,
      marginBottom: 10,
    },
    title: {
      color: theme.ink,
      fontFamily: fontFamilies.bold,
      fontSize: 32,
      lineHeight: 36,
      maxWidth: 260,
    },
    subtitle: {
      color: theme.muted,
      fontFamily: fontFamilies.regular,
      fontSize: 15,
      lineHeight: 21,
      marginTop: 9,
      maxWidth: 260,
    },
    countBadge: {
      backgroundColor: theme.ink,
      width: 67,
      height: 67,
      borderRadius: 34,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 5,
    },
    quickNavigation: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 18,
      marginTop: -12,
    },
    quickNavigationButton: {
      alignItems: "center",
      backgroundColor: theme.surface,
      borderColor: theme.chipBorder,
      borderRadius: 10,
      borderWidth: 1,
      flexDirection: "row",
      gap: 8,
      minHeight: 44,
      paddingHorizontal: 14,
    },
    quickNavigationText: {
      color: theme.ink,
      fontFamily: fontFamilies.medium,
      fontSize: 13,
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
    formCard: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 20,
      shadowColor: theme.ink,
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 7 },
      elevation: 3,
    },
    sectionEyebrow: {
      color: theme.primary,
      fontFamily: fontFamilies.bold,
      fontSize: 10,
      letterSpacing: 1.4,
      marginBottom: 5,
    },
    sectionTitle: {
      color: theme.ink,
      fontFamily: fontFamilies.bold,
      fontSize: 22,
      marginBottom: 18,
    },
    fieldGroup: { marginBottom: 16 },
    label: {
      color: theme.label,
      fontFamily: fontFamilies.medium,
      fontSize: 13,
      marginBottom: 8,
    },
    inputShell: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 49,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: 11,
      backgroundColor: theme.inputBackground,
      paddingHorizontal: 13,
    },
    inputError: { borderColor: theme.error },
    inputHovered: {
      borderColor: theme.primary,
      backgroundColor: theme.surface,
    },
    input: {
      flex: 1,
      color: theme.ink,
      fontFamily: fontFamilies.regular,
      fontSize: 15,
      paddingVertical: 0,
    },
    textArea: { minHeight: 77, paddingTop: 13, paddingBottom: 13 },
    prefix: {
      color: theme.muted,
      fontFamily: fontFamilies.regular,
      fontSize: 16,
      marginRight: 4,
    },
    error: {
      color: theme.error,
      fontFamily: fontFamilies.regular,
      fontSize: 12,
      marginTop: 6,
    },
    storageError: {
      backgroundColor: theme.error,
      color: theme.surface,
      fontFamily: fontFamilies.medium,
      padding: 12,
    },
    courseRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    courseChip: {
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.chipBorder,
      borderRadius: 20,
      paddingVertical: 9,
      paddingHorizontal: 14,
      minHeight: 44,
      backgroundColor: theme.inputBackground,
      flexDirection: "row",
      gap: 7,
    },
    courseChipSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },
    courseText: {
      color: theme.muted,
      fontFamily: fontFamilies.medium,
      fontSize: 13,
    },
    courseTextSelected: { color: theme.surface },
    addButton: {
      alignItems: "center",
      backgroundColor: theme.ink,
      borderRadius: 11,
      marginTop: 5,
      paddingVertical: 15,
    },
    buttonPressed: { opacity: 0.8 },
    addButtonText: {
      color: theme.surface,
      fontFamily: fontFamilies.bold,
      fontSize: 15,
    },
    confirmation: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 14,
    },
    confirmationMark: {
      color: theme.success,
      fontFamily: fontFamilies.bold,
      fontSize: 17,
      marginRight: 7,
    },
    confirmationText: {
      color: theme.success,
      fontFamily: fontFamilies.medium,
      fontSize: 13,
    },
    saveStatus: {
      color: theme.muted,
      fontFamily: fontFamilies.regular,
      fontSize: 12,
      marginTop: 12,
      textAlign: "center",
    },
    saveStatusError: { color: theme.error },
    confirmationAction: {
      alignItems: "center",
      minHeight: 44,
      justifyContent: "center",
      marginTop: 4,
    },
    confirmationActionText: {
      color: theme.primary,
      fontFamily: fontFamilies.bold,
      fontSize: 14,
    },
  });
