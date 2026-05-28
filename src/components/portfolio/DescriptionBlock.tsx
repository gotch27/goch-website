type DescriptionBlockProps = {
  description: string;
};

export function DescriptionBlock({ description }: DescriptionBlockProps) {
  return (
    <section className="description-block" aria-label="Description">
      <p>{description}</p>
    </section>
  );
}
