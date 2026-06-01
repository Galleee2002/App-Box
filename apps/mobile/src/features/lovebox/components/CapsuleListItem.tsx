import { Pressable, Text, View } from "react-native";

type CapsuleListItemProps = {
  title: string;
  isLocked: boolean;
  unlockAt: Date;
  onPress: () => void;
};

function formatUnlockAt(date: Date): string {
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function CapsuleListItem({ title, isLocked, unlockAt, onPress }: CapsuleListItemProps) {
  const badgeLabel = isLocked ? "Bloqueada" : "Desbloqueada";
  const badgeA11y = isLocked
    ? `Cápsula bloqueada. Se desbloquea el ${formatUnlockAt(unlockAt)}`
    : "Cápsula desbloqueada";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${badgeA11y}`}
      className="min-h-[44px] flex-row items-center justify-between rounded-lg border border-border-subtle bg-surface px-4 py-3 dark:border-border-subtle-dark dark:bg-surface-dark"
    >
      <View className="mr-3 flex-1">
        <Text className="text-base font-semibold text-text-primary dark:text-text-primary-dark" numberOfLines={1}>
          {title}
        </Text>
        <Text className="mt-1 text-sm text-text-tertiary dark:text-text-tertiary-dark">
          {isLocked ? `Desbloqueo: ${formatUnlockAt(unlockAt)}` : "Lista para leer"}
        </Text>
      </View>
      <View
        accessibilityLabel={badgeLabel}
        className={`rounded-pill px-3 py-1 ${
          isLocked
            ? "bg-accent-ghost dark:bg-accent-ghost-dark"
            : "bg-surface-muted dark:bg-surface-muted-dark"
        }`}
      >
        <Text
          className={`text-xs font-semibold ${
            isLocked ? "text-accent dark:text-accent-dark" : "text-success dark:text-success-dark"
          }`}
        >
          {badgeLabel}
        </Text>
      </View>
    </Pressable>
  );
}
