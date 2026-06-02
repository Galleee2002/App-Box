import { useEffect, useState } from "react";
import { isCapsuleLocked } from "../domain/capsule";
import {
  formatUnlockAtDate,
  formatUnlockCountdown,
  formatUnlockCountdownA11y,
  getUnlockRemainingMs,
  type UnlockDateStyle,
} from "../domain/capsuleUnlockHint";

type UseUnlockCountdownOptions = {
  dateStyle?: UnlockDateStyle;
};

export function useUnlockCountdown(unlockAt: Date, options: UseUnlockCountdownOptions = {}) {
  const { dateStyle = "medium" } = options;
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const tick = () => {
      const nextNow = new Date();
      setNow(nextNow);

      if (getUnlockRemainingMs(unlockAt, nextNow) === 0 && intervalId) {
        clearInterval(intervalId);
      }
    };

    if (getUnlockRemainingMs(unlockAt, new Date()) === 0) {
      tick();
      return;
    }

    intervalId = setInterval(tick, 1_000);
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [unlockAt]);

  const isLocked = isCapsuleLocked(unlockAt, now);

  return {
    isLocked,
    countdownLabel: formatUnlockCountdown(unlockAt, now),
    countdownA11y: formatUnlockCountdownA11y(unlockAt, now),
    formattedDate: formatUnlockAtDate(unlockAt, dateStyle),
  };
}
