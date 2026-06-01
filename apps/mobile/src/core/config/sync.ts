export type SyncConfig = {
  apiBaseUrl: string;
  syncToken: string;
};

export function getSyncConfig(): SyncConfig | null {
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/$/, "");
  const syncToken = process.env.EXPO_PUBLIC_SYNC_TOKEN?.trim();

  if (!apiBaseUrl || !syncToken) {
    return null;
  }

  return { apiBaseUrl, syncToken };
}

export function isSyncEnabled(): boolean {
  return getSyncConfig() !== null;
}
