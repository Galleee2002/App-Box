import { Text, View } from "react-native";

type CapsuleUnlockHintViewProps = {
  countdownLabel: string;
  formattedDate: string;
  countdownA11y: string;
  variant: "compact" | "prominent";
};

export function CapsuleUnlockHintView({
  countdownLabel,
  formattedDate,
  countdownA11y,
  variant,
}: CapsuleUnlockHintViewProps) {
  if (variant === "compact") {
    return (
      <View accessibilityLabel={`Cuenta atrás: ${countdownA11y}. Se desbloquea el ${formattedDate}.`}>
        <Text className="text-sm text-text-tertiary dark:text-text-tertiary-dark">{countdownLabel}</Text>
        <Text className="mt-0.5 text-xs text-text-tertiary dark:text-text-tertiary-dark">{formattedDate}</Text>
      </View>
    );
  }

  return (
    <View accessibilityLabel={`Cuenta atrás: ${countdownA11y}. Se desbloquea el ${formattedDate}.`}>
      <Text
        accessibilityRole="timer"
        className="font-mono text-3xl font-bold tracking-wider text-accent dark:text-accent-dark"
      >
        {countdownLabel}
      </Text>
      <Text className="mt-4 text-base leading-6 text-text-secondary dark:text-text-secondary-dark">
        El mensaje se revelará el {formattedDate}.
      </Text>
    </View>
  );
}
