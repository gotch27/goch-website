type ProfileBlockProps = {
  initials: string;
  name: string;
  title: string;
};

export function ProfileBlock({ initials, name, title }: ProfileBlockProps) {
  return (
    <section className="profile-block" aria-label="Profile">
      <div className="profile-photo" aria-hidden="true">
        <span>{initials}</span>
      </div>
      <div>
        <p className="eyebrow">{name}</p>
        <h1>{title}</h1>
      </div>
    </section>
  );
}
