interface SocialLink {
  name: string;
  url: string;
  icon: "github" | "x" | "linkedin";
}

const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/gotch27",
    icon: "github",
  },
  {
    name: "X",
    url: "https://x.com/gotcheski",
    icon: "x",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/gorazd-filipovski-5056842b2/",
    icon: "linkedin",
  },
];

export function SocialLinks() {
  return (
    <section className="contact-panel" aria-labelledby="contact-heading">
      <h2 id="contact-heading" className="section-label">
        Contact
      </h2>
      <nav className="social-links" aria-label="Social links">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label={link.name}
        >
          <SocialIcon icon={link.icon} />
        </a>
      ))}
      </nav>
    </section>
  );
}

function SocialIcon({ icon }: { icon: SocialLink["icon"] }) {
  if (icon === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 .5a12 12 0 0 0-3.8 23.38c.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.34-1.75-1.34-1.75-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.83 2.81 1.3 3.5.99.1-.78.42-1.3.76-1.6-2.67-.31-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.53.12-3.18 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 12 .5Z" />
      </svg>
    );
  }

  if (icon === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.67H9.34V8.98h3.41v1.57h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.04H3.53V8.98H7.1v11.47ZM22.23 0H1.76C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.76 24h20.47c.97 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 3h5.6l5.07 6.76L18.6 3H22l-7.74 8.82L22.5 21h-5.62l-5.41-7.22L5.12 21H1.7l8.17-9.32L2 3Zm4.82 2.08 11.1 13.84h1.76L8.58 5.08H6.82Z" />
    </svg>
  );
}
