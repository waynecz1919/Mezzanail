type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: SectionHeadingProps) {
  return (
    <header className={`mn-section-heading mn-section-heading--${align}`}>
      <p className="mn-eyebrow">{eyebrow}</p>
      <h2 className="mn-section-title">{title}</h2>
      <p className="mn-section-subtitle">{subtitle}</p>
    </header>
  );
}
