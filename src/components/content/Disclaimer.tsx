/** Food/medical disclaimer (spec §8.3). Renders on PDP and health-goal pages. */
export function Disclaimer({
  children,
  title = "A note on health:",
}: {
  children?: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="rounded-control border border-fo-line border-l-4 border-l-fo-earth-700 bg-[#fbf9f0] px-6 py-4 text-[0.88rem] text-fo-muted">
      <strong className="text-fo-earth-700">{title}</strong>{" "}
      {children ?? (
        <>
          Nutritional needs and responses vary. This product is a food, not a
          medicine, and is not intended to diagnose, treat, cure, or prevent any
          disease. Consult a qualified healthcare professional for personalised
          advice.
        </>
      )}
    </div>
  );
}
