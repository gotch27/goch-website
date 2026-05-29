import { useState } from "react";
import projectsData from "./data/projects.json";
import { BioBlock } from "./components/BioBlock";
import { ProfileIntro } from "./components/ProfileIntro";
import { ProjectDialog } from "./components/ProjectDialog";
import { ProjectsList } from "./components/ProjectsList";
import { SiteLogo } from "./components/SiteLogo";
import { SocialLinks } from "./components/SocialLinks";
import type { Project } from "./types/project";

const projects = projectsData as Project[];

function App() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <main className="home-page">
      <h1 className="sr-only">Gorazd Filipovski</h1>

      <div className="site-shell">
        <div className="corner corner--top-left">
          <ProfileIntro />
        </div>

        <div className="corner corner--top-right">
          <BioBlock />
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
