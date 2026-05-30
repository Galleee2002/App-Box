import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import "react-native-reanimated";
import { useThemeStore } from "@/src/core/theme/store";
import "../global.css";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const mode = useThemeStore((state) => state.mode);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(mode);
  }, [mode, setColorScheme]);

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Info" }} />
      </Stack>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
    </>
  );
}
