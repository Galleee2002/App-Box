function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getDatabaseUrl(): string {
  return requireEnv("DATABASE_URL");
}

export function getSyncApiSecret(): string {
  return requireEnv("SYNC_API_SECRET");
}

export function getCoupleId(): string {
  return process.env.COUPLE_ID?.trim() || "default";
}

export function getPort(): number {
  const raw = process.env.PORT?.trim();
  if (!raw) {
    return 3001;
  }
  const port = Number.parseInt(raw, 10);
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error(`Invalid PORT: ${raw}`);
  }
  return port;
}
