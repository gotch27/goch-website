import { useEffect, useState } from "react";
import { AdminPage } from "./admin/AdminPage";
import { BioBlock } from "./components/BioBlock";
import { ProfileIntro } from "./components/ProfileIntro";
import { ProjectDialog } from "./components/ProjectDialog";
import { ProjectsList } from "./components/ProjectsList";
import { SiteLogo } from "./components/SiteLogo";
import { SocialLinks } from "./components/SocialLinks";
import type { Profile, Project } from "./types/project";

function App() {
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <AdminPage />;
  }

  return <HomePage />;
}

function HomePage() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      try {
        const [projectsResponse, profileResponse] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/profile"),
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

        if (isMounted) {
          setProjects(projectsData.projects ?? []);
          setProfile(profileData.profile);
          setError("");
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error ? error.message : "Content could not be loaded.",
          );
        }
      }
    }

    void loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <main className="home-page">
        <p className="admin-message">{error}</p>
      </main>
    );
  }

  if (!profile || !projects) {
    return (
      <main className="home-page">
        <p className="admin-muted">Loading content...</p>
      </main>
    );
  }

  return (
    <main className="home-page">
      <h1 className="sr-only">{profile.displayName}</h1>

      <div className="site-shell">
        <div className="corner corner--top-left">
          <ProfileIntro profile={profile} />
        </div>

        <div className="corner corner--top-right">
          <BioBlock profile={profile} />
        </div>

        <SiteLogo />

        <div className="corner corner--bottom-left">
          <ProjectsList
            projects={projects}
            onProjectSelect={setActiveProject}
          />
        </div>

        <div className="corner corner--bottom-right">
          <SocialLinks />
        </div>
      </div>

      <ProjectDialog
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </main>
  );
}

export default App;
