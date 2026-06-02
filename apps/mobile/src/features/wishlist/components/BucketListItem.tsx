import { Pressable, Text, View } from "react-native";
import { formatBucketCompletedDate } from "../domain/bucketItem";

type BucketListItemProps = {
  title: string;
  categoryLabel: string;
  isCompleted: boolean;
  completedAt?: Date | null;
  onPress: () => void;
};

export function BucketListItem({
  title,
  categoryLabel,
  isCompleted,
  completedAt,
  onPress,
}: BucketListItemProps) {
  const badgeLabel = isCompleted ? "Completado" : "Pendiente";
  const completedHint =
    isCompleted && completedAt ? ` Completado el ${formatBucketCompletedDate(completedAt)}.` : "";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${categoryLabel}. ${badgeLabel}.${completedHint}`}
      className="min-h-[44px] flex-row items-center justify-between rounded-lg border border-border-subtle bg-surface px-4 py-3 dark:border-border-subtle-dark dark:bg-surface-dark"
    >
      <View className="mr-3 flex-1">
        <Text className="text-base font-semibold text-text-primary dark:text-text-primary-dark" numberOfLines={1}>
          {title}
        </Text>
        <Text className="mt-1 text-sm text-text-tertiary dark:text-text-tertiary-dark">{categoryLabel}</Text>
      </View>
      <View
        accessibilityLabel={badgeLabel}
        className={`rounded-pill px-3 py-1 ${
          isCompleted
            ? "bg-surface-muted dark:bg-surface-muted-dark"
            : "bg-accent-ghost dark:bg-accent-ghost-dark"
        }`}
      >
        <Text
          className={`text-xs font-semibold ${
            isCompleted ? "text-success dark:text-success-dark" : "text-accent dark:text-accent-dark"
          }`}
        >
          {badgeLabel}
        </Text>
      </View>
    </Pressable>
  );
}
