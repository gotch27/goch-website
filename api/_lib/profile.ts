import { getSql } from "./projects";

export interface ProfileRecord {
  displayName: string;
  greeting: string;
  bio: string;
  portrait?: string;
  portraitKey?: string;
}

interface ProfileRow {
  display_name: string;
  greeting: string;
  bio: string;
  portrait_url: string | null;
  portrait_key: string | null;
}

export async function getProfile() {
  const sql = getSql();
  const rows = await sql`
    select display_name, greeting, bio, portrait_url, portrait_key
    from site_profile
    where id = 'main'
    limit 1
  `;

  if (!rows[0]) {
    return null;
  }

  return mapProfileRow(rows[0] as ProfileRow);
}

export function readProfileInput(body: unknown): ProfileRecord {
  if (typeof body !== "object" || body === null) {
    throw new Error("Expected profile object");
  }

  const record = body as Record<string, unknown>;
  const displayName = readRequiredString(record.displayName, "displayName");
  const greeting = readRequiredString(record.greeting, "greeting");
  const bio = readRequiredString(record.bio, "bio");
  const portrait = readOptionalString(record.portrait);
  const portraitKey = readOptionalString(record.portraitKey);

  return { displayName, greeting, bio, portrait, portraitKey };
}

function mapProfileRow(row: ProfileRow): ProfileRecord {
  return {
    displayName: row.display_name,
    greeting: row.greeting,
    bio: row.bio,
    portrait: row.portrait_url ?? undefined,
    portraitKey: row.portrait_key ?? undefined,
  };
}

function readRequiredString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing ${field}`);
  }

  return value.trim();
}

function readOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
