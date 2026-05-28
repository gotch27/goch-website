import { useRef, useState } from "react";
import {
  CenterLogo,
  ContactLinks,
  DescriptionBlock,
  ProfileBlock,
  ProjectDialog,
  ProjectsMarquee,
} from "./components/portfolio";
import {
  contactLinks,
  description,
  profile,
  projects,
  type Project,
} from "./data/portfolio";

function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openProject(project: Project) {
    setSelectedProject(project);
    dialogRef.current?.showModal();
  }

  function closeProject() {
    dialogRef.current?.close();
    setSelectedProject(null);
  }

  return (
    <main className="portfolio-shell">
      <ProfileBlock {...profile} />
      <DescriptionBlock description={description} />
      <CenterLogo />
      <ProjectsMarquee projects={projects} onProjectOpen={openProject} />
      <ContactLinks links={contactLinks} />
      <ProjectDialog
        dialogRef={dialogRef}
        project={selectedProject}
        onClose={closeProject}
        onClosed={() => setSelectedProject(null)}
      />
    </main>
  );
}

export default App;
