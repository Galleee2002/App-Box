import type { UnlockDateStyle } from "../domain/capsuleUnlockHint";
import { CapsuleUnlockHintView } from "./CapsuleUnlockHintView";
import { useUnlockCountdown } from "./useUnlockCountdown";

type CapsuleUnlockHintProps = {
  unlockAt: Date;
  variant: "compact" | "prominent";
  dateStyle?: UnlockDateStyle;
};

export function CapsuleUnlockHint({ unlockAt, variant, dateStyle = "medium" }: CapsuleUnlockHintProps) {
  const { countdownLabel, countdownA11y, formattedDate } = useUnlockCountdown(unlockAt, { dateStyle });

  return (
    <CapsuleUnlockHintView
      countdownLabel={countdownLabel}
      countdownA11y={countdownA11y}
      formattedDate={formattedDate}
      variant={variant}
    />
  );
}
