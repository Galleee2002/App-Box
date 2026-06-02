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
          title: "Cápsulas",
          tabBarIcon: ({ color }) => <Ionicons name="cube" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="playground"
        options={{
          title: "Planes",
          tabBarIcon: ({ color }) => <Ionicons name="flag" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Emociones",
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
