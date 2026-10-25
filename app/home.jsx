import {
  Link,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
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
  const { addItem, updateItem, menuItems, isLoading, storageError } = useMenu();
  const { editId } = useLocalSearchParams();
  const router = useRouter();
  const initializedEditId = useRef(null);
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
    Alert.alert("Menu updated", `${savedItem.name} is now on the menu.`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style={theme.background === "#20231F" ? "light" : "dark"} />
      {storageError ? (
        <Text style={styles.storageError}>{storageError}</Text>
      ) : null}
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
              {foodCategories.map((category) => (
                <Pressable
                  key={category.name}
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
                      form.course === category.name ? theme.surface : theme.primary
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
    viewMenuButton: {
      alignItems: "center",
      borderColor: theme.ink,
      borderRadius: 11,
      borderWidth: 1,
      marginTop: 24,
      paddingVertical: 14,
    },
    viewMenuText: {
      color: theme.ink,
      fontFamily: fontFamilies.bold,
      fontSize: 14,
    },
    contactLink: { alignItems: "center", paddingVertical: 14 },
    contactLinkText: {
      color: theme.primary,
      fontFamily: fontFamilies.bold,
      fontSize: 14,
    },
  });
