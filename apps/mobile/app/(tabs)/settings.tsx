import { getThemeTokens } from "@/src/core/theme";
import { useThemeStore } from "@/src/core/theme/store";
import { Switch, Text, View } from "react-native";

export default function SettingsScreen() {
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const theme = getThemeTokens(mode);

  return (
    <View className="flex-1 bg-background px-6 py-8 dark:bg-background-dark">
      <View className="rounded-lg border border-border-subtle bg-surface p-5 dark:border-border-subtle-dark dark:bg-surface-dark">
        <Text className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">Tema</Text>
        <Text className="mt-2 text-sm leading-5 text-text-secondary dark:text-text-secondary-dark">
          Activa modo oscuro o claro para toda la app.
        </Text>

        <View className="mt-5 flex-row items-center justify-between rounded-md bg-accent-ghost px-4 py-3 dark:bg-accent-ghost-dark">
          <Text className="text-base font-medium text-text-primary dark:text-text-primary-dark">
            {mode === "dark" ? "Modo oscuro" : "Modo claro"}
          </Text>
          <Switch
            value={mode === "dark"}
            onValueChange={toggleMode}
            thumbColor={theme.colors.accentText}
            trackColor={{ false: theme.colors.surfaceMuted, true: theme.colors.accent }}
          />
        </View>
      </View>
    </View>
  );
}
