import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { getThemeTokens } from "@/src/core/theme";
import { useThemeStore } from "@/src/core/theme/store";

export default function TabLayout() {
  const mode = useThemeStore((state) => state.mode);
  const theme = getThemeTokens(mode);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTitleStyle: { color: theme.colors.textPrimary },
        tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.borderSubtle },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textTertiary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="playground"
        options={{
          title: "Playground",
          tabBarIcon: ({ color }) => <Ionicons name="hammer" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
