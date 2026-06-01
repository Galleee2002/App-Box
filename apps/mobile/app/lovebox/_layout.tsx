import { Stack } from "expo-router";
import { getThemeTokens } from "@/src/core/theme";
import { useThemeStore } from "@/src/core/theme/store";

export default function LoveboxLayout() {
  const mode = useThemeStore((state) => state.mode);
  const theme = getThemeTokens(mode);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: { color: theme.colors.textPrimary },
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="create" options={{ title: "Nueva cápsula" }} />
      <Stack.Screen name="[id]" options={{ title: "Cápsula" }} />
    </Stack>
  );
}
