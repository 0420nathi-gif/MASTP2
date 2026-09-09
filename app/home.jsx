import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
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
import { useMenu } from "../constants/menu-context";
import { ThemeToggle, useAppTheme } from "../constants/theme-context";

const courses = ["Starter", "Main", "Dessert", "Drinks"];

const emptyForm = { name: "", description: "", course: "Main", price: "" };

export default function Home() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState("");
  const { addItem, menuItems } = useMenu();
  const theme = useAppTheme();
  const styles = createStyles(theme);

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
    return Object.keys(nextErrors).length === 0;
  };

  const addMenuItem = () => {
    if (!validate()) return;
    const newItem = {
      name: form.name.trim(),
      description: form.description.trim(),
      course: form.course,
      price: Number(form.price.replace(",", ".")).toFixed(2),
    };
    addItem(newItem);
    setForm(emptyForm);
    setErrors({});
    setConfirmation(`${newItem.name} was added to your menu.`);
    Alert.alert("Menu updated", `${newItem.name} is now on the menu.`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style={theme.background === "#20231F" ? "light" : "dark"} />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>FOODIE'S MENU MANAGER</Text>
              <Text style={styles.title}>By Christoffel.</Text>
              <Text style={styles.subtitle}>
                For every dish, detail, and price ready for service.
              </Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countNumber}>{menuItems.length}</Text>
              <Text style={styles.countLabel}>DISHES</Text>
            </View>
          </View>
          <ThemeToggle />

          <View style={styles.formCard}>
            <Text style={styles.sectionEyebrow}>NEW DISH</Text>
            <Text style={styles.sectionTitle}>Add to the menu</Text>
            <Field
              label="Dish name"
              value={form.name}
              onChangeText={(value) => updateField("name", value)}
              placeholder="e.g. Charred lemon chicken"
              error={errors.name}
            />
            <Field
              label="Description"
              value={form.description}
              onChangeText={(value) => updateField("description", value)}
              placeholder="What makes this dish special?"
              error={errors.description}
              multiline
            />

            <Text style={styles.label}>Course</Text>
            <View style={styles.courseRow}>
              {courses.map((course) => (
                <Pressable
                  key={course}
                  onPress={() => updateField("course", course)}
                  style={[
                    styles.courseChip,
                    form.course === course && styles.courseChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.courseText,
                      form.course === course && styles.courseTextSelected,
                    ]}
                  >
                    {course}
                  </Text>
                </Pressable>
              ))}
            </View>
            {errors.course ? (
              <Text style={styles.error}>{errors.course}</Text>
            ) : null}
            <Field
              label="Price"
              value={form.price}
              onChangeText={(value) => updateField("price", value)}
              placeholder="0.00"
              error={errors.price}
              keyboardType="decimal-pad"
              prefix="R"
            />

            <Pressable
              onPress={addMenuItem}
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.addButtonText}>+ Add dish to menu</Text>
            </Pressable>
            {confirmation ? (
              <View style={styles.confirmation}>
                <Text style={styles.confirmationMark}>✓</Text>
                <Text style={styles.confirmationText}>{confirmation}</Text>
              </View>
            ) : null}
          </View>

          <Link href="/Menu" asChild>
            <Pressable style={styles.viewMenuButton}>
              <Text style={styles.viewMenuText}>View current menu →</Text>
            </Pressable>
          </Link>
          <Link href="/Contact" asChild>
            <Pressable style={styles.contactLink}>
              <Text style={styles.contactLinkText}>
                Contact kitchen support
              </Text>
            </Pressable>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
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
}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputShell, error && styles.inputError]}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.placeholder}
          style={[styles.input, multiline && styles.textArea]}
          multiline={multiline}
          keyboardType={keyboardType}
          textAlignVertical={multiline ? "top" : "center"}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 1.5,
      marginBottom: 10,
    },
    title: {
      color: theme.ink,
      fontSize: 32,
      fontWeight: "800",
      lineHeight: 36,
      maxWidth: 260,
    },
    subtitle: {
      color: theme.muted,
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
    countNumber: { color: theme.accent, fontSize: 23, fontWeight: "800" },
    countLabel: {
      color: theme.background,
      fontSize: 9,
      fontWeight: "800",
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
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 1.4,
      marginBottom: 5,
    },
    sectionTitle: {
      color: theme.ink,
      fontSize: 22,
      fontWeight: "800",
      marginBottom: 18,
    },
    fieldGroup: { marginBottom: 16 },
    label: {
      color: theme.label,
      fontSize: 13,
      fontWeight: "700",
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
    input: { flex: 1, color: theme.ink, fontSize: 15, paddingVertical: 0 },
    textArea: { minHeight: 77, paddingTop: 13, paddingBottom: 13 },
    prefix: { color: theme.muted, fontSize: 16, marginRight: 4 },
    error: { color: theme.error, fontSize: 12, marginTop: 6 },
    courseRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    courseChip: {
      borderWidth: 1,
      borderColor: theme.chipBorder,
      borderRadius: 20,
      paddingVertical: 9,
      paddingHorizontal: 14,
      backgroundColor: theme.inputBackground,
    },
    courseChipSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },
    courseText: { color: theme.muted, fontSize: 13, fontWeight: "700" },
    courseTextSelected: { color: theme.surface },
    addButton: {
      alignItems: "center",
      backgroundColor: theme.ink,
      borderRadius: 11,
      marginTop: 5,
      paddingVertical: 15,
    },
    buttonPressed: { opacity: 0.8 },
    addButtonText: { color: theme.surface, fontSize: 15, fontWeight: "800" },
    confirmation: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 14,
    },
    confirmationMark: {
      color: theme.success,
      fontSize: 17,
      fontWeight: "800",
      marginRight: 7,
    },
    confirmationText: { color: theme.success, fontSize: 13, fontWeight: "700" },
    viewMenuButton: {
      alignItems: "center",
      borderColor: theme.ink,
      borderRadius: 11,
      borderWidth: 1,
      marginTop: 24,
      paddingVertical: 14,
    },
    viewMenuText: { color: theme.ink, fontSize: 14, fontWeight: "800" },
    contactLink: { alignItems: "center", paddingVertical: 14 },
    contactLinkText: { color: theme.primary, fontSize: 14, fontWeight: "800" },
  });
