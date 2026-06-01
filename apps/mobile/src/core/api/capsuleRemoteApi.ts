import type { SyncConfig } from "../config/sync";

export type RemoteCapsuleDto = {
  id: string;
  title: string;
  body: string;
  unlockAt: string;
  createdAt: string;
  updatedAt: string;
};

type ListResponse = { capsules: RemoteCapsuleDto[] };
type SyncResponse = { accepted: string[] };

export class CapsuleRemoteApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "CapsuleRemoteApiError";
  }
}

async function request<T>(
  config: SyncConfig,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.syncToken}`,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new CapsuleRemoteApiError(`API error ${response.status}`, response.status);
  }

  return (await response.json()) as T;
}

export async function fetchRemoteCapsules(
  config: SyncConfig,
  since?: string | null,
): Promise<RemoteCapsuleDto[]> {
  const query = since ? `?since=${encodeURIComponent(since)}` : "";
  const data = await request<ListResponse>(config, `/v1/capsules${query}`);
  return data.capsules ?? [];
}

export async function pushCapsulesToRemote(
  config: SyncConfig,
  capsules: RemoteCapsuleDto[],
): Promise<string[]> {
  if (capsules.length === 0) {
    return [];
  }

  const data = await request<SyncResponse>(config, "/v1/capsules/sync", {
    method: "POST",
    body: JSON.stringify({ capsules }),
  });

  return data.accepted ?? [];
}
