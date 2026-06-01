import { Text, View } from "react-native";

type UnlockedCapsuleDetailProps = {
  title: string;
  body: string;
};

export function UnlockedCapsuleDetail({ title, body }: UnlockedCapsuleDetailProps) {
  return (
    <View className="flex-1 px-6 py-6">
      <Text className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">{title}</Text>
      <View className="mt-6 rounded-lg border border-border-subtle bg-surface p-6 dark:border-border-subtle-dark dark:bg-surface-dark">
        <Text className="text-base leading-7 text-text-primary dark:text-text-primary-dark">{body}</Text>
      </View>
    </View>
  );
}
