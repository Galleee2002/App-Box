import { ScrollView, Text, View } from "react-native";
import { Button } from "@/src/presentation/ui/Button";
import { formatBucketCompletedDate } from "../domain/bucketItem";

type BucketItemDetailProps = {
  title: string;
  description: string;
  categoryLabel: string;
  isCompleted: boolean;
  completedAt?: Date | null;
  onMarkComplete: () => void;
  completing?: boolean;
};

export function BucketItemDetail({
  title,
  description,
  categoryLabel,
  isCompleted,
  completedAt,
  onMarkComplete,
  completing = false,
}: BucketItemDetailProps) {
  const badgeLabel = isCompleted ? "Completado" : "Pendiente";

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerClassName="px-6 py-6"
    >
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="flex-1 text-2xl font-bold text-text-primary dark:text-text-primary-dark">{title}</Text>
        <View
          accessibilityLabel={badgeLabel}
          className={`ml-3 rounded-pill px-3 py-1 ${
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
      </View>

      <Text className="mb-4 text-sm font-medium text-accent dark:text-accent-dark">{categoryLabel}</Text>

      {isCompleted && completedAt ? (
        <Text className="mb-4 text-sm text-text-secondary dark:text-text-secondary-dark">
          Completado el {formatBucketCompletedDate(completedAt)}
        </Text>
      ) : null}

      <Text className="text-base leading-6 text-text-primary dark:text-text-primary-dark">{description}</Text>

      {!isCompleted ? (
        <View className="mt-8">
          <Button
            label={completing ? "Marcando..." : "Marcar como completado"}
            onPress={onMarkComplete}
            disabled={completing}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}
