import { Stack, useRouter } from "expo-router";
import { Text } from "react-native";
import { CreateCapsuleContainer } from "@/src/features/lovebox/containers/CreateCapsuleContainer";
import { getThemeTokens } from "@/src/core/theme";
import { useThemeStore } from "@/src/core/theme/store";
import { ScreenBackButton } from "@/src/presentation/navigation/ScreenBackTitle";

export default function CreateCapsuleScreen() {
  const router = useRouter();
  const mode = useThemeStore((state) => state.mode);
  const theme = getThemeTokens(mode);

  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerTitleAlign: "center",
          headerLeft: () => (
            <ScreenBackButton onBack={() => router.back()} tintColor={theme.colors.textPrimary} />
          ),
          headerTitle: () => (
            <Text
              numberOfLines={1}
              className="text-center text-lg font-semibold text-text-primary dark:text-text-primary-dark"
            >
              Nueva cápsula
            </Text>
          ),
        }}
      />
      <CreateCapsuleContainer />
    </>
  );
}
