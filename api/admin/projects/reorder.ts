import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../../_lib/auth.js";
import { methodNotAllowed, readJsonBody, sendJson } from "../../_lib/http.js";
import { getProjects, getSql } from "../../_lib/projects.js";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (!requireAdmin(request, response)) {
    return;
  }

  if (request.method !== "PUT") {
    methodNotAllowed(response, ["PUT"]);
    return;
  }

  try {
    const body = await readJsonBody(request);
    const ids = readIds(body);
    const sql = getSql();

    await sql`begin`;
    try {
      for (const [index, id] of ids.entries()) {
        await sql`
          update projects
          set sort_order = ${index + 1}, updated_at = now()
          where id = ${id}
        `;
      }
      await sql`commit`;
    } catch (error) {
      await sql`rollback`;
      throw error;
    }

    sendJson(response, 200, { projects: await getProjects() });
  } catch (error) {
    sendJson(response, 400, {
      error:
        error instanceof Error ? error.message : "Failed to reorder projects",
    });
  }
}

function readIds(body: unknown) {
  if (typeof body !== "object" || body === null) {
    throw new Error("Expected reorder object");
  }

  const ids = (body as Record<string, unknown>).ids;
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.some((id) => typeof id !== "string" || id.trim().length === 0)
  ) {
    throw new Error("Expected project id list");
  }

  const trimmedIds = ids.map((id) => (id as string).trim());
  if (new Set(trimmedIds).size !== trimmedIds.length) {
    throw new Error("Project id list cannot contain duplicates");
  }

  return trimmedIds;
}
