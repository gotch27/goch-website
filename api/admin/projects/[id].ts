import { del } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../../_lib/auth";
import { methodNotAllowed, readJsonBody, sendJson } from "../../_lib/http";
import {
  getProjectById,
  getSql,
  readProjectInput,
} from "../../_lib/projects";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (!requireAdmin(request, response)) {
    return;
  }

  const id = Array.isArray(request.query.id)
    ? request.query.id[0]
    : request.query.id;

  if (!id) {
    sendJson(response, 400, { error: "Missing project id" });
    return;
  }

  if (request.method === "PATCH") {
    await updateProject(request, response, id);
    return;
  }

  if (request.method === "DELETE") {
    await deleteProject(response, id);
    return;
  }

  methodNotAllowed(response, ["PATCH", "DELETE"]);
}

async function updateProject(
  request: VercelRequest,
  response: VercelResponse,
  id: string,
) {
  try {
    const existing = await getProjectById(id);
    if (!existing) {
      sendJson(response, 404, { error: "Project not found" });
      return;
    }

    const input = readProjectInput(await readJsonBody(request));
    const sql = getSql();
    await sql`
      update projects
      set
        name = ${input.name},
        mark = ${input.mark},
        description = ${input.description},
        image_url = ${input.image},
        image_key = ${input.imageKey ?? null},
        github_url = ${input.github ?? null},
        deployment_url = ${input.deployment ?? null},
        sort_order = ${input.sortOrder},
        updated_at = now()
      where id = ${id}
    `;
    const project = await getProjectById(id);

    if (existing.imageKey && existing.imageKey !== input.imageKey) {
      await del(existing.imageKey).catch(() => undefined);
    }

    sendJson(response, 200, { project });
  } catch (error) {
    sendJson(response, 400, {
      error: error instanceof Error ? error.message : "Failed to update project",
    });
  }
}

async function deleteProject(response: VercelResponse, id: string) {
  try {
    const existing = await getProjectById(id);
    if (!existing) {
      sendJson(response, 404, { error: "Project not found" });
      return;
    }

    const sql = getSql();
    await sql`delete from projects where id = ${id}`;

    if (existing.imageKey) {
      await del(existing.imageKey).catch(() => undefined);
    }

    sendJson(response, 200, { deleted: true });
  } catch (error) {
    sendJson(response, 400, {
      error: error instanceof Error ? error.message : "Failed to delete project",
    });
  }
}
