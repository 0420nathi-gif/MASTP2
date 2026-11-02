import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";

export const fontFamilies = {
  regular: "Inter_400Regular",
  medium: "Inter_600SemiBold",
  bold: "DMSans_700Bold",
};

const ThemeContext = createContext(null);

function isNightTime() {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
}

export function ThemeProvider({ themes, children }) {
  const [isDark, setIsDark] = useState(isNightTime);
  const activeTheme = isDark ? themes.dark : themes.light;

  useEffect(() => {
    const updateTheme = () => setIsDark(isNightTime());
    const interval = setInterval(updateTheme, 60_000);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") updateTheme();
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        ...activeTheme,
        isDark,
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
