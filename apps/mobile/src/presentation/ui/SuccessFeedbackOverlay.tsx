import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Modal, Text } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { getThemeTokens } from "@/src/core/theme";
import { useThemeStore } from "@/src/core/theme/store";

const DISPLAY_MS = 1500;

type SuccessFeedbackOverlayProps = {
  visible: boolean;
  title: string;
  message: string;
  onComplete: () => void;
};

export function SuccessFeedbackOverlay({
  visible,
  title,
  message,
  onComplete,
}: SuccessFeedbackOverlayProps) {
  const mode = useThemeStore((state) => state.mode);
  const theme = getThemeTokens(mode);
  const overlayOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.88);
  const cardOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.4);

  useEffect(() => {
    if (!visible) {
      overlayOpacity.value = 0;
      cardScale.value = 0.88;
      cardOpacity.value = 0;
      iconScale.value = 0.4;
      return;
    }

    overlayOpacity.value = withTiming(1, { duration: 240 });
    cardOpacity.value = withTiming(1, { duration: 280 });
    cardScale.value = withSpring(1, { damping: 14, stiffness: 190 });
    iconScale.value = withDelay(100, withSpring(1, { damping: 11, stiffness: 210 }));

    const timeout = setTimeout(() => {
      overlayOpacity.value = withTiming(0, { duration: 220 });
      cardOpacity.value = withTiming(0, { duration: 220 }, (finished) => {
        if (finished) {
          runOnJS(onComplete)();
        }
      });
    }, DISPLAY_MS);

    return () => clearTimeout(timeout);
  }, [visible, onComplete, overlayOpacity, cardOpacity, cardScale, iconScale]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  if (!visible) {
    return null;
  }

  return (
    <Modal transparent visible animationType="none" statusBarTranslucent accessibilityViewIsModal>
      <Animated.View
        style={overlayStyle}
        className="flex-1 items-center justify-center bg-overlay px-6 dark:bg-overlay-dark"
      >
        <Animated.View
          style={cardStyle}
          accessible
          accessibilityRole="alert"
          accessibilityLabel={`${title}. ${message}`}
          className="w-full max-w-sm items-center rounded-xl border border-border-subtle bg-surface p-8 shadow-level2 dark:border-border-subtle-dark dark:bg-surface-dark"
        >
          <Animated.View
            style={iconStyle}
            accessible={false}
            className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-surface-muted dark:bg-surface-muted-dark"
          >
            <Ionicons name="checkmark-circle" size={56} color={theme.colors.success} />
          </Animated.View>
          <Text className="text-center text-xl font-bold text-text-primary dark:text-text-primary-dark">
            {title}
          </Text>
          <Text className="mt-2 text-center text-base leading-6 text-text-secondary dark:text-text-secondary-dark">
            {message}
          </Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
