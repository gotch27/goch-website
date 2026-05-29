import portrait from "../assets/gorazd-profile.png";

export function ProfileIntro() {
  return (
    <section className="profile-intro" aria-label="Profile">
      <img
        src={portrait}
        alt="Gorazd Filipovski"
        width="88"
        height="88"
        className="profile-intro__portrait"
      />
      <div>
        <p className="section-label">Hello, I'm</p>
        <p className="profile-intro__name">Gorazd Filipovski</p>
      </div>
    </section>
  );
}
