type SectionHeadingProps = {
  eyebrow?: string;
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
    <header className={`mn-section-heading mn-section-heading--${align}${eyebrow ? "" : " mn-section-heading--no-eyebrow"}`}>
      {eyebrow ? <p className="mn-eyebrow">{eyebrow}</p> : null}
      <h2 className="mn-section-title">{title}</h2>
      <p className="mn-section-subtitle">{subtitle}</p>
    </header>
  );
}
