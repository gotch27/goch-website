interface ProjectLogoProps {
  logo?: string;
  name: string;
}

export function ProjectLogo({ logo, name }: ProjectLogoProps) {
  return (
    <span className="project-logo" aria-hidden="true">
      {logo && isVideoLogo(logo) ? (
        <video
          className="project-logo__media"
          src={logo}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : logo ? (
        <img src={logo} alt="" className="project-logo__media" />
      ) : (
        <span className="project-logo__initials">{getInitials(name)}</span>
      )}
    </span>
  );
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return initials || "?";
}

function isVideoLogo(logo: string) {
  return /\.mp4($|\?)/i.test(logo);
}
