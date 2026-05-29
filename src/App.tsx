import { useEffect, useState } from "react";
import projectsData from "./data/projects.json";
import { AdminPage } from "./admin/AdminPage";
import fallbackPortrait from "./assets/gorazd-profile.png";
import { BioBlock } from "./components/BioBlock";
import { ProfileIntro } from "./components/ProfileIntro";
import { ProjectDialog } from "./components/ProjectDialog";
import { ProjectsList } from "./components/ProjectsList";
import { SiteLogo } from "./components/SiteLogo";
import { SocialLinks } from "./components/SocialLinks";
import type { Profile, Project } from "./types/project";

const fallbackProjects = projectsData as Project[];
const fallbackProfile: Profile = {
  displayName: "Gorazd Filipovski",
  greeting: "Hello, I'm",
  bio: "Software engineer and designer based in Skopje. I build minimal, considered products at the intersection of craft and code.",
};

function App() {
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <AdminPage
        fallbackProjects={fallbackProjects}
        fallbackProfile={fallbackProfile}
        fallbackPortrait={fallbackPortrait}
      />
    );
  }

  return <HomePage />;
}

function HomePage() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [profile, setProfile] = useState<Profile>(fallbackProfile);

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      try {
        const [projectsResponse, profileResponse] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/profile"),
        ]);

        if (projectsResponse.ok) {
          const data = (await projectsResponse.json()) as { projects?: Project[] };
          if (isMounted && data.projects?.length) {
            setProjects(data.projects);
          }
        }

        if (profileResponse.ok) {
          const data = (await profileResponse.json()) as { profile?: Profile | null };
          if (isMounted && data.profile) {
            setProfile({ ...fallbackProfile, ...data.profile });
          }
        }
      } catch {
        if (isMounted) {
          setProjects(fallbackProjects);
          setProfile(fallbackProfile);
        }
      }
    }

    void loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="home-page">
      <h1 className="sr-only">Gorazd Filipovski</h1>

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
