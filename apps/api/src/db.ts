import { neon, Pool } from "@neondatabase/serverless";
import { getDatabaseUrl } from "./env.js";

export type RemoteCapsuleRow = {
  id: string;
  couple_id: string;
  title: string;
  body: string;
  unlock_at: string;
  created_at: string;
  updated_at: string;
};

let sql: ReturnType<typeof neon> | null = null;
let pool: Pool | null = null;

export function getSql() {
  if (!sql) {
    sql = neon(getDatabaseUrl());
  }
  return sql;
}

export function getPool() {
  if (!pool) {
    pool = new Pool({ connectionString: getDatabaseUrl() });
  }
  return pool;
}
