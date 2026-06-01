import { Text, TextInput, View } from "react-native";

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  multiline?: boolean;
  placeholder?: string;
};

export function TextField({
  label,
  value,
  onChangeText,
  error,
  multiline = false,
  placeholder,
}: TextFieldProps) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        className={`rounded-md border bg-surface px-3 py-3 text-base text-text-primary dark:bg-surface-dark dark:text-text-primary-dark ${
          error
            ? "border-danger dark:border-danger-dark"
            : "border-border-subtle dark:border-border-subtle-dark"
        } ${multiline ? "min-h-[120px]" : "min-h-[44px]"}`}
      />
      {error ? (
        <Text className="mt-1 text-sm text-danger dark:text-danger-dark">{error}</Text>
      ) : null}
    </View>
  );
}
