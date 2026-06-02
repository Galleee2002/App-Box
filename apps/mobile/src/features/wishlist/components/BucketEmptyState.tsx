import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { Button } from "@/src/presentation/ui/Button";

type BucketEmptyStateProps = {
  onCreatePress: () => void;
  accentColor: string;
};

export function BucketEmptyState({ onCreatePress, accentColor }: BucketEmptyStateProps) {
  return (
    <View className="min-h-full flex-1 items-center justify-center px-6 py-12">
      <View
        accessible={false}
        className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-accent-ghost dark:bg-accent-ghost-dark"
      >
        <Ionicons name="flag-outline" size={32} color={accentColor} />
      </View>
      <Text className="text-center text-lg font-semibold text-text-primary dark:text-text-primary-dark">
        Vuestro bucket está vacío
      </Text>
      <Text className="mt-2 max-w-xs text-center text-base leading-6 text-text-secondary dark:text-text-secondary-dark">
        Guardad aquí los planes que queréis hacer juntos: viajes, citas, comidas y hitos especiales.
      </Text>
      <View className="mt-6 w-full max-w-xs">
        <Button label="Añadir primer plan" onPress={onCreatePress} />
      </View>
    </View>
  );
}
