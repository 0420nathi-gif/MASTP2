import { Link, useLocalSearchParams, useRouter } from "expo-router";
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
  useAppTheme,
} from "../constants/theme-context";

const createEmptyForm = () => ({
  name: "",
  description: "",
  course: "Main",
  price: "",
});

export default function Home() {
  const [forms, setForms] = useState(() => [createEmptyForm()]);
  const [errors, setErrors] = useState([{}]);
  const [confirmation, setConfirmation] = useState("");
  const {
    addItems,
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
      setForms([
        {
          name: item.name,
          description: item.description,
          course: item.course,
          price: item.price,
        },
      ]);
      setErrors([{}]);
      setConfirmation("");
      return;
    }

    if (initializedEditId.current !== null) {
      setForms([createEmptyForm()]);
      setErrors([{}]);
      setConfirmation("");
    }
    initializedEditId.current = null;
  }, [editId, isLoading, menuItems, router]);

  const updateField = (index, field, value) => {
    setForms((current) =>
      current.map((form, formIndex) =>
        formIndex === index ? { ...form, [field]: value } : form,
      ),
    );
    setErrors((current) =>
      current.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [field]: "" } : entry,
      ),
    );
    setConfirmation("");
  };

  const validateForms = () => {
    const nextErrors = forms.map((form) => {
      const formErrors = {};
      const price = Number(form.price.replace(",", "."));
      if (!form.name.trim()) formErrors.name = "Enter a dish name.";
      if (!form.description.trim())
        formErrors.description = "Add a short description.";
      if (!form.course) formErrors.course = "Choose a course.";
      if (!form.price.trim()) formErrors.price = "Enter a price.";
      else if (!Number.isFinite(price) || price <= 0)
        formErrors.price = "Use a price greater than 0.";
      return formErrors;
    });
    setErrors(nextErrors);
    const firstInvalidIndex = nextErrors.findIndex(
      (formErrors) => Object.keys(formErrors).length > 0,
    );
    if (firstInvalidIndex !== -1) {
      const firstInvalidField = ["name", "description", "price"].find(
        (field) => nextErrors[firstInvalidIndex][field],
      );
      if (firstInvalidField) {
        inputRefs.current[`${firstInvalidIndex}.${firstInvalidField}`]?.focus();
      }
      return false;
    }
    return true;
  };

  const addAnotherDish = () => {
    setForms((current) => [...current, createEmptyForm()]);
    setErrors((current) => [...current, {}]);
    setConfirmation("");
  };

  const removeDishForm = (index) => {
    setForms((current) =>
      current.filter((_, formIndex) => formIndex !== index),
    );
    setErrors((current) =>
      current.filter((_, formIndex) => formIndex !== index),
    );
    setConfirmation("");
  };

  const saveMenuItems = () => {
    if (isLoading || storageError) return;
    if (!validateForms()) return;
    const savedItems = forms.map((form) => ({
      name: form.name.trim(),
      description: form.description.trim(),
      course: form.course,
      price: Number(form.price.replace(",", ".")).toFixed(2),
    }));

    if (editingItem) {
      updateItem(editingItem.id, savedItems[0]);
      router.replace("/Menu");
      return;
    }

    addItems(savedItems);
    setForms([createEmptyForm()]);
    setErrors([{}]);
    setConfirmation(
      savedItems.length === 1
        ? `${savedItems[0].name} was added to your menu.`
        : `${savedItems.length} dishes were added to your menu.`,
    );
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
          <HelpTip title="Getting started">
            Add a dish name, description, course, and price. Use Add another
            dish to enter starters, mains, drinks, or desserts together, then
            save them all at once.
          </HelpTip>

          <View style={styles.formCard}>
            {forms.map((form, index) => (
              <View
                key={`dish-form-${index}`}
                style={index > 0 ? styles.additionalDishForm : undefined}
              >
                <View style={styles.dishFormHeading}>
                  <View>
                    <Text style={styles.sectionEyebrow}>
                      {editingItem
                        ? "EDIT DISH"
                        : forms.length > 1
                          ? `DISH ${index + 1}`
                          : "NEW DISH"}
                    </Text>
                    <Text style={styles.sectionTitle}>
                      {editingItem
                        ? "Update this dish"
                        : forms.length > 1
                          ? `Dish ${index + 1} details`
                          : "Add to the menu"}
                    </Text>
                  </View>
                  {forms.length > 1 && !editingItem ? (
                    <HoverablePressable
                      accessibilityRole="button"
                      accessibilityLabel={`Remove dish ${index + 1}`}
                      onPress={() => removeDishForm(index)}
                      style={styles.removeDishButton}
                    >
                      <Text style={styles.removeDishText}>Remove</Text>
                    </HoverablePressable>
                  ) : null}
                </View>
                <Field
                  label="Dish name"
                  value={form.name}
                  onChangeText={(value) => updateField(index, "name", value)}
                  placeholder="e.g. Charred lemon chicken"
                  error={errors[index]?.name}
                  inputRef={(ref) => {
                    inputRefs.current[`${index}.name`] = ref;
                  }}
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    inputRefs.current[`${index}.description`]?.focus()
                  }
                />
                <Field
                  label="Description"
                  value={form.description}
                  onChangeText={(value) =>
                    updateField(index, "description", value)
                  }
                  placeholder="What makes this dish special?"
                  error={errors[index]?.description}
                  multiline
                  inputRef={(ref) => {
                    inputRefs.current[`${index}.description`] = ref;
                  }}
                />

                <Text style={styles.label}>Course</Text>
                <View style={styles.courseRow}>
                  {foodCategories.map((category) => (
                    <HoverablePressable
                      key={category.name}
                      accessibilityRole="button"
                      accessibilityLabel={`${category.name} course for dish ${
                        index + 1
                      }`}
                      accessibilityState={{
                        selected: form.course === category.name,
                      }}
                      onPress={() =>
                        updateField(index, "course", category.name)
                      }
                      style={[
                        styles.courseChip,
                        form.course === category.name &&
                          styles.courseChipSelected,
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
                          form.course === category.name &&
                            styles.courseTextSelected,
                        ]}
                      >
                        {category.name}
                      </Text>
                    </HoverablePressable>
                  ))}
                </View>
                {errors[index]?.course ? (
                  <Text accessibilityLiveRegion="polite" style={styles.error}>
                    {errors[index].course}
                  </Text>
                ) : null}
                <Field
                  label="Price"
                  value={form.price}
                  onChangeText={(value) => updateField(index, "price", value)}
                  placeholder="0.00"
                  error={errors[index]?.price}
                  keyboardType="decimal-pad"
                  prefix="R"
                  inputRef={(ref) => {
                    inputRefs.current[`${index}.price`] = ref;
                  }}
                  returnKeyType={
                    index < forms.length - 1 ? "next" : "done"
                  }
                  onSubmitEditing={
                    index < forms.length - 1
                      ? () => inputRefs.current[`${index + 1}.name`]?.focus()
                      : saveMenuItems
                  }
                />
              </View>
            ))}

            {!editingItem ? (
              <HoverablePressable
                accessibilityRole="button"
                onPress={addAnotherDish}
                disabled={isLoading || Boolean(storageError)}
                style={styles.addAnotherButton}
              >
                <Text style={styles.addAnotherText}>+ Add another dish</Text>
              </HoverablePressable>
            ) : null}

            <HoverablePressable
              onPress={saveMenuItems}
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
                    : forms.length === 1
                      ? "+ Add dish to menu"
                      : `Add ${forms.length} dishes to menu`}
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
    dishFormHeading: {
      alignItems: "flex-start",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    additionalDishForm: {
      borderTopColor: theme.inputBorder,
      borderTopWidth: 1,
      marginTop: 22,
      paddingTop: 22,
    },
    removeDishButton: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 40,
      paddingHorizontal: 10,
    },
    removeDishText: {
      color: theme.error,
      fontFamily: fontFamilies.medium,
      fontSize: 13,
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
    addAnotherButton: {
      alignItems: "center",
      borderColor: theme.chipBorder,
      borderRadius: 11,
      borderWidth: 1,
      marginTop: 4,
      paddingVertical: 13,
    },
    addAnotherText: {
      color: theme.primary,
      fontFamily: fontFamilies.bold,
      fontSize: 14,
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
