import { Text, View } from "react-native";
import { CapsuleUnlockHintView } from "./CapsuleUnlockHintView";

type LockedCapsuleDetailProps = {
  title: string;
  countdownLabel: string;
  countdownA11y: string;
  formattedDate: string;
};

export function LockedCapsuleDetail({
  title,
  countdownLabel,
  countdownA11y,
  formattedDate,
}: LockedCapsuleDetailProps) {
  return (
    <View className="flex-1 px-6 py-6">
      <Text className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">{title}</Text>
      <View className="mt-6 rounded-lg border border-border-subtle bg-surface-muted p-6 dark:border-border-subtle-dark dark:bg-surface-muted-dark">
        <Text className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          Esta cápsula aún está cerrada
        </Text>
        <View className="mt-4">
          <CapsuleUnlockHintView
            countdownLabel={countdownLabel}
            countdownA11y={countdownA11y}
            formattedDate={formattedDate}
            variant="prominent"
          />
        </View>
      </View>
    </View>
  );
}
