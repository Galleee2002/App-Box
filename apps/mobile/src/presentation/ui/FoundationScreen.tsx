import { Text, View } from "react-native";

type FoundationScreenProps = {
  title: string;
  description: string;
};

export function FoundationScreen({ title, description }: FoundationScreenProps) {
  return (
    <View className="flex-1 bg-background px-6 py-8 dark:bg-background-dark">
      <View className="rounded-lg border border-border-subtle bg-surface p-6 dark:border-border-subtle-dark dark:bg-surface-dark">
        <Text className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">{title}</Text>
        <Text className="mt-3 text-base leading-6 text-text-secondary dark:text-text-secondary-dark">{description}</Text>
      </View>
    </View>
  );
}
