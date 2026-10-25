import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import DMSansBold from "@expo-google-fonts/dm-sans/700Bold/DMSans_700Bold.ttf";
import InterRegular from "@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf";
import InterSemiBold from "@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf";
import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { colors } from "../constants/color";
import { MenuProvider } from "../constants/menu-context";
import { ThemeProvider } from "../constants/theme-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme] ?? colors.light;
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular: InterRegular,
    Inter_600SemiBold: InterSemiBold,
    DMSans_700Bold: DMSansBold,
  });

  useEffect(() => {
    if (fontError) console.error("Failed to load the Inter font.", fontError);
  }, [fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider themes={colors} colorScheme={colorScheme}>
      <MenuProvider>
        <Stack
          initialRouteName="index"
          screenOptions={{
            headerStyle: { backgroundColor: theme.navigationBackground },
            headerTintColor: theme.text,
            headerTitleStyle: { fontWeight: "bold" },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Home"
            options={{
              title: "Home",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Contact"
            options={{ title: "Contact", headerShown: false }}
          />
          <Stack.Screen
            name="Stats"
            options={{ title: "Menu statistics", headerShown: false }}
          />
        </Stack>
      </MenuProvider>
    </ThemeProvider>
  );
}
