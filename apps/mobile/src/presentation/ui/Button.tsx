import { Pressable, Text } from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  accessibilityLabel?: string;
};

export function Button({
  label,
  onPress,
  disabled = false,
  variant = "primary",
  accessibilityLabel,
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      className={`min-h-[44px] items-center justify-center rounded-md px-4 py-3 ${
        isPrimary
          ? "bg-accent dark:bg-accent-dark"
          : "border border-border-subtle bg-surface dark:border-border-subtle-dark dark:bg-surface-dark"
      } ${disabled ? "opacity-45" : ""}`}
    >
      <Text
        className={`text-base font-semibold ${
          isPrimary ? "text-accent-text" : "text-text-primary dark:text-text-primary-dark"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
