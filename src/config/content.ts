/**
 * Editable launch content — the bits you'll swap from placeholder to real.
 *
 * TWO THINGS TO UPDATE BEFORE / AROUND LAUNCH:
 *  1. testimonials — replace the sample entries with real, permissioned
 *     customer quotes, then set `testimonialsAreSample` to false. That flag
 *     removes the "sample / illustrative only" disclaimers and the
 *     "(sample rating)" screen-reader text automatically.
 *  2. fssaiLicence — put your real FSSAI licence number here once issued.
 *     While empty, the footer shows "FSSAI licence to be confirmed".
 *
 * Everything here is plain data — no code changes needed to update it.
 */

export interface Testimonial {
  quote: string;
  name: string;
  city: string;
}

/** Set to false once `testimonials` holds real, verified customer reviews. */
export const testimonialsAreSample = true;

export const testimonials: Testimonial[] = [
  {
    quote:
      "Swapping our weeknight rice for the millet khichdi was effortless — the family didn't even notice the change, except it kept us full longer.",
    name: "Ananya R.",
    city: "Bangalore",
  },
  {
    quote:
      "I like that the packs spell out the grains and allergens plainly. It made choosing a higher-fibre staple a simple decision.",
    name: "Vikram S.",
    city: "Hosur",
  },
  {
    quote:
      "Ordering on WhatsApp was quick and personal — they confirmed delivery for my area and the food arrived fresh.",
    name: "Meera K.",
    city: "Bangalore",
  },
];

/**
 * Real FSSAI licence number (14 digits) once issued — leave empty until then.
 * e.g. "10012345678901"
 */
export const fssaiLicence = "";
