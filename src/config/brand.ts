/**
 * Brand tokens mirrored for use in TS (charts, OG images, inline styles).
 * The canonical source for CSS is globals.css :root.
 */
export const brand = {
  colors: {
    green900: "#205830",
    green600: "#5aac55",
    green500: "#77b156",
    lime500: "#94b853",
    sage100: "#d9eacc",
    cream50: "#f7f5ec",
    earth700: "#6d4c3d",
    charcoal900: "#1f2a22",
    white: "#ffffff",
    whatsapp: "#25d366",
  },
  /** Maximum badges shown on a product card (spec §18.7). */
  maxProductBadges: 2,
} as const;
