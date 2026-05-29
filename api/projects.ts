import type { VercelRequest, VercelResponse } from "@vercel/node";
import { methodNotAllowed, sendJson } from "./_lib/http.js";
import { getProjects } from "./_lib/projects.js";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== "GET") {
    methodNotAllowed(response, ["GET"]);
    return;
  }

  try {
    sendJson(response, 200, { projects: await getProjects() });
  } catch (error) {
    sendJson(response, 500, {
      error: error instanceof Error ? error.message : "Failed to load projects",
    });
  }
}
