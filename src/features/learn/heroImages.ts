/**
 * Curated Unsplash hero photography for /learn articles, keyed by slug.
 *
 * Hotlinked from images.unsplash.com per Unsplash guidelines (no attribution
 * required; hotlinking preferred). Every photo was visually verified against
 * the article topic before being added — for grain species Unsplash rarely
 * has accurate close-ups, so dish-level or plausibly-generic photography is
 * used instead of risking a wrong-species close-up.
 *
 * Articles without an entry automatically fall back to their branded SVG
 * illustration (see learn/[slug]/page.tsx).
 */
export interface HeroImage {
  src: string;
  alt: string;
}

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1400&auto=format&fit=crop`;

export const HERO_IMAGES: Record<string, HeroImage> = {
  "millet-foxtail": {
    src: u("1775364856239-cbbe58bb4040"),
    alt: "Hand holding a bunch of fresh green millet seed heads",
  },
  "millet-barnyard": {
    src: u("1589899476489-2b5e3e2b323f"),
    alt: "Plate of soft savoury millet khichdi with vegetables and coriander",
  },
  "millet-little": {
    src: u("1610663711502-35f870cfaea2"),
    alt: "Small pale millet grains in a dark ceramic bowl",
  },
  "millet-kodo": {
    src: u("1583687463124-ff2aa00b1160"),
    alt: "Comforting bowl of mixed-grain porridge topped with nuts and honey",
  },
  "millet-proso": {
    src: u("1761724170883-b65f02738fbf"),
    alt: "Close-up of ripe yellow millet seed heads",
  },
  "millet-jowar-sorghum": {
    src: u("1758356860542-a2df92aad294"),
    alt: "Field of ripe red sorghum (jowar) ready for harvest",
  },
  "millet-bajra-pearl": {
    src: u("1639086407827-0dadcd5718c9"),
    alt: "Close-up of a pearl millet (bajra) seed head",
  },
  "rice-traditional-red": {
    src: u("1646980720696-5520b992c129"),
    alt: "Close-up of unpolished red rice grains with their bran layer",
  },
  "rice-black": {
    src: u("1623691307892-d6de6dfb2a8a"),
    alt: "Black rice grains spread on a wooden tray",
  },
  "rice-brown-heritage": {
    src: u("1680137248876-6ad53db8caef"),
    alt: "Bowl of cooked brown rice on a wooden table",
  },
  "metabolic-balance-khichdi": {
    src: u("1630409351211-d62ab2d24da4"),
    alt: "Bowl of yellow moong dal khichdi with whole pulses alongside",
  },
  "protein-fibre-adai-mix": {
    src: u("1743517894265-c86ab035adef"),
    alt: "Crisp golden savoury pancake served on a banana leaf with chutneys",
  },
  "heritage-gut-fibre-kanji-mix": {
    src: u("1678089664616-cf44bf88b6c5"),
    alt: "Soft rice kanji porridge in a white bowl with a spoon",
  },
  "gluten-free-protein-fibre-roti-mix": {
    src: u("1600935926387-12d9b03066f0"),
    alt: "Stack of soft homemade rotis on a checked kitchen cloth",
  },
  "switching-from-white-rice-to-millets": {
    src: u("1546833999-b9f581a1996d"),
    alt: "Traditional Indian thali with rice, roti, dal and vegetable dishes",
  },
  "pairing-grains-and-pulses": {
    src: u("1708436477916-f97964f3ccf1"),
    alt: "Assorted bowls of lentils and pulses on a kitchen table",
  },
  "fibre-rich-meal-planning": {
    src: u("1709236550338-e2bcc3beee70"),
    alt: "Market sacks filled with a variety of whole grains and millets",
  },
};
