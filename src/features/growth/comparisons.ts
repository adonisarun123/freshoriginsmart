import type { Comparison } from "./types";

/**
 * Comparison pages (/compare/[slug]).
 *
 * Editorial rules (spec §8.3 health-content governance):
 *  - Nutrition values are approximate, per 100 g raw grain unless stated,
 *    drawn from published Indian food-composition data. Always presented as
 *    estimates, never label facts.
 *  - No disease-treatment claims. "Blood-sugar-conscious", "may suit",
 *    "tends to" framing only.
 */

export const comparisons: Comparison[] = [
  /* ── 1. Millets vs Rice ──────────────────────────────────────────── */
  {
    slug: "millets-vs-rice",
    metaTitle: "Millets vs Rice: Nutrition, GI & Daily-Meal Comparison",
    metaDescription:
      "Millets vs rice compared on fibre, protein, micronutrients, glycaemic behaviour, cooking, and cost — with a practical verdict for everyday Indian meals. Delivered in Bangalore & Hosur.",
    eyebrow: "Comparison · Grains",
    title: "Millets vs rice: which should be on your plate?",
    intro:
      "Both millets and rice have fed Indian households for centuries — this is not a contest with a loser. But they behave differently on the plate and in the body, and the practical question is when to choose which. Here's an honest, number-backed comparison.",
    inShort:
      "Millets generally bring more fibre, more protein, and more minerals per serving than polished white rice, and their higher fibre tends to make meals more filling. White rice wins on softness, cooking speed, and familiarity. For most households the answer is rotation, not replacement: keep rice in the week, and let millets carry two or three meals — or start with a 50:50 mix.",
    columns: ["Millets (typical range)", "White rice (polished)"],
    rows: [
      { label: "Dietary fibre (per 100 g raw)", values: ["~8–12 g", "~1 g"] },
      { label: "Protein (per 100 g raw)", values: ["~7–12 g", "~7 g"] },
      {
        label: "Minerals",
        values: [
          "Iron, calcium, magnesium vary by millet — ragi is notably high in calcium, bajra in iron",
          "Modest after polishing",
        ],
      },
      {
        label: "Glycaemic behaviour",
        values: [
          "Whole millets are digested more slowly, aided by fibre and intact structure",
          "Digested quickly; polished grain raises glucose faster",
        ],
      },
      { label: "Cooking time", values: ["~15–25 min (soaking helps)", "~12–15 min"] },
      {
        label: "Taste & texture",
        values: ["Nutty, slightly coarse; each millet differs", "Soft, neutral, universally familiar"],
      },
      { label: "Typical price (Bangalore retail)", values: ["~₹80–200/kg", "~₹50–150/kg"] },
    ],
    tableNote:
      "Values are approximate, per 100 g raw grain, compiled from published Indian food-composition data (IFCT). Cooked values differ with water ratio. Treat these as directional estimates, not label facts.",
    sections: [
      {
        heading: "Where millets genuinely win",
        paragraphs: [
          "Fibre is the headline difference. Whole millets carry roughly eight to twelve times the fibre of polished white rice, and that fibre does real work: it slows digestion, adds bulk, and makes a meal hold you longer. If your lunches disappear by 4 pm, this is usually the lever to pull.",
          "Minerals are the quieter win. Ragi (finger millet) is one of the richest everyday sources of calcium among grains; bajra (pearl millet) contributes meaningful iron; jowar and foxtail bring magnesium and B vitamins. Polishing strips much of this from white rice.",
          "Millets are also naturally free of gluten — relevant if your household avoids wheat — though cross-contact depends on how they're processed, so check pack labels if this matters clinically.",
        ],
      },
      {
        heading: "Where rice still deserves its place",
        paragraphs: [
          "Rice is soft, fast, and liked by everyone at the table — including toddlers, seniors, and anyone eating a gentle diet on a difficult stomach day. That is not nothing; a grain only helps if it actually gets eaten.",
          "Traditional rice varieties change this comparison significantly. Unpolished red, brown, and black rice keep their bran layer, so their fibre and mineral numbers sit much closer to millets than to white rice. If your family won't move off rice, moving from polished white to a traditional variety is the single easiest upgrade — our Traditional Rice Variety Pack exists for exactly this.",
        ],
      },
      {
        heading: "The practical answer: rotate, don't replace",
        paragraphs: [
          "Nutrition guidance in India consistently points the same way: diversify your grains rather than crowning one. A realistic week might look like rice three or four days (ideally a traditional variety some of those days), millets two or three days as khichdi, pongal, adai, or rotis, and a mixed pot on transition days.",
          "If you're switching from years of white rice, go gradual — a sudden fibre jump can be hard on digestion. Start with a 50:50 millet-rice mix in familiar dishes, and read our step-by-step guide on switching from white rice to millets for a week-by-week plan.",
        ],
      },
    ],
    verdict: [
      {
        title: "Choose millets when…",
        text: "You want meals that keep you full longer, you're building a higher-fibre or blood-sugar-conscious eating pattern, or you want more minerals from the same plate.",
      },
      {
        title: "Choose rice when…",
        text: "You need speed, softness, or familiarity — and prefer unpolished traditional varieties (red, brown, black) to keep the nutrition upgrade even on rice days.",
      },
      {
        title: "Best of both",
        text: "Rotate grains across the week, or use ready blends that pair millets with pulses so the swap needs zero new technique.",
      },
    ],
    productSlugs: ["metabolic-balance-khichdi", "traditional-rice-variety-pack"],
    productNote:
      "Both delivered across Bangalore and Hosur — order online or complete your purchase on WhatsApp.",
    faqs: [
      {
        q: "Is it OK to eat millets every day?",
        a: "For most people, yes — as part of a varied diet. Rotate different millets rather than eating one exclusively, drink enough water (fibre needs it), and increase quantity gradually. If you have a thyroid or kidney condition, discuss large daily amounts with your doctor.",
      },
      {
        q: "Do millets taste very different from rice?",
        a: "They're nuttier and slightly coarser. In mixed dishes — khichdi, pongal, upma, adai — the difference is small, which is why blends are the easiest starting point. Plain millet 'rice' takes a little more getting used to.",
      },
      {
        q: "Are millets more expensive than rice?",
        a: "Whole millets typically cost about the same as, or a little more than, mid-range rice — roughly ₹80–200/kg in Bangalore retail. Because millet meals tend to be more filling, per-meal cost often works out similar.",
      },
      {
        q: "Which is better for weight management?",
        a: "Meals that digest slowly and keep you satisfied tend to support weight management, and millets' fibre helps there. But the overall meal pattern — portions, vegetables, pulses, cooking fat — matters more than any single grain swap.",
      },
      {
        q: "Can children and seniors eat millets?",
        a: "Generally yes, in well-cooked, soft formats like khichdi, porridge, and dosa — softer preparations are gentler for both groups. Introduce gradually. For specific medical conditions, check with your paediatrician or doctor.",
      },
    ],
    related: [
      { label: "Switching from white rice to millets — a practical guide", href: "/learn/switching-from-white-rice-to-millets" },
      { label: "Best millets for blood-sugar-conscious eating", href: "/guides/best-millets-for-blood-sugar" },
      { label: "Red vs brown vs white rice compared", href: "/compare/red-rice-vs-brown-rice-vs-white-rice" },
      { label: "Buy millets online in Bangalore", href: "/millets-online-bangalore" },
    ],
    illustration: "millets",
  },

  /* ── 2. Millets vs Quinoa ────────────────────────────────────────── */
  {
    slug: "millets-vs-quinoa",
    metaTitle: "Millets vs Quinoa: Protein, Price & Practicality for Indian Kitchens",
    metaDescription:
      "Quinoa vs Indian millets like foxtail, jowar and bajra — protein quality, fibre, GI, cost per kg, and which suits Indian cooking. An honest comparison with numbers.",
    eyebrow: "Comparison · Grains",
    title: "Millets vs quinoa: does the imported 'supergrain' beat our own?",
    intro:
      "Quinoa earned its reputation honestly — it's a genuinely nutritious seed. The question for an Indian kitchen isn't whether quinoa is good, but whether it's meaningfully better than millets that cost a third as much and were bred for this land and this cuisine. Numbers first, verdict after.",
    inShort:
      "Nutritionally, quinoa and millets are far closer than the price gap suggests. Quinoa edges ahead on protein completeness (all nine essential amino acids); millets like foxtail and bajra match or beat it on fibre and minerals, cost roughly one-third to one-fifth as much, and slot into Indian dishes without recipe surgery. If you enjoy quinoa, keep it. If you're choosing one for everyday Indian meals, millets — especially paired with dal — are the smarter default.",
    columns: ["Foxtail millet", "Bajra (pearl millet)", "Quinoa"],
    rows: [
      { label: "Protein (per 100 g raw)", values: ["~12 g", "~11 g", "~14 g"] },
      { label: "Fibre (per 100 g raw)", values: ["~8 g", "~11 g", "~7 g"] },
      {
        label: "Protein quality",
        values: [
          "Limiting in lysine — completed by pairing with dal",
          "Limiting in lysine — completed by pairing with dal",
          "Complete (all essential amino acids)",
        ],
      },
      { label: "Iron", values: ["~2.8 mg", "~8 mg", "~4.6 mg"] },
      { label: "Typical Indian retail price", values: ["~₹100–180/kg", "~₹80–150/kg", "~₹400–900/kg"] },
      { label: "Food miles", values: ["Grown in Karnataka & neighbouring states", "Grown across India", "Mostly imported (South America) or niche Indian cultivation"] },
      {
        label: "Fits Indian cooking?",
        values: ["Naturally — pongal, upma, 'rice'", "Naturally — rotis, khichdi", "Adapted — salads, pulao-style"],
      },
    ],
    tableNote:
      "Approximate values per 100 g raw, compiled from published food-composition data (IFCT and USDA). Prices are typical Bangalore retail ranges and vary by brand and season.",
    sections: [
      {
        heading: "The protein story, honestly told",
        paragraphs: [
          "Quinoa's real advantage is protein completeness: it carries all nine essential amino acids in useful amounts, which is rare in the plant world. Millets, like most cereals, are limiting in lysine.",
          "But Indian cuisine solved this problem generations before the word 'amino acid' existed. Pulses are rich in exactly the lysine that grains lack — so dal-and-millet, adai, khichdi, and pongal deliver complete protein as a matter of course. Judge the meal, not the isolated grain, and the gap effectively closes.",
        ],
      },
      {
        heading: "Price, food miles, and what ₹500/kg buys you",
        paragraphs: [
          "Imported quinoa typically retails between ₹400 and ₹900 per kilo in Indian metros; foxtail millet sits around ₹100–180. For a family cooking a grain base five times a week, that difference compounds into thousands of rupees a year for — as the table shows — broadly comparable nutrition.",
          "There's also a sourcing argument. Millets are rainfed, low-water crops grown by dryland farmers in Karnataka and neighbouring states; buying them supports regional agriculture and keeps food miles short. Quinoa's journey to your plate is usually intercontinental.",
        ],
      },
      {
        heading: "Where quinoa genuinely fits",
        paragraphs: [
          "None of this makes quinoa a mistake. It cooks fast, works beautifully in salads and grain bowls, and its complete protein is convenient if your meals don't reliably include pulses. If that's your eating pattern, quinoa earns its price.",
          "For everyday Indian cooking, though — where dal is already on the table and the grain needs to behave like rice or flour — millets do the job natively, at local prices, with flavours the household already recognises.",
        ],
      },
    ],
    verdict: [
      {
        title: "Choose millets when…",
        text: "You're cooking Indian meals with pulses in the rotation, you care about cost per meal, or you want to buy regional and low-water. This is the everyday default.",
      },
      {
        title: "Choose quinoa when…",
        text: "You want a fast, complete-protein base for salads and bowls, or your meals often skip dal and you want the amino-acid insurance.",
      },
      {
        title: "Either way",
        text: "Grain + pulse beats grain alone. That's the actual nutrition headline, whichever seed you pick.",
      },
    ],
    productSlugs: ["protein-and-fibre-adai-mix", "metabolic-balance-khichdi"],
    productNote:
      "Our blends pair millets with pulses precisely for protein completeness — the quinoa question, answered the Indian way.",
    faqs: [
      {
        q: "Is quinoa healthier than millets?",
        a: "Not meaningfully, for most purposes. Quinoa has more complete protein; several millets have more fibre and iron. In an Indian diet where grains are eaten with pulses, the practical nutrition of the full meal is very similar.",
      },
      {
        q: "Which millet is closest to quinoa?",
        a: "Foxtail millet is the usual comparison — similar protein, similar cooking behaviour, and it works in most recipes that call for quinoa, at a fraction of the price.",
      },
      {
        q: "Is quinoa grown in India?",
        a: "Some is now cultivated in Rajasthan, Andhra Pradesh, and other states, but most supermarket quinoa is still imported. Millets, by contrast, are grown at scale across the Deccan, including Karnataka.",
      },
      {
        q: "I'm vegetarian and worried about protein. Quinoa or millets?",
        a: "Either works — the key is pairing grains with pulses, dairy, nuts, or seeds across the day. A millet-pulse dish like adai or khichdi delivers complete protein without needing quinoa at all.",
      },
    ],
    related: [
      { label: "Pairing grains and pulses for complete protein", href: "/learn/pairing-grains-and-pulses" },
      { label: "Foxtail millet — the complete guide", href: "/learn/millet-foxtail" },
      { label: "Millets vs rice compared", href: "/compare/millets-vs-rice" },
      { label: "Best millets to start with", href: "/guides/millets-for-beginners" },
    ],
    illustration: "field",
  },

  /* ── 3. Jowar vs Bajra vs Ragi ───────────────────────────────────── */
  {
    slug: "jowar-vs-bajra-vs-ragi",
    metaTitle: "Jowar vs Bajra vs Ragi: Which Millet for Which Job?",
    metaDescription:
      "India's three big millets compared — jowar, bajra and ragi on nutrition, taste, rotis, seasons, and who each one suits best. With approximate IFCT-based numbers.",
    eyebrow: "Comparison · Millets",
    title: "Jowar vs bajra vs ragi: which millet does which job?",
    intro:
      "These are India's three heavyweight millets — jowar (sorghum), bajra (pearl millet), and ragi (finger millet). They're often lumped together as 'millets', but they differ usefully: in minerals, in season, in the dishes they're best at. Knowing which does which job makes your rotation smarter.",
    inShort:
      "All three are excellent whole grains — pick by job, not by ranking. Ragi stands out for calcium (among the highest of any everyday grain) and makes superb porridge and soft mudde. Bajra leads on iron and energy density and shines in winter rotis. Jowar is the mildest all-rounder — the easiest roti flour to start with and gentle enough for everyday use. The best answer is all three, rotated.",
    columns: ["Jowar (sorghum)", "Bajra (pearl millet)", "Ragi (finger millet)"],
    rows: [
      { label: "Protein (per 100 g raw)", values: ["~10 g", "~11 g", "~7 g"] },
      { label: "Fibre (per 100 g raw)", values: ["~10 g", "~11 g", "~11 g"] },
      { label: "Standout mineral", values: ["Magnesium, B vitamins", "Iron (~8 mg)", "Calcium (~344 mg — exceptional)"] },
      { label: "Taste", values: ["Mild, neutral", "Nutty, robust, slightly bitter edge", "Earthy, distinctive"] },
      { label: "Best-known dishes", values: ["Jowar bhakri/roti, dosa", "Bajra roti, khichdi, winter porridges", "Ragi mudde, ragi malt/porridge, dosa"] },
      { label: "Traditional season", values: ["Year-round", "Winter (warming)", "Year-round; summer ragi malt is classic"] },
      { label: "Easiest for beginners?", values: ["Yes — mildest flavour", "Moderate — stronger taste", "Moderate — distinctive taste, loved in the South"] },
    ],
    tableNote:
      "Approximate values per 100 g raw grain from published Indian food-composition data (IFCT 2017). Individual lots vary; treat as directional.",
    sections: [
      {
        heading: "Ragi: the calcium specialist",
        paragraphs: [
          "Ragi's calcium content — roughly 344 mg per 100 g — is in a different league from other grains, which typically manage 10–50 mg. For households light on dairy, growing children, and seniors thinking about bone health, ragi porridge or mudde is one of the simplest food-first ways to add calcium to the day.",
          "It also ferments beautifully (ragi dosa, ambali), and fermentation is a traditional technique that tends to improve mineral availability. Read our full ragi-family explainer in the Learn section for preparation details.",
        ],
      },
      {
        heading: "Bajra: winter fuel with serious iron",
        paragraphs: [
          "Bajra is the energy-dense one — the grain of Rajasthani and Deccan winters, eaten as thick rotis with jaggery and ghee. Its iron content (~8 mg/100 g) is the highest of the three, which matters in a country where iron intake commonly runs low, especially for women.",
          "Its robust, nutty flavour is the strongest of the trio. If your household is new to millets, introduce bajra blended with other flours first — which is exactly how our roti mix uses it.",
        ],
      },
      {
        heading: "Jowar: the everyday all-rounder",
        paragraphs: [
          "Jowar is the diplomat: mild enough that jowar rotis pass the family test on day one, with fibre and magnesium numbers that still comfortably beat wheat or white rice. Maharashtrian and North Karnataka kitchens have run on jowar bhakri for generations.",
          "If you're choosing a single millet to begin your rotation, jowar is usually the right first pick — then add ragi for calcium days and bajra for winter.",
        ],
      },
    ],
    verdict: [
      { title: "Pick ragi for…", text: "Calcium — porridges, mudde, malt, and dosa. Especially relevant for low-dairy households, children, and seniors." },
      { title: "Pick bajra for…", text: "Iron and winter warmth — hearty rotis and khichdi in the cooler months." },
      { title: "Pick jowar for…", text: "Everyday rotis and the gentlest introduction to millets for a hesitant family." },
    ],
    productSlugs: ["gluten-free-protein-and-fibre-roti-mix", "metabolic-balance-khichdi"],
    productNote:
      "Our roti mix blends millet and pulse flours so you get the benefits without managing three separate flour tins.",
    faqs: [
      {
        q: "Can I mix jowar, bajra and ragi flours together?",
        a: "Yes — multi-millet flour is a time-honoured approach and balances flavour, nutrition, and roti texture. A common starting ratio is more jowar (for mildness), less bajra and ragi, adjusted to taste.",
      },
      {
        q: "Which of the three is best for weight management?",
        a: "All three are high-fibre whole grains that digest slowly; differences between them matter far less than portion size and what accompanies the roti. Choose the one your household will actually eat regularly.",
      },
      {
        q: "Is bajra only for winter?",
        a: "Tradition treats bajra as warming and favours it in winter, but there's no rule against eating it year-round in moderate quantities. Many households simply prefer lighter millets in peak summer.",
      },
      {
        q: "Which millet roti tastes closest to wheat?",
        a: "Jowar, by most accounts. Blends that include some rice or pulse flour (like ours) get even closer in softness and rollability.",
      },
    ],
    related: [
      { label: "Jowar (sorghum) — the complete guide", href: "/learn/millet-jowar-sorghum" },
      { label: "Bajra (pearl millet) — the complete guide", href: "/learn/millet-bajra-pearl" },
      { label: "Millets vs rice compared", href: "/compare/millets-vs-rice" },
      { label: "Gluten-free flour options in Bangalore", href: "/gluten-free-flour-bangalore" },
    ],
    illustration: "millets",
  },

  /* ── 4. Red vs Brown vs White rice ───────────────────────────────── */
  {
    slug: "red-rice-vs-brown-rice-vs-white-rice",
    metaTitle: "Red Rice vs Brown Rice vs White Rice: An Honest Comparison",
    metaDescription:
      "Red, brown and white rice compared on fibre, minerals, glycaemic behaviour, taste, and cooking. Why the bran layer matters, and where black rice fits in.",
    eyebrow: "Comparison · Traditional Rice",
    title: "Red rice vs brown rice vs white rice: what the bran layer changes",
    intro:
      "These are usually the same species of rice at different levels of processing — the differences come mostly from what's been removed. White rice is fully polished; brown keeps its bran; traditional reds and blacks keep their bran and add pigments of their own. That one fact drives almost everything in the table below.",
    inShort:
      "The less polished the rice, the more fibre and minerals survive. Red and brown rice are nutritionally close cousins — both keep the bran layer, giving them several times the fibre of white rice plus slower digestion; red rice adds anthocyanin-family pigments in its coat. White rice is softer and faster but nutritionally lightest. If your family is rice-first, moving even two or three meals a week from white to a traditional red, brown, or black variety is a meaningful upgrade with zero recipe changes.",
    columns: ["White (polished)", "Brown (unpolished)", "Traditional red"],
    rows: [
      { label: "Bran layer", values: ["Removed", "Intact", "Intact + pigmented coat"] },
      { label: "Fibre (per 100 g raw)", values: ["~1 g", "~3–4 g", "~3–5 g"] },
      { label: "Minerals (iron, magnesium, zinc)", values: ["Low after polishing", "Substantially retained", "Substantially retained"] },
      { label: "Digestion speed", values: ["Fast", "Slower (bran + fibre)", "Slower (bran + fibre)"] },
      { label: "Cook time", values: ["~12–15 min", "~25–40 min (soak helps)", "~25–40 min (soak helps)"] },
      { label: "Taste & texture", values: ["Soft, neutral", "Chewy, nutty", "Chewy, earthy, distinctive"] },
      { label: "Shelf life", values: ["Long", "Shorter (bran oils) — buy fresher, store airtight", "Shorter — same care as brown"] },
    ],
    tableNote:
      "Approximate values per 100 g raw, from published food-composition data; varietal variation is real (Kerala Matta, Mappillai Samba, and other heritage reds each differ). Black rice, a pigmented whole rice, behaves like red rice nutritionally with its own anthocyanin profile.",
    sections: [
      {
        heading: "Why the bran layer is the whole story",
        paragraphs: [
          "Rice bran carries most of the grain's fibre, oils, B vitamins, and minerals. Polishing it away yields the white rice most of India eats daily — softer and quicker, but nutritionally hollowed out. Brown, red, and black rices are 'whole' in the same sense millets are: nothing important has been milled off.",
          "The intact bran also physically slows digestion, which is why unpolished rices sit better in a blood-sugar-conscious meal pattern than polished white — particularly when the plate also includes dal and vegetables.",
        ],
      },
      {
        heading: "Red and black: pigments with a purpose",
        paragraphs: [
          "The colour in red and black rice isn't cosmetic — it comes from polyphenol and anthocyanin pigments concentrated in the outer layers, the same family of compounds that colour berries. Heritage varieties like Kerala's Matta or Tamil Nadu's Mappillai Samba carry these along with their distinctive, satisfying taste.",
          "Practically: red rice makes excellent everyday rice and kanji; black rice shines in porridges and even sweet preparations. Both reward a 20–30 minute soak before cooking.",
        ],
      },
      {
        heading: "Making the switch without a family revolt",
        paragraphs: [
          "Texture, not nutrition, is where switches fail. Unpolished rice is chewier, and expectations matter more than recipes. Start by blending — one part red or brown into two parts your usual rice — and shift the ratio over a few weeks. Pressure cooking with a little extra water softens traditional varieties considerably.",
          "Our Traditional Rice Variety Pack includes red, black, and brown heritage rices with cooking ratios on the pack, so you can find your household's favourite before committing to full bags.",
        ],
      },
    ],
    verdict: [
      { title: "Choose white when…", text: "Speed and softness are non-negotiable — and consider pairing it with dal and vegetables to slow the meal down." },
      { title: "Choose brown when…", text: "You want the whole-grain upgrade with the most neutral flavour of the unpolished options." },
      { title: "Choose red or black when…", text: "You want bran-layer nutrition plus heritage-variety pigments and taste — the fullest version of what rice can be." },
    ],
    productSlugs: ["traditional-rice-variety-pack", "heritage-gut-fibre-kanji-mix"],
    productNote:
      "The variety pack is the low-risk way to find which traditional rice your family actually enjoys.",
    faqs: [
      {
        q: "Is red rice better than brown rice?",
        a: "They're close. Both keep the bran, so fibre and minerals are similar; red rice adds pigment compounds in its coloured coat. Choose by taste and availability rather than agonising over the difference.",
      },
      {
        q: "Why does brown or red rice take longer to cook?",
        a: "The intact bran layer resists water. Soaking 20–30 minutes, using a bit more water, or pressure cooking closes most of the time gap.",
      },
      {
        q: "Does unpolished rice spoil faster?",
        a: "The natural oils in bran can go rancid over months, so buy quantities you'll finish in 2–3 months and store airtight, away from heat. In hot kitchens, the fridge extends life.",
      },
      {
        q: "Is white rice unhealthy, then?",
        a: "No — it's simply the least nutrient-dense form. In a balanced plate with dal, vegetables, and curd, white rice has fed generations perfectly well. The point is that unpolished varieties give you more per spoonful, so shifting some meals over is an easy win.",
      },
      {
        q: "Where does black rice fit?",
        a: "Black rice is a pigmented whole rice — bran intact, with a deep anthocyanin colour that turns purple on cooking. Nutritionally it sits with red rice; treat it as a specialty rotation rice for porridges and festive dishes.",
      },
    ],
    related: [
      { label: "Traditional red rice — the complete guide", href: "/learn/rice-traditional-red" },
      { label: "Black rice — the complete guide", href: "/learn/rice-black" },
      { label: "Millets vs rice compared", href: "/compare/millets-vs-rice" },
      { label: "Buy traditional rice online in Bangalore", href: "/traditional-rice-online-bangalore" },
    ],
    illustration: "rice",
  },
];

export function getComparisonSlugs(): string[] {
  return comparisons.map((c) => c.slug);
}

export function getComparisonBySlug(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}
