import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ProjectLogo } from "../components/ProjectLogo";
import type { Profile, Project } from "../types/project";

interface UploadResult {
  url: string;
  key: string;
}

type AdminStatus = "checking" | "authenticated" | "anonymous";
type AdminSection = "profile" | "projects" | "project-editor";

const emptyProfile: Profile = {
  displayName: "",
  greeting: "",
  bio: "",
};

export function AdminPage() {
  const [status, setStatus] = useState<AdminStatus>("checking");
  const [token, setToken] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string>("new");
  const [activeSection, setActiveSection] = useState<AdminSection>("projects");
  const [draft, setDraft] = useState<Project>(() => createEmptyProject());
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedId) ?? null,
    [projects, selectedId],
  );
  const profileDraft = profile ?? emptyProfile;

  const loadAdminContent = useCallback(async () => {
    setMessage("");
    const [projectsResponse, profileResponse] = await Promise.all([
      fetch("/api/admin/projects"),
      fetch("/api/admin/profile"),
    ]);

    if (!projectsResponse.ok) {
      throw new Error("Projects could not be loaded.");
    }

    if (!profileResponse.ok) {
      throw new Error("Profile could not be loaded.");
    }

    const projectsData = (await projectsResponse.json()) as {
      projects?: Project[];
    };
    const profileData = (await profileResponse.json()) as {
      profile?: Profile | null;
    };

    if (!profileData.profile) {
      throw new Error("Profile is missing.");
    }

    setProjects(projectsData.projects ?? []);
    setProfile(profileData.profile);
  }, []);

  useEffect(() => {
    async function checkSession() {
      const response = await fetch("/api/admin/login");
      const data = (await response.json().catch(() => null)) as
        | { authenticated?: boolean }
        | null;

      if (response.ok && data?.authenticated) {
        setStatus("authenticated");
        try {
          await loadAdminContent();
        } catch (error) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Admin content could not be loaded.",
          );
        }
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

    setDraft(createEmptyProject(projects.length + 1));
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
    try {
      await loadAdminContent();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Admin content could not be loaded.",
      );
    }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setStatus("anonymous");
    setProjects([]);
    setProfile(null);
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
      setActiveSection("projects");
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
      setActiveSection("projects");
      setMessage("Project deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Project delete failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function moveProject(projectId: string, direction: -1 | 1) {
    const currentIndex = projects.findIndex((project) => project.id === projectId);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= projects.length) {
      return;
    }

    const nextProjects = [...projects];
    const [movedProject] = nextProjects.splice(currentIndex, 1);
    nextProjects.splice(nextIndex, 0, movedProject);
    const orderedProjects = nextProjects.map((project, index) => ({
      ...project,
      sortOrder: index + 1,
    }));

    setProjects(orderedProjects);
    setMessage("");

    try {
      const response = await fetch("/api/admin/projects/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: orderedProjects.map((project) => project.id),
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Project order could not be saved");
      }

      const data = (await response.json()) as { projects?: Project[] };
      setProjects(data.projects ?? orderedProjects);
      setMessage("Project order saved.");
    } catch (error) {
      await loadAdminContent();
      setMessage(
        error instanceof Error ? error.message : "Project reorder failed.",
      );
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) {
      setMessage("Profile is not loaded.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: profile.displayName,
          greeting: profile.greeting,
          bio: profile.bio,
        }),
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

  async function uploadImage(file: File) {
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      headers: {
        "Content-Type": file.type,
        "X-File-Name": file.name,
        "X-Upload-Folder": "projects",
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
        <aside className="admin-sidebar" aria-label="Admin sections">
          <button
            type="button"
            className={activeSection === "profile" ? "is-selected" : ""}
            onClick={() => setActiveSection("profile")}
          >
            Profile
          </button>
          <button
            type="button"
            className={activeSection === "projects" ? "is-selected" : ""}
            onClick={() => setActiveSection("projects")}
          >
            Projects
          </button>
          <button
            type="button"
            className={
              activeSection === "project-editor" && selectedId === "new"
                ? "is-selected"
                : ""
            }
            onClick={() => {
              setSelectedId("new");
              setActiveSection("project-editor");
            }}
          >
            New project
          </button>
        </aside>

        {activeSection === "profile" ? (
          <section className="admin-panel" aria-labelledby="profile-editor">
            <h2 id="profile-editor">Profile</h2>
            <form className="admin-form" onSubmit={saveProfile}>
              <div className="admin-grid">
                <label>
                  Greeting
                  <input
                    value={profileDraft.greeting}
                    onChange={(event) =>
                      setProfile({
                        ...profileDraft,
                        greeting: event.target.value,
                      })
                    }
                    required
                  />
                </label>
                <label>
                  Display name
                  <input
                    value={profileDraft.displayName}
                    onChange={(event) =>
                      setProfile({
                        ...profileDraft,
                        displayName: event.target.value,
                      })
                    }
                    required
                  />
                </label>
              </div>

              <label>
                Bio
                <textarea
                  value={profileDraft.bio}
                  onChange={(event) =>
                    setProfile({ ...profileDraft, bio: event.target.value })
                  }
                  rows={5}
                  required
                />
              </label>

              <div className="admin-button-row">
                <button type="submit" disabled={isSaving}>
                  Save profile
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {activeSection === "projects" ? (
          <section className="admin-panel" aria-labelledby="projects-manager">
            <div className="admin-panel-header">
              <h2 id="projects-manager">Projects</h2>
              <button
                type="button"
                onClick={() => {
                  setSelectedId("new");
                  setActiveSection("project-editor");
                }}
              >
                New project
              </button>
            </div>

            <div className="admin-project-list">
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <article className="admin-project-row" key={project.id}>
                    <ProjectLogo
                      logo={project.image}
                      name={project.name}
                    />
                    <div>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                    </div>
                    <div
                      className="admin-project-order"
                      aria-label={`Change order for ${project.name}`}
                    >
                      <button
                        type="button"
                        onClick={() => moveProject(project.id, -1)}
                        disabled={index === 0}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveProject(project.id, 1)}
                        disabled={index === projects.length - 1}
                      >
                        Down
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(project.id);
                        setActiveSection("project-editor");
                      }}
                    >
                      Edit
                    </button>
                  </article>
                ))
              ) : (
                <p className="admin-muted">No projects yet.</p>
              )}
            </div>
          </section>
        ) : null}

        {activeSection === "project-editor" ? (
          <section className="admin-panel" aria-labelledby="project-editor">
            <h2 id="project-editor">
              {selectedId === "new" ? "New project" : "Edit project"}
            </h2>
            <form className="admin-form" onSubmit={saveProject}>
              <div className="admin-grid admin-grid--two">
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
                Project logo
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.svg,.mp4,image/png,image/jpeg,image/svg+xml,video/mp4"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                      return;
                    }

                    setMessage("Uploading logo...");
                    try {
                      const upload = await uploadImage(file);
                      setDraft({
                        ...draft,
                        image: upload.url,
                        imageKey: upload.key,
                      });
                      setMessage("Logo uploaded.");
                    } catch (error) {
                      setMessage(
                        error instanceof Error
                          ? error.message
                          : "Upload failed.",
                      );
                    }
                  }}
                />
              </label>

              <LogoPreview logo={draft.image} />

              <div className="admin-button-row">
                <button type="submit" disabled={isSaving}>
                  {selectedId === "new" ? "Create project" : "Save project"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection("projects")}
                  disabled={isSaving}
                >
                  Back to projects
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
        ) : null}
      </div>
    </main>
  );
}

function createEmptyProject(sortOrder = 0): Project {
  return {
    id: "",
    name: "",
    description: "",
    sortOrder,
  };
}

function normalizeProject(project: Project): Project {
  return {
    ...project,
    name: project.name.trim(),
    description: project.description.trim(),
    image: project.image?.trim() || undefined,
    github: project.github?.trim() || undefined,
    deployment: project.deployment?.trim() || undefined,
    sortOrder: project.sortOrder ?? 0,
  };
}

function LogoPreview({ logo }: { logo?: string }) {
  if (!logo) {
    return null;
  }

  if (/\.mp4($|\?)/i.test(logo)) {
    return (
      <video
        className="admin-logo-preview"
        src={logo}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }

  return <img className="admin-logo-preview" src={logo} alt="" />;
}
