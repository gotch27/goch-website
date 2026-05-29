import type { VercelRequest, VercelResponse } from "@vercel/node";

export function sendJson(
  response: VercelResponse,
  status: number,
  payload: unknown,
) {
  response.status(status);
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(payload));
}

export function methodNotAllowed(
  response: VercelResponse,
  allowedMethods: string[],
) {
  response.setHeader("Allow", allowedMethods.join(", "));
  sendJson(response, 405, { error: "Method not allowed" });
}

export async function readJsonBody(request: VercelRequest): Promise<unknown> {
  if (request.body !== undefined) {
    if (typeof request.body === "string") {
      return JSON.parse(request.body);
    }

    return request.body;
  }

  const buffer = await readRawBody(request);
  if (buffer.length === 0) {
    return {};
  }

  return JSON.parse(buffer.toString("utf8"));
}

export function readRawBody(request: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    request.on("data", (chunk: Buffer | string) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    request.on("end", () => resolve(Buffer.concat(chunks)));
    request.on("error", reject);
  });
}

export function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name} environment variable`);
  }

  return value;
}
