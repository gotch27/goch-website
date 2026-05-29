import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Profile, Project, ProjectMark } from "../types/project";

interface AdminPageProps {
  fallbackProjects: Project[];
  fallbackProfile: Profile;
}

interface UploadResult {
  url: string;
  key: string;
}

type AdminStatus = "checking" | "authenticated" | "anonymous";

const projectMarks: ProjectMark[] = ["diamond", "triangle", "circle", "square"];

export function AdminPage({
  fallbackProjects,
  fallbackProfile,
}: AdminPageProps) {
  const [status, setStatus] = useState<AdminStatus>("checking");
  const [token, setToken] = useState("");
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [selectedId, setSelectedId] = useState<string>("new");
  const [draft, setDraft] = useState<Project>(() => createEmptyProject());
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedId) ?? null,
    [projects, selectedId],
  );

  const loadAdminContent = useCallback(async () => {
    const [projectsResponse, profileResponse] = await Promise.all([
      fetch("/api/admin/projects"),
      fetch("/api/admin/profile"),
    ]);

    if (projectsResponse.ok) {
      const data = (await projectsResponse.json()) as { projects?: Project[] };
      setProjects(data.projects ?? []);
    } else {
      setProjects(fallbackProjects);
    }

    if (profileResponse.ok) {
      const data = (await profileResponse.json()) as { profile?: Profile | null };
      setProfile({ ...fallbackProfile, ...(data.profile ?? {}) });
    }
  }, [fallbackProfile, fallbackProjects]);

  useEffect(() => {
    async function checkSession() {
      const response = await fetch("/api/admin/login");
      const data = (await response.json().catch(() => null)) as
        | { authenticated?: boolean }
        | null;

      if (response.ok && data?.authenticated) {
        setStatus("authenticated");
        await loadAdminContent();
        return;
      }

      setStatus("anonymous");
    }

    void checkSession();
  }, [loadAdminContent]);

  useEffect(() => {
    if (selectedProject) {
      setDraft(normalizeProject(selectedProject));
      return;
    }

    setDraft(createEmptyProject(projects.length));
  }, [projects.length, selectedProject]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      setMessage("That token did not work.");
      return;
    }

    setStatus("authenticated");
    setToken("");
    await loadAdminContent();
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setStatus("anonymous");
    setProjects([]);
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const isExisting = selectedId !== "new";
      const response = await fetch(
        isExisting ? `/api/admin/projects/${selectedId}` : "/api/admin/projects",
        {
          method: isExisting ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalizeProject(draft)),
        },
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Project could not be saved");
      }

      await loadAdminContent();
      setSelectedId("new");
      setMessage("Project saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Project save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteProject() {
    if (selectedId === "new") {
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/projects/${selectedId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Project could not be deleted");
      }

      await loadAdminContent();
      setSelectedId("new");
      setMessage("Project deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Project delete failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Profile could not be saved");
      }

      await loadAdminContent();
      setMessage("Profile saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Profile save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadImage(file: File, folder: "profile" | "projects") {
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      headers: {
        "Content-Type": file.type,
        "X-File-Name": file.name,
        "X-Upload-Folder": folder,
      },
      body: await file.arrayBuffer(),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      throw new Error(data?.error ?? "Upload failed");
    }

    return (await response.json()) as UploadResult;
  }

  if (status === "checking") {
    return (
      <main className="admin-page">
        <p className="admin-muted">Checking session...</p>
      </main>
    );
  }

  if (status === "anonymous") {
    return (
      <main className="admin-page admin-page--centered">
        <form className="admin-login" onSubmit={login}>
          <a className="admin-home-link" href="/">
            Back to site
          </a>
          <h1>Admin</h1>
          <label>
            Access token
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit">Log in</button>
          {message ? <p className="admin-message">{message}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="section-label">Admin</p>
          <h1>Content manager</h1>
        </div>
        <nav className="admin-actions" aria-label="Admin actions">
          <a href="/">View site</a>
          <button type="button" onClick={logout}>
            Log out
          </button>
        </nav>
      </header>

      {message ? <p className="admin-message">{message}</p> : null}

      <div className="admin-layout">
        <aside className="admin-sidebar" aria-label="Projects">
          <button
            type="button"
            className={selectedId === "new" ? "is-selected" : ""}
            onClick={() => setSelectedId("new")}
          >
            New project
          </button>

          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              className={project.id === selectedId ? "is-selected" : ""}
              onClick={() => setSelectedId(project.id)}
            >
              {project.name}
            </button>
          ))}
        </aside>

        <section className="admin-panel" aria-labelledby="project-editor">
          <h2 id="project-editor">Project</h2>
          <form className="admin-form" onSubmit={saveProject}>
            <div className="admin-grid">
              <label>
                Name
                <input
                  value={draft.name}
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Mark
                <select
                  value={draft.mark}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      mark: event.target.value as ProjectMark,
                    })
                  }
                >
                  {projectMarks.map((mark) => (
                    <option key={mark} value={mark}>
                      {mark}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Sort order
                <input
                  type="number"
                  value={draft.sortOrder ?? 0}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      sortOrder: Number(event.target.value),
                    })
                  }
                />
              </label>
            </div>

            <label>
              Description
              <textarea
                value={draft.description}
                onChange={(event) =>
                  setDraft({ ...draft, description: event.target.value })
                }
                rows={5}
                required
              />
            </label>

            <div className="admin-grid">
              <label>
                GitHub URL
                <input
                  type="url"
                  value={draft.github ?? ""}
                  onChange={(event) =>
                    setDraft({ ...draft, github: event.target.value })
                  }
                />
              </label>
              <label>
                Live URL
                <input
                  type="url"
                  value={draft.deployment ?? ""}
                  onChange={(event) =>
                    setDraft({ ...draft, deployment: event.target.value })
                  }
                />
              </label>
            </div>

            <label>
              Project image
              <input
                type="file"
                accept="image/*"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) {
                    return;
                  }

                  setMessage("Uploading image...");
                  try {
                    const upload = await uploadImage(file, "projects");
                    setDraft({
                      ...draft,
                      image: upload.url,
                      imageKey: upload.key,
                    });
                    setMessage("Image uploaded.");
                  } catch (error) {
                    setMessage(
                      error instanceof Error ? error.message : "Upload failed.",
                    );
                  }
                }}
              />
            </label>

            {draft.image ? (
              <img className="admin-image-preview" src={draft.image} alt="" />
            ) : null}

            <div className="admin-button-row">
              <button type="submit" disabled={isSaving}>
                {selectedId === "new" ? "Create project" : "Save project"}
              </button>
              {selectedId !== "new" ? (
                <button
                  type="button"
                  className="admin-danger"
                  onClick={deleteProject}
                  disabled={isSaving}
                >
                  Delete
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="admin-panel" aria-labelledby="profile-editor">
          <h2 id="profile-editor">Profile</h2>
          <form className="admin-form" onSubmit={saveProfile}>
            <div className="admin-grid">
              <label>
                Greeting
                <input
                  value={profile.greeting}
                  onChange={(event) =>
                    setProfile({ ...profile, greeting: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Display name
                <input
                  value={profile.displayName}
                  onChange={(event) =>
                    setProfile({ ...profile, displayName: event.target.value })
                  }
                  required
                />
              </label>
            </div>

            <label>
              Bio
              <textarea
                value={profile.bio}
                onChange={(event) =>
                  setProfile({ ...profile, bio: event.target.value })
                }
                rows={5}
                required
              />
            </label>

            <label>
              Portrait
              <input
                type="file"
                accept="image/*"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) {
                    return;
                  }

                  setMessage("Uploading portrait...");
                  try {
                    const upload = await uploadImage(file, "profile");
                    setProfile({
                      ...profile,
                      portrait: upload.url,
                      portraitKey: upload.key,
                    });
                    setMessage("Portrait uploaded.");
                  } catch (error) {
                    setMessage(
                      error instanceof Error ? error.message : "Upload failed.",
                    );
                  }
                }}
              />
            </label>

            {profile.portrait ? (
              <img
                className="admin-portrait-preview"
                src={profile.portrait}
                alt=""
              />
            ) : null}

            <div className="admin-button-row">
              <button type="submit" disabled={isSaving}>
                Save profile
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function createEmptyProject(sortOrder = 0): Project {
  return {
    id: "",
    name: "",
    mark: "diamond",
    description: "",
    image: "",
    sortOrder,
  };
}

function normalizeProject(project: Project): Project {
  return {
    ...project,
    name: project.name.trim(),
    description: project.description.trim(),
    image: project.image.trim(),
    github: project.github?.trim() || undefined,
    deployment: project.deployment?.trim() || undefined,
    sortOrder: project.sortOrder ?? 0,
  };
}
