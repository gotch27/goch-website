import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../_lib/auth.js";
import { methodNotAllowed, readJsonBody, sendJson } from "../_lib/http.js";
import { getProfile, readProfileInput } from "../_lib/profile.js";
import { getSql } from "../_lib/projects.js";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (!requireAdmin(request, response)) {
    return;
  }

  if (request.method === "GET") {
    try {
      sendJson(response, 200, { profile: await getProfile() });
    } catch (error) {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : "Failed to load profile",
      });
    }
    return;
  }

  if (request.method !== "PUT") {
    methodNotAllowed(response, ["GET", "PUT"]);
    return;
  }

  try {
    const input = readProfileInput(await readJsonBody(request));
    const sql = getSql();
    await sql`
      insert into site_profile (
        id, display_name, greeting, bio, updated_at
      )
      values (
        'main', ${input.displayName}, ${input.greeting}, ${input.bio}, now()
      )
      on conflict (id)
      do update set
        display_name = excluded.display_name,
        greeting = excluded.greeting,
        bio = excluded.bio,
        updated_at = now()
    `;
    const profile = await getProfile();

    sendJson(response, 200, { profile });
  } catch (error) {
    sendJson(response, 400, {
      error: error instanceof Error ? error.message : "Failed to update profile",
    });
  }
}
