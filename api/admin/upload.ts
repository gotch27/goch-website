import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../_lib/auth.js";
import { methodNotAllowed, readRawBody, sendJson } from "../_lib/http.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (!requireAdmin(request, response)) {
    return;
  }

  if (request.method !== "POST") {
    methodNotAllowed(response, ["POST"]);
    return;
  }

  try {
    const contentType = request.headers["content-type"];
    const fileNameHeader = request.headers["x-file-name"];
    const fileName = Array.isArray(fileNameHeader)
      ? fileNameHeader[0]
      : fileNameHeader;

    if (!contentType?.startsWith("image/")) {
      sendJson(response, 400, { error: "Upload must be an image" });
      return;
    }

    const body = await readRawBody(request);
    if (body.length === 0) {
      sendJson(response, 400, { error: "Upload is empty" });
      return;
    }

    const safeFileName = sanitizeFileName(fileName ?? "image");
    const key = `projects/${Date.now()}-${randomUUID()}-${safeFileName}`;
    const blob = await put(key, body, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });

    sendJson(response, 201, { url: blob.url, key: blob.pathname });
  } catch (error) {
    sendJson(response, 400, {
      error: error instanceof Error ? error.message : "Upload failed",
    });
  }
}

function sanitizeFileName(fileName: string) {
  const cleaned = fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleaned.length > 0 ? cleaned : "image";
}
