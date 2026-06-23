/**
 * On-brand SVG illustrations (botanical / grain motifs, brand palette) — spec
 * §13.3. Real, lightweight vector art used in place of blank placeholders. These
 * are decorative-but-meaningful: pass a `title` for an accessible label.
 *
 * Variants:
 *  - millets, rice, mixes  (category + per-product motifs)
 *  - bowl                  (prepared dish / recipe)
 *  - hero                  (homepage hero composition)
 *  - origin                (origin-to-pack / sourcing)
 *  - goal                  (health-goal leaf mark)
 *  - field                 (founder / region scenery)
 */
export type IllustrationName =
  | "millets"
  | "rice"
  | "mixes"
  | "bowl"
  | "hero"
  | "origin"
  | "goal"
  | "field";

const G900 = "var(--fo-green-900)";
const G600 = "var(--fo-green-600)";
const LIME = "var(--fo-lime-500)";
const SAGE = "var(--fo-sage-100)";
const CREAM = "var(--fo-cream-50)";
const EARTH = "var(--fo-earth-700)";

function frame(children: React.ReactNode, vb = "0 0 400 300") {
  return (
    <svg
      viewBox={vb}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role="presentation"
    >
      {children}
    </svg>
  );
}

/** A single wheat/millet head — reused across motifs. */
function GrainHead({
  x,
  y,
  scale = 1,
  color = G900,
  rotate = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  rotate?: number;
}) {
  const grains = [];
  for (let i = 0; i < 6; i++) {
    const gy = -i * 11;
    grains.push(
      <g key={`l${i}`}>
        <ellipse cx={-7} cy={gy - 4} rx={6} ry={9} fill={color} transform={`rotate(-32 -7 ${gy - 4})`} />
        <ellipse cx={7} cy={gy - 4} rx={6} ry={9} fill={color} transform={`rotate(32 7 ${gy - 4})`} />
      </g>,
    );
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 6 L0 -70" stroke={color} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={0} cy={-74} rx={5} ry={11} fill={color} />
      {grains}
    </g>
  );
}

/** A leaf — the brand's signature motif (echoes the logo). */
function Leaf({
  x,
  y,
  scale = 1,
  color = G600,
  rotate = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  rotate?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path
        d="M0 0 C 40 -8 70 -45 60 -90 C 18 -78 -8 -45 0 0 Z"
        fill={color}
      />
      <path d="M4 -6 C 24 -34 40 -52 52 -78" stroke={CREAM} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.55} />
    </g>
  );
}

