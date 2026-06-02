export type UnlockDateStyle = "medium" | "full";

export function formatUnlockAtDate(date: Date, style: UnlockDateStyle = "medium"): string {
  return date.toLocaleString(undefined, {
    dateStyle: style === "full" ? "full" : "medium",
    timeStyle: "short",
  });
}

export function getUnlockRemainingMs(unlockAt: Date, now: Date = new Date()): number {
  return Math.max(0, unlockAt.getTime() - now.getTime());
}

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function getUnlockCountdownParts(unlockAt: Date, now: Date = new Date()): CountdownParts {
  const totalSeconds = Math.floor(getUnlockRemainingMs(unlockAt, now) / 1000);

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

export function formatUnlockCountdown(unlockAt: Date, now: Date = new Date()): string {
  if (getUnlockRemainingMs(unlockAt, now) === 0) {
    return "Desbloqueando…";
  }

  const { days, hours, minutes, seconds } = getUnlockCountdownParts(unlockAt, now);
  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }

  parts.push(`${pad(hours)}h`, `${pad(minutes)}m`, `${pad(seconds)}s`);
  return parts.join(" ");
}

export function formatUnlockCountdownA11y(unlockAt: Date, now: Date = new Date()): string {
  if (getUnlockRemainingMs(unlockAt, now) === 0) {
    return "Desbloqueando la cápsula.";
  }

  const { days, hours, minutes, seconds } = getUnlockCountdownParts(unlockAt, now);
  const segments: string[] = [];

  if (days > 0) {
    segments.push(`${days} ${days === 1 ? "día" : "días"}`);
  }
  if (hours > 0) {
    segments.push(`${hours} ${hours === 1 ? "hora" : "horas"}`);
  }
  if (minutes > 0) {
    segments.push(`${minutes} ${minutes === 1 ? "minuto" : "minutos"}`);
  }
  if (seconds > 0 || segments.length === 0) {
    segments.push(`${seconds} ${seconds === 1 ? "segundo" : "segundos"}`);
  }

  return segments.join(", ");
}
