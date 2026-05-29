import portrait from "../assets/gorazd-profile.png";
import type { Profile } from "../types/project";

interface ProfileIntroProps {
  profile: Profile;
}

export function ProfileIntro({ profile }: ProfileIntroProps) {
  return (
    <section className="profile-intro" aria-label="Profile">
      <img
        src={portrait}
        alt={profile.displayName}
        width="88"
        height="88"
        className="profile-intro__portrait"
      />
      <div>
        <p className="section-label">{profile.greeting}</p>
        <p className="profile-intro__name">{profile.displayName}</p>
      </div>
    </section>
  );
}
