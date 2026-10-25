import React, { createContext, useContext, useState } from "react";
import { Pressable, Text } from "react-native";

export const fontFamilies = {
  regular: "Inter_400Regular",
  medium: "Inter_600SemiBold",
  bold: "DMSans_700Bold",
};

const ThemeContext = createContext(null);

export function ThemeProvider({ themes, colorScheme, children }) {
  const [isDark, setIsDark] = useState(colorScheme === "dark");
  const activeTheme = isDark ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider
      value={{
        ...activeTheme,
        isDark,
        toggleTheme: () => setIsDark((current) => !current),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("useAppTheme must be used inside ThemeProvider");
  return theme;
}

export function ThemeToggle() {
  const { isDark, toggleTheme, ink, surface } = useAppTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      accessibilityRole="button"
      accessibilityLabel={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
      style={{
        alignSelf: "flex-start",
        borderColor: ink,
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 13,
        paddingVertical: 8,
      }}
    >
      <Text
        style={{
          color: ink,
          fontFamily: fontFamilies.bold,
          fontSize: 12,
        }}
      >
        {isDark ? "Light mode" : "Dark mode"}
      </Text>
    </Pressable>
  );
}
