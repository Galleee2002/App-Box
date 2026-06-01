import { Text, View } from "react-native";

type LockedCapsuleDetailProps = {
  title: string;
  unlockAt: Date;
};

function formatUnlockAt(date: Date): string {
  return date.toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });
}

export function LockedCapsuleDetail({ title, unlockAt }: LockedCapsuleDetailProps) {
  return (
    <View className="flex-1 px-6 py-6">
      <Text className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">{title}</Text>
      <View className="mt-6 rounded-lg border border-border-subtle bg-surface-muted p-6 dark:border-border-subtle-dark dark:bg-surface-muted-dark">
        <Text className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          Esta cápsula aún está cerrada
        </Text>
        <Text className="mt-3 text-base leading-6 text-text-secondary dark:text-text-secondary-dark">
          El mensaje se revelará el {formatUnlockAt(unlockAt)}.
        </Text>
      </View>
    </View>
  );
}
