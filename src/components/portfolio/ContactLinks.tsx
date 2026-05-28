import type { ContactLink } from "../../data/portfolio";
import { ContactIcon } from "./ContactIcon";

type ContactLinksProps = {
  links: ContactLink[];
};

export function ContactLinks({ links }: ContactLinksProps) {
  return (
    <nav className="contact-block" aria-label="Contact links">
      <div className="section-label">
        <span>Contact</span>
      </div>
      <div className="contact-links">
        {links.map((link) => (
          <a
            aria-label={link.name}
            className="contact-link"
            href={link.url}
            key={link.name}
            rel="noopener noreferrer"
            target={link.url.startsWith("mailto:") ? undefined : "_blank"}
          >
            <ContactIcon type={link.icon} />
          </a>
        ))}
      </div>
    </nav>
  );
}
