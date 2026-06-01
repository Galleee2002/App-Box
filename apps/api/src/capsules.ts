import type { Context } from "hono";
import { getCoupleId } from "./env.js";
import { getSql, type RemoteCapsuleRow } from "./db.js";

export type CapsuleDto = {
  id: string;
  title: string;
  body: string;
  unlockAt: string;
  createdAt: string;
  updatedAt: string;
};

export type SyncCapsulesBody = {
  capsules: CapsuleDto[];
};

function rowToDto(row: RemoteCapsuleRow): CapsuleDto {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    unlockAt: new Date(row.unlock_at).toISOString(),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function isValidCapsuleDto(capsule: CapsuleDto): boolean {
  return (
    typeof capsule.id === "string" &&
    capsule.id.length > 0 &&
    typeof capsule.title === "string" &&
    capsule.title.trim().length > 0 &&
    typeof capsule.body === "string" &&
    capsule.body.trim().length > 0 &&
    !Number.isNaN(Date.parse(capsule.unlockAt)) &&
    !Number.isNaN(Date.parse(capsule.createdAt)) &&
    !Number.isNaN(Date.parse(capsule.updatedAt))
  );
}

export async function listCapsules(c: Context) {
  const coupleId = getCoupleId();
  const since = c.req.query("since")?.trim();
  const sql = getSql();

  const rows = (since
    ? await sql`
        SELECT id, couple_id, title, body, unlock_at, created_at, updated_at
        FROM capsules
        WHERE couple_id = ${coupleId}
          AND updated_at > ${since}::timestamptz
        ORDER BY updated_at ASC
      `
    : await sql`
        SELECT id, couple_id, title, body, unlock_at, created_at, updated_at
        FROM capsules
        WHERE couple_id = ${coupleId}
        ORDER BY updated_at ASC
      `) as RemoteCapsuleRow[];

  return c.json({ capsules: rows.map(rowToDto) });
}

export async function syncCapsules(c: Context) {
  const coupleId = getCoupleId();
  const body = (await c.req.json()) as SyncCapsulesBody;

  if (!body?.capsules || !Array.isArray(body.capsules)) {
    return c.json({ error: "Invalid body: expected { capsules: [] }" }, 400);
  }

  const sql = getSql();
  const accepted: string[] = [];

  for (const capsule of body.capsules) {
    if (!isValidCapsuleDto(capsule)) {
      continue;
    }

    await sql`
      INSERT INTO capsules (id, couple_id, title, body, unlock_at, created_at, updated_at)
      VALUES (
        ${capsule.id},
        ${coupleId},
        ${capsule.title.trim()},
        ${capsule.body.trim()},
        ${capsule.unlockAt}::timestamptz,
        ${capsule.createdAt}::timestamptz,
        ${capsule.updatedAt}::timestamptz
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        body = EXCLUDED.body,
        unlock_at = EXCLUDED.unlock_at,
        updated_at = EXCLUDED.updated_at
      WHERE capsules.updated_at < EXCLUDED.updated_at
    `;

    accepted.push(capsule.id);
  }

  return c.json({ accepted });
}
