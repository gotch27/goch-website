import { randomUUID } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../_lib/auth";
import { methodNotAllowed, readJsonBody, sendJson } from "../_lib/http";
import {
  getProjectById,
  getProjects,
  getSql,
  readProjectInput,
} from "../_lib/projects";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (!requireAdmin(request, response)) {
    return;
  }

  if (request.method === "GET") {
    try {
      sendJson(response, 200, { projects: await getProjects() });
    } catch (error) {
      sendJson(response, 500, {
        error:
          error instanceof Error ? error.message : "Failed to load projects",
      });
    }
    return;
  }

  if (request.method !== "POST") {
    methodNotAllowed(response, ["GET", "POST"]);
    return;
  }

  try {
    const input = readProjectInput(await readJsonBody(request));
    const sql = getSql();
    const id = randomUUID();
    await sql`
      insert into projects (
        id, name, mark, description, image_url, image_key, github_url, deployment_url, sort_order
      )
      values (
        ${id}, ${input.name}, ${input.mark}, ${input.description}, ${input.image}, ${input.imageKey ?? null},
        ${input.github ?? null}, ${input.deployment ?? null}, ${input.sortOrder}
      )
    `;
    const project = await getProjectById(id);

    sendJson(response, 201, { project });
  } catch (error) {
    sendJson(response, 400, {
      error: error instanceof Error ? error.message : "Failed to create project",
    });
  }
}
