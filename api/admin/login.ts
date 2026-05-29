import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  clearSessionCookie,
  createSessionCookie,
  isAuthenticated,
  isValidAdminToken,
} from "../_lib/auth";
import { methodNotAllowed, readJsonBody, sendJson } from "../_lib/http";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method === "GET") {
    sendJson(response, 200, { authenticated: isAuthenticated(request) });
    return;
  }

  if (request.method === "DELETE") {
    response.setHeader("Set-Cookie", clearSessionCookie());
    sendJson(response, 200, { authenticated: false });
    return;
  }

  if (request.method !== "POST") {
    methodNotAllowed(response, ["GET", "POST", "DELETE"]);
    return;
  }

  try {
    const body = await readJsonBody(request);
    const token =
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>).token
        : undefined;

    if (!isValidAdminToken(token)) {
      sendJson(response, 401, { error: "Invalid admin token" });
      return;
    }

    response.setHeader("Set-Cookie", createSessionCookie());
    sendJson(response, 200, { authenticated: true });
  } catch (error) {
    sendJson(response, 400, {
      error: error instanceof Error ? error.message : "Login failed",
    });
  }
}
