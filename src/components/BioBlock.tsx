import type { Profile } from "../types/project";

interface BioBlockProps {
  profile: Profile;
}

export function BioBlock({ profile }: BioBlockProps) {
  return (
    <section className="bio-block" aria-labelledby="bio-heading">
      <h2 id="bio-heading" className="section-label">
        About
      </h2>
      <p>{profile.bio}</p>
    </section>
  );
}
