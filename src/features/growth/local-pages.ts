import type { LocalPage } from "./types";

/**
 * Local-intent landing pages (top-level city routes).
 *
 * These are the money pages for the queries Fresh Origins can genuinely win:
 * we actually deliver in Bangalore and Hosur, which national marketplaces
 * and out-of-region D2C brands cannot say about their generic city pages.
 *
 * Truthfulness rules: delivery specifics (charges, thresholds, timelines)
 * live in the delivery_zones data and can change — pages phrase them as
 * "typically" and point to the pincode check / shipping policy rather than
 * hard-coding promises. Neighbourhood lists say "including … with more
 * areas added" — never "all areas".
 */

export const localPages: LocalPage[] = [
  /* ── 1. Millets online — Bangalore ───────────────────────────────── */
  {
    slug: "millets-online-bangalore",
    city: "Bangalore",
    metaTitle: "Buy Millets Online in Bangalore — Millet Blends Delivered",
    metaDescription:
      "Buy millet-based staples online in Bangalore: khichdi, adai, kanji and roti blends built on foxtail, jowar, bajra and more. Doorstep delivery, typically 2–3 working days. Order online or on WhatsApp.",
    eyebrow: "Bangalore · Doorstep delivery",
    title: "Buy millets online in Bangalore",
    intro:
      "Fresh Origins is a Bangalore-first traditional-foods brand: millet-and-pulse blends and heritage rice, sourced thoughtfully and delivered to your door across the city. No marketplace middlemen, no mystery sourcing — and if you prefer, you can complete your whole order on WhatsApp.",
    inShort:
      "We deliver millet-based staples across Bangalore, typically within 2–3 working days — ready-to-cook khichdi, adai, kanji and roti blends built on millets like foxtail, jowar and bajra, plus traditional rice varieties. Order online or on WhatsApp, and check your pincode on any product page before you pay.",
    categorySlug: "ready-to-cook-mixes",
    productsHeading: "Millet staples we deliver in Bangalore",
    whyUs: [
      {
        title: "Blends, not just raw grain",
        text: "Anyone can ship you a kilo of foxtail. Our packs pair millets with pulses in dishes your kitchen already knows — khichdi, adai, kanji, rotis — so the healthy swap needs zero new technique.",
      },
      {
        title: "Claim discipline you can check",
        text: "Nutrition values are labelled estimated or tested, never inflated; allergens and facility practices are declared plainly. A food-health brand should be auditable, and ours is built that way.",
      },
      {
        title: "WhatsApp-assisted ordering",
        text: "Browse online, then finish your order in a WhatsApp chat with a real person — useful for first orders, delivery questions, or building a repeat monthly basket.",
      },
      {
        title: "Local by design",
        text: "We serve Bangalore and Hosur only, which means short, fresh supply lines — millets are best eaten within months of milling, not after a year in a national warehouse.",
      },
    ],
    areasHeading: "Where in Bangalore do you deliver?",
    areasIntro:
      "We deliver across Bangalore's serviceable pincodes — including areas such as:",
    areas: [
      "Indiranagar",
      "Koramangala",
      "HSR Layout",
      "Whitefield",
      "JP Nagar",
      "Jayanagar",
      "Marathahalli",
      "Bellandur",
      "Malleshwaram",
      "MG Road / Central Bangalore",
    ],
    deliveryHeading: "Delivery, timelines & charges",
    deliveryParagraphs: [
      "Orders in Bangalore typically arrive within 2–3 working days. Delivery is charged at a flat, clearly-shown rate at checkout, and becomes free above the order threshold shown on the cart page.",
      "Every product page has a pincode check — use it before paying and you'll never order something we can't bring to you. New pincodes are added as we grow; if yours isn't covered yet, message us on WhatsApp and we'll tell you honestly when it will be.",
    ],
    faqs: [
      {
        q: "Do you deliver millets anywhere in Bangalore?",
        a: "We cover a growing list of Bangalore pincodes — check yours with the pincode tool on any product page. If we can't serve you yet, WhatsApp us and we'll let you know when your area comes online.",
      },
      {
        q: "How fast is millet delivery in Bangalore?",
        a: "Typically 2–3 working days from order confirmation. Exact estimates show at checkout for your pincode.",
      },
      {
        q: "Do you sell raw millets or only blends?",
        a: "Our current range centres on ready-to-cook millet-pulse blends and a traditional rice variety pack — formats designed so the switch to millets actually sticks. The range grows over time; the shop page always shows what's live.",
      },
      {
        q: "Can I order millets on WhatsApp in Bangalore?",
        a: "Yes — add products to your cart and choose the WhatsApp option, or start a chat directly. A real person confirms your order, address, and delivery date.",
      },
      {
        q: "Is there free delivery?",
        a: "Yes, above an order-value threshold shown in your cart; below it, a flat delivery charge applies. Both are always displayed before you pay.",
      },
    ],
    related: [
      { label: "Millets for beginners — what to buy first", href: "/guides/millets-for-beginners" },
      { label: "Millets vs rice: an honest comparison", href: "/compare/millets-vs-rice" },
      { label: "Buy traditional rice online in Bangalore", href: "/traditional-rice-online-bangalore" },
      { label: "Delivering in Hosur too", href: "/millets-online-hosur" },
    ],
    illustration: "millets",
  },

  /* ── 2. Millets online — Hosur ───────────────────────────────────── */
  {
    slug: "millets-online-hosur",
    city: "Hosur",
    metaTitle: "Buy Millets Online in Hosur — Doorstep Delivery",
    metaDescription:
      "Millet khichdi, adai, kanji and roti blends delivered to your door in Hosur, typically in 3–4 working days. Order online or complete your purchase on WhatsApp.",
    eyebrow: "Hosur · Doorstep delivery",
    title: "Buy millets online in Hosur",
    intro:
      "Good millet staples shouldn't require a trip to Bangalore. Fresh Origins delivers millet-and-pulse blends and traditional rice varieties to doorsteps across Hosur — one of only two cities we serve, which keeps our supply lines short and our stock fresh.",
    inShort:
      "We deliver millet-based staples across Hosur, typically within 3–4 working days — khichdi, adai, kanji and roti blends plus heritage rice varieties. Hosur is a core service city for us, not an afterthought pin on a national map. Order online or finish your purchase on WhatsApp.",
    categorySlug: "ready-to-cook-mixes",
    productsHeading: "Millet staples we deliver in Hosur",
    whyUs: [
      {
        title: "Hosur is core, not courier-extra",
        text: "Most online grain brands reach Hosur as a distant courier zone with week-long timelines. We planned for Hosur from day one — it's one of exactly two cities we serve.",
      },
      {
        title: "Familiar dishes, upgraded grains",
        text: "Khichdi, adai, kanji, rotis — our blends put millets and pulses into formats Hosur kitchens already cook daily. No recipe learning curve.",
      },
      {
        title: "WhatsApp ordering, in your language",
        text: "Complete your order in a WhatsApp chat — ask about delivery to your area, ingredients, or preparation before you pay.",
      },
      {
        title: "Honest labels",
        text: "Estimated vs tested nutrition values are marked as such, allergens declared plainly, and no miracle claims anywhere. Just good grain, described truthfully.",
      },
    ],
    areasHeading: "Where in Hosur do you deliver?",
    areasIntro:
      "We deliver across Hosur's serviceable pincodes — including areas such as:",
    areas: [
      "Hosur Town",
      "SIPCOT / Industrial Area",
      "Bagalur Road",
      "Mathigiri",
      "Avalapalli",
      "Zuzuvadi",
    ],
    deliveryHeading: "Delivery, timelines & charges",
    deliveryParagraphs: [
      "Orders in Hosur typically arrive within 3–4 working days. Delivery charges and the free-delivery threshold are shown clearly in your cart before payment.",
      "Check your pincode on any product page before ordering. If your area isn't serviceable yet, tell us on WhatsApp — Hosur coverage is actively expanding, and we'd rather say 'two weeks' honestly than take an order we can't fulfil.",
    ],
    faqs: [
      {
        q: "Do you really deliver to Hosur, or only Bangalore?",
        a: "Hosur is one of our two service cities, with its own delivery zone and pincodes. Typical delivery is 3–4 working days.",
      },
      {
        q: "Which Hosur pincodes do you cover?",
        a: "A growing list — verify yours with the pincode check on any product page, or ask on WhatsApp. Coverage expands as we grow.",
      },
      {
        q: "Can I pay on delivery in Hosur?",
        a: "Payment options are shown at checkout; for WhatsApp-assisted orders, our team confirms current payment methods in the chat.",
      },
      {
        q: "What millet products can I get in Hosur?",
        a: "The same full range as Bangalore: millet-pulse khichdi, adai, and kanji blends, a gluten-free roti mix, and a traditional rice variety pack.",
      },
    ],
    related: [
      { label: "Millets for beginners — what to buy first", href: "/guides/millets-for-beginners" },
      { label: "Best millets for blood-sugar-conscious eating", href: "/guides/best-millets-for-blood-sugar" },
      { label: "Our Bangalore delivery page", href: "/millets-online-bangalore" },
      { label: "How we source our grains", href: "/our-sourcing" },
    ],
    illustration: "field",
  },

  /* ── 3. Traditional rice — Bangalore ─────────────────────────────── */
  {
    slug: "traditional-rice-online-bangalore",
    city: "Bangalore",
    metaTitle: "Buy Traditional Rice Online in Bangalore — Red, Black & Brown",
    metaDescription:
      "Heritage red, black and brown rice delivered in Bangalore. Unpolished, bran-intact varieties with origin details and cooking ratios — typically at your door in 2–3 working days.",
    eyebrow: "Bangalore · Traditional rice",
    title: "Buy traditional rice online in Bangalore",
    intro:
      "Before polished white rice became the default, India ate red, brown, and black — varieties with their bran intact and their character intact too. We deliver these traditional rices across Bangalore, with origin details and cooking ratios on every pack, because switching back should be easy.",
    inShort:
      "We deliver unpolished traditional rice — red, black, and brown heritage varieties — across Bangalore, typically in 2–3 working days. Bran-intact rice carries several times the fibre and minerals of polished white, and our variety pack lets you find your family's favourite before committing to a full bag. Order online or on WhatsApp.",
    categorySlug: "traditional-rice",
    productsHeading: "Traditional rice we deliver in Bangalore",
    whyUs: [
      {
        title: "Bran-intact, by definition",
        text: "Red, black, and brown rices keep the layer polishing throws away — where most of rice's fibre, minerals, and character live.",
      },
      {
        title: "Origin and ratio on the pack",
        text: "Each variety comes with where it's from and how to cook it — water ratios and soak times included — so the first pot comes out right.",
      },
      {
        title: "Variety pack first",
        text: "Taste is personal. The variety pack exists so you can try red, black, and brown in one order and let the family vote before you buy big.",
      },
      {
        title: "Fresh, local supply",
        text: "Unpolished rice keeps its natural bran oils, so it's best bought fresher and eaten sooner — a two-city delivery footprint makes that possible.",
      },
    ],
    areasHeading: "Where in Bangalore do you deliver?",
    areasIntro:
      "We deliver across Bangalore's serviceable pincodes — including areas such as:",
    areas: [
      "Indiranagar",
      "Koramangala",
      "HSR Layout",
      "Whitefield",
      "JP Nagar",
      "Jayanagar",
      "Malleshwaram",
      "Basavanagudi",
      "Marathahalli",
      "Central Bangalore",
    ],
    deliveryHeading: "Delivery, timelines & charges",
    deliveryParagraphs: [
      "Bangalore orders typically arrive within 2–3 working days; charges and the free-delivery threshold are shown in your cart before payment.",
      "Use the pincode check on any product page to confirm serviceability first — and store your rice airtight once it arrives, since bran-intact varieties reward a little care.",
    ],
    faqs: [
      {
        q: "What's the difference between red, black, and brown rice?",
        a: "All three keep their bran layer — that's the nutrition story. Red and black add pigment compounds (polyphenols and anthocyanins) in their coloured coats, plus distinctive tastes. Our full comparison page walks through the numbers.",
      },
      {
        q: "How do I cook traditional rice so it isn't chewy?",
        a: "Soak 20–30 minutes, use a little more water than for white rice, and pressure cook. The ratios printed on our packs are variety-specific.",
      },
      {
        q: "Is traditional rice good for diabetics?",
        a: "Bran-intact rice digests more slowly than polished white, which suits blood-sugar-conscious eating patterns — but no rice is a treatment, and portions still matter. Anyone managing diabetes should plan diet changes with their doctor or dietitian.",
      },
      {
        q: "Do you deliver heritage rice varieties like Kerala Matta style reds?",
        a: "Our variety pack features red, black, and brown regional varieties with origin details on the pack; the exact varieties in stock are shown on the product page.",
      },
    ],
    related: [
      { label: "Red vs brown vs white rice — full comparison", href: "/compare/red-rice-vs-brown-rice-vs-white-rice" },
      { label: "Traditional red rice — the complete guide", href: "/learn/rice-traditional-red" },
      { label: "Black rice — the complete guide", href: "/learn/rice-black" },
      { label: "Buy millets online in Bangalore", href: "/millets-online-bangalore" },
    ],
    illustration: "rice",
  },

  /* ── 4. Gluten-free flour — Bangalore ────────────────────────────── */
  {
    slug: "gluten-free-flour-bangalore",
    city: "Bangalore",
    metaTitle: "Gluten-Free Roti Flour in Bangalore — Millet Blend, Delivered",
    metaDescription:
      "Gluten-free roti mix delivered in Bangalore: millet, rice and pulse flours blended for rotis that roll and puff. Validated gluten-free, allergens declared, typically 2–3 day delivery.",
    eyebrow: "Bangalore · Gluten-free",
    title: "Gluten-free roti flour, delivered in Bangalore",
    intro:
      "Going wheat-free in a roti household is hard — single millet flours tear, and imported gluten-free blends cost a fortune and taste like cardboard. Our answer is a millet-rice-pulse blend built specifically for Indian flatbreads, validated gluten-free, and delivered across Bangalore.",
    inShort:
      "We deliver a gluten-free roti mix across Bangalore — millet flours for nutrition, rice flour for rollability, pulse flour for protein — with allergen and facility information declared plainly on the pack. Typically at your door in 2–3 working days; order online or on WhatsApp.",
    dietFilter: ["gluten-free"],
    productsHeading: "Gluten-free staples we deliver in Bangalore",
    whyUs: [
      {
        title: "Built for rotis, not adapted to them",
        text: "This isn't a generic 'GF flour' hoping to work in a tawa. The blend ratio exists to solve one problem: gluten-free rotis that roll, puff, and stay soft.",
      },
      {
        title: "Validated claims",
        text: "Under our claim-governance rules, 'gluten-free' is a validated flag, not a marketing adjective — and allergen and facility practices are printed plainly.",
      },
      {
        title: "Whole-grain nutrition kept",
        text: "Many GF products trade nutrition for texture using refined starches. Millet and pulse flours keep fibre and protein in the roti.",
      },
      {
        title: "Ask before you buy",
        text: "Coeliac household? Message us on WhatsApp and ask about facility practices before ordering. Honest answers, even when the honest answer is a caveat.",
      },
    ],
    areasHeading: "Where in Bangalore do you deliver?",
    areasIntro:
      "We deliver across Bangalore's serviceable pincodes — including areas such as:",
    areas: [
      "Indiranagar",
      "Koramangala",
      "HSR Layout",
      "Whitefield",
      "JP Nagar",
      "Jayanagar",
      "Marathahalli",
      "Hebbal",
      "Electronic City",
      "Central Bangalore",
    ],
    deliveryHeading: "Delivery, timelines & charges",
    deliveryParagraphs: [
      "Bangalore orders typically arrive within 2–3 working days, with charges and the free-delivery threshold shown in your cart before you pay.",
      "Check your pincode on the product page first. Questions about ingredients, allergens, or facility practices? WhatsApp us before ordering — that's what the chat is for.",
    ],
    faqs: [
      {
        q: "Is your roti mix certified gluten-free?",
        a: "The mix is formulated from naturally gluten-free grains and carries a validated gluten-free flag under our internal claim-governance rules, with allergen and facility information declared on the pack. If you have coeliac disease, review the pack declaration or ask us on WhatsApp before ordering.",
      },
      {
        q: "Why do gluten-free rotis usually break?",
        a: "No gluten means no stretch. Our blend counters this with rice flour for bind — plus two techniques: knead with hot water, and roll-and-cook each roti immediately. Our flour guide covers the details.",
      },
      {
        q: "What's actually in the blend?",
        a: "Millet flours, rice flour, and pulse flour — the full ingredient list, with percentages and allergen declarations, is on the product page and pack label.",
      },
      {
        q: "Do you deliver gluten-free flour to Hosur too?",
        a: "Yes — Hosur is our second service city, with typical delivery in 3–4 working days.",
      },
    ],
    related: [
      { label: "Best gluten-free flours for rotis — full guide", href: "/guides/best-gluten-free-flours-for-rotis" },
      { label: "Our gluten-free roti mix — the full story", href: "/learn/gluten-free-protein-fibre-roti-mix" },
      { label: "Jowar vs bajra vs ragi compared", href: "/compare/jowar-vs-bajra-vs-ragi" },
      { label: "Buy millets online in Bangalore", href: "/millets-online-bangalore" },
    ],
    illustration: "mixes",
  },
];

export function getLocalPageBySlug(slug: string): LocalPage | undefined {
  return localPages.find((p) => p.slug === slug);
}

export function getLocalPageSlugs(): string[] {
  return localPages.map((p) => p.slug);
}
