import { Text, View } from "react-native";
import { Button } from "@/src/presentation/ui/Button";

type CapsuleEmptyStateProps = {
  onCreatePress: () => void;
};

export function CapsuleEmptyState({ onCreatePress }: CapsuleEmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="w-full max-w-md rounded-lg border border-border-subtle bg-surface p-6 dark:border-border-subtle-dark dark:bg-surface-dark">
        <Text className="text-center text-2xl font-bold text-text-primary dark:text-text-primary-dark">
          Tu Lovebox está vacío
        </Text>
        <Text className="mt-3 text-center text-base leading-6 text-text-secondary dark:text-text-secondary-dark">
          Las cápsulas son mensajes que se desbloquean en el momento que elijas. Crea la primera para
          empezar.
        </Text>
        <View className="mt-6">
          <Button label="Crear primera cápsula" onPress={onCreatePress} />
        </View>
      </View>
    </View>
  );
}
