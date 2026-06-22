export function Section({
  children,
  tight = false,
  surface = false,
  id,
}: {
  children: React.ReactNode;
  tight?: boolean;
  surface?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`${tight ? "py-12" : "py-20"} ${surface ? "bg-white" : ""}`}
    >
      <div className="fo-container">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 max-w-editorial">
      {eyebrow && <p className="fo-eyebrow">{eyebrow}</p>}
      <h2 className="text-[clamp(1.9rem,3.4vw,2.6rem)]">{title}</h2>
      {children}
    </div>
  );
}
