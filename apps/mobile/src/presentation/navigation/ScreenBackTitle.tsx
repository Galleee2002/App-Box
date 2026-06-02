import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

type ScreenBackButtonProps = {
  onBack: () => void;
  tintColor: string;
};

export function ScreenBackButton({ onBack, tintColor }: ScreenBackButtonProps) {
  return (
    <View className="pl-6">
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Volver"
        hitSlop={12}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        <Ionicons name="chevron-back" size={28} color={tintColor} />
      </Pressable>
    </View>
  );
}

type ScreenDeleteButtonProps = {
  onDelete: () => void;
  tintColor: string;
  disabled?: boolean;
};

export function ScreenDeleteButton({ onDelete, tintColor, disabled = false }: ScreenDeleteButtonProps) {
  return (
    <View className="pr-6">
      <Pressable
        onPress={onDelete}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Eliminar cápsula"
        hitSlop={12}
        style={({ pressed }) => ({ opacity: disabled ? 0.4 : pressed ? 0.6 : 1 })}
      >
        <Ionicons name="trash-outline" size={24} color={tintColor} />
      </Pressable>
    </View>
  );
}
