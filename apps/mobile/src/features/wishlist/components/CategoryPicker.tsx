import { Pressable, Text, View } from "react-native";
import {
  BUCKET_CATEGORIES,
  getBucketCategoryLabel,
  type BucketCategory,
} from "../domain/bucketItem";

type CategoryPickerProps = {
  value: BucketCategory | null;
  onChange: (category: BucketCategory) => void;
  error?: string;
};

export function CategoryPicker({ value, onChange, error }: CategoryPickerProps) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
        Categoría
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {BUCKET_CATEGORIES.map((category) => {
          const label = getBucketCategoryLabel(category);
          const selected = value === category;

          return (
            <Pressable
              key={category}
              onPress={() => onChange(category)}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected }}
              className={`min-h-[44px] justify-center rounded-pill border px-4 py-2 ${
                selected
                  ? "border-accent bg-accent-ghost dark:border-accent-dark dark:bg-accent-ghost-dark"
                  : "border-border-subtle bg-surface dark:border-border-subtle-dark dark:bg-surface-dark"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  selected ? "text-accent dark:text-accent-dark" : "text-text-primary dark:text-text-primary-dark"
                }`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <Text className="mt-1 text-sm text-danger dark:text-danger-dark">{error}</Text>
      ) : null}
    </View>
  );
}
