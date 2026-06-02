import { Pressable, Text, View } from "react-native";
import { CapsuleUnlockHintView } from "./CapsuleUnlockHintView";
import { useUnlockCountdown } from "./useUnlockCountdown";

type CapsuleListItemProps = {
  title: string;
  isLocked: boolean;
  unlockAt: Date;
  onPress: () => void;
};

export function CapsuleListItem({ title, isLocked, unlockAt, onPress }: CapsuleListItemProps) {
  const { isLocked: isLockedNow, countdownLabel, countdownA11y, formattedDate } = useUnlockCountdown(unlockAt);
  const showingLocked = isLocked && isLockedNow;
  const badgeLabel = showingLocked ? "Bloqueada" : "Desbloqueada";
  const badgeA11y = showingLocked
    ? `Cápsula bloqueada. Cuenta atrás: ${countdownA11y}. Se desbloquea el ${formattedDate}.`
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
        <View className="mt-1">
          {showingLocked ? (
            <CapsuleUnlockHintView
              countdownLabel={countdownLabel}
              countdownA11y={countdownA11y}
              formattedDate={formattedDate}
              variant="compact"
            />
          ) : (
            <Text className="text-sm text-text-tertiary dark:text-text-tertiary-dark">Lista para leer</Text>
          )}
        </View>
      </View>
      <View
        accessibilityLabel={badgeLabel}
        className={`rounded-pill px-3 py-1 ${
          showingLocked
            ? "bg-accent-ghost dark:bg-accent-ghost-dark"
            : "bg-surface-muted dark:bg-surface-muted-dark"
        }`}
      >
        <Text
          className={`text-xs font-semibold ${
            showingLocked ? "text-accent dark:text-accent-dark" : "text-success dark:text-success-dark"
          }`}
        >
          {badgeLabel}
        </Text>
      </View>
    </Pressable>
  );
}