export function Illustration({
  name,
  title,
  className = "",
}: {
  name: IllustrationName;
  title?: string;
  className?: string;
}) {
  const wrapClass = `relative overflow-hidden ${className}`;

  let art: React.ReactNode;

  switch (name) {
    case "millets":
      art = frame(
        <>
          <rect width="400" height="300" fill={SAGE} />
          <circle cx="320" cy="70" r="60" fill={LIME} opacity={0.35} />
          <GrainHead x={150} y={250} scale={1.5} color={G900} rotate={-8} />
          <GrainHead x={210} y={260} scale={1.3} color={G600} rotate={6} />
          <GrainHead x={95} y={255} scale={1.1} color={G600} rotate={-18} />
          <Leaf x={300} y={250} scale={1.1} color={G600} rotate={20} />
        </>,
      );
      break;
    case "rice":
      art = frame(
        <>
          <rect width="400" height="300" fill={SAGE} />
          <circle cx="80" cy="80" r="55" fill={LIME} opacity={0.3} />
          {/* scattered rice grains */}
          {Array.from({ length: 26 }).map((_, i) => {
            const cx = 60 + (i % 7) * 45 + (i % 2) * 14;
            const cy = 150 + Math.floor(i / 7) * 34;
            const cols = [G900, EARTH, G600, "#3a2b22"];
            return (
              <ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx={11}
                ry={5}
                fill={cols[i % cols.length]}
                transform={`rotate(${(i * 37) % 90} ${cx} ${cy})`}
              />
            );
          })}
          <Leaf x={330} y={120} scale={0.9} color={G600} rotate={-10} />
        </>,
      );
      break;
    case "mixes":
      art = frame(
        <>
          <rect width="400" height="300" fill={SAGE} />
          {/* bowl */}
          <path d="M90 150 H310 a110 110 0 0 1 -220 0 Z" fill={CREAM} />
          <path d="M90 150 H310 a110 110 0 0 1 -220 0 Z" fill="none" stroke={G900} strokeWidth={4} />
          <ellipse cx="200" cy="150" rx="110" ry="22" fill={LIME} opacity={0.4} />
          <ellipse cx="200" cy="150" rx="110" ry="22" fill="none" stroke={G900} strokeWidth={4} />
          {/* steam */}
          <path d="M170 120 q-12 -20 0 -40" stroke={G600} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />
          <path d="M230 120 q12 -20 0 -40" stroke={G600} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />
          <GrainHead x={330} y={250} scale={1.1} color={G600} rotate={12} />
          <Leaf x={70} y={250} scale={0.9} color={G600} rotate={-20} />
        </>,
      );
      break;
    case "bowl":
      art = frame(
        <>
          <rect width="400" height="300" fill={CREAM} />
          <ellipse cx="200" cy="240" rx="150" ry="20" fill={SAGE} />
          <path d="M70 165 H330 a130 130 0 0 1 -260 0 Z" fill={SAGE} />
          <path d="M70 165 H330 a130 130 0 0 1 -260 0 Z" fill="none" stroke={G900} strokeWidth={4} />
          <ellipse cx="200" cy="165" rx="130" ry="26" fill={LIME} opacity={0.45} />
          <ellipse cx="200" cy="165" rx="130" ry="26" fill="none" stroke={G900} strokeWidth={4} />
          {/* toppings */}
          {Array.from({ length: 10 }).map((_, i) => (
            <circle key={i} cx={120 + i * 18} cy={158 + (i % 2) * 8} r={4} fill={i % 2 ? EARTH : G600} />
          ))}
          <Leaf x={250} y={150} scale={0.5} color={G600} rotate={15} />
        </>,
      );
      break;
    case "hero":
      art = frame(
        <>
          <rect width="400" height="300" fill={SAGE} />
          <circle cx="300" cy="90" r="90" fill={LIME} opacity={0.3} />
          {/* pack silhouette */}
          <rect x="240" y="95" width="110" height="150" rx="14" fill={CREAM} stroke={G900} strokeWidth={4} />
          <rect x="262" y="120" width="66" height="44" rx="8" fill={LIME} opacity={0.6} />
          <circle cx="295" cy="195" r="22" fill="none" stroke={G600} strokeWidth={3} />
          <path d="M285 195 a10 12 0 0 1 20 0 Z" fill={G600} />
          {/* grains + leaves foreground */}
          <GrainHead x={90} y={255} scale={1.5} color={G900} rotate={-6} />
          <GrainHead x={140} y={262} scale={1.2} color={G600} rotate={10} />
          <Leaf x={60} y={250} scale={1.2} color={G600} rotate={-18} />
          <Leaf x={185} y={250} scale={0.9} color={LIME} rotate={22} />
        </>,
        "0 0 400 300",
      );
      break;
    case "origin":
      art = frame(
        <>
          <rect width="400" height="300" fill={SAGE} />
          {/* rolling field */}
          <path d="M0 220 Q100 180 200 210 T400 200 V300 H0 Z" fill={G600} opacity={0.35} />
          <path d="M0 250 Q120 220 240 248 T400 240 V300 H0 Z" fill={G900} opacity={0.4} />
          {/* sun */}
          <circle cx="320" cy="70" r="38" fill={LIME} opacity={0.6} />
          {/* grain rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <GrainHead key={i} x={50 + i * 58} y={240} scale={0.8} color={i % 2 ? G900 : G600} rotate={i % 2 ? 6 : -6} />
          ))}
        </>,
      );
      break;
    case "goal":
      art = frame(
        <>
          <rect width="400" height="300" fill={CREAM} />
          <circle cx="200" cy="150" r="92" fill={SAGE} />
          <Leaf x={200} y={205} scale={1.6} color={G600} rotate={0} />
          <Leaf x={200} y={205} scale={1.1} color={G900} rotate={-32} />
          <Leaf x={200} y={205} scale={1.1} color={LIME} rotate={32} />
        </>,
      );
      break;
    case "field":
    default:
      art = frame(
        <>
          <rect width="400" height="300" fill={SAGE} />
          <path d="M0 200 Q100 160 200 195 T400 185 V300 H0 Z" fill={G600} opacity={0.3} />
          <path d="M0 235 Q120 205 240 233 T400 225 V300 H0 Z" fill={G900} opacity={0.35} />
          <Leaf x={120} y={250} scale={1.3} color={G600} rotate={-12} />
          <Leaf x={300} y={250} scale={1.1} color={G900} rotate={14} />
          <circle cx="80" cy="70" r="34" fill={LIME} opacity={0.5} />
        </>,
      );
  }

  return (
    <div className={wrapClass} role="img" aria-label={title ?? "Fresh Origins illustration"}>
      {art}
    </div>
  );
}

/** Deterministic motif for a product, keyed by type/slug. */
export function productIllustration(input: {
  product_type?: string;
  slug?: string;
}): IllustrationName {
  if (input.product_type === "rice") return "rice";
  if (input.product_type === "millet") return "millets";
  if (input.slug?.includes("kanji") || input.slug?.includes("khichdi"))
    return "bowl";
  return "mixes";
}
