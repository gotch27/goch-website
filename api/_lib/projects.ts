import { neon } from "@neondatabase/serverless";
import { requiredEnv } from "./http";

export type ProjectMark = "diamond" | "triangle" | "circle" | "square";

export interface ProjectRecord {
  id: string;
  name: string;
  mark: ProjectMark;
  description: string;
  image: string;
  imageKey?: string;
  github?: string;
  deployment?: string;
  sortOrder: number;
}

export interface ProjectInput {
  name: string;
  mark: ProjectMark;
  description: string;
  image: string;
  imageKey?: string;
  github?: string;
  deployment?: string;
  sortOrder: number;
}

interface ProjectRow {
  id: string;
  name: string;
  mark: ProjectMark;
  description: string;
  image_url: string;
  image_key: string | null;
  github_url: string | null;
  deployment_url: string | null;
  sort_order: number;
}

const marks = new Set<ProjectMark>(["diamond", "triangle", "circle", "square"]);

export function getSql() {
  return neon(requiredEnv("DATABASE_URL"));
}

export async function getProjects() {
  const sql = getSql();
  const rows = await sql`
    select id, name, mark, description, image_url, image_key, github_url, deployment_url, sort_order
    from projects
    order by sort_order asc, created_at desc
  `;

  return rows.map(mapProjectRow);
}

export async function getProjectById(id: string) {
  const sql = getSql();
  const rows = await sql`
    select id, name, mark, description, image_url, image_key, github_url, deployment_url, sort_order
    from projects
    where id = ${id}
    limit 1
  `;

  return rows[0] ? mapProjectRow(rows[0] as ProjectRow) : null;
}

export function readProjectInput(body: unknown): ProjectInput {
  if (!isObject(body)) {
    throw new Error("Expected project object");
  }

  const name = readRequiredString(body.name, "name");
  const mark = readMark(body.mark);
  const description = readRequiredString(body.description, "description");
  const image = readRequiredString(body.image, "image");
  const imageKey = readOptionalString(body.imageKey);
  const github = readOptionalString(body.github);
  const deployment = readOptionalString(body.deployment);
  const sortOrder = readSortOrder(body.sortOrder);

  return {
    name,
    mark,
    description,
    image,
    imageKey,
    github,
    deployment,
    sortOrder,
  };
}

function mapProjectRow(row: ProjectRow): ProjectRecord {
  return {
    id: row.id,
    name: row.name,
    mark: row.mark,
    description: row.description,
    image: row.image_url,
    imageKey: row.image_key ?? undefined,
    github: row.github_url ?? undefined,
    deployment: row.deployment_url ?? undefined,
    sortOrder: row.sort_order,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
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

function readMark(value: unknown): ProjectMark {
  if (typeof value === "string" && marks.has(value as ProjectMark)) {
    return value as ProjectMark;
  }

  throw new Error("Invalid mark");
}

function readSortOrder(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
  }

  return 0;
}
