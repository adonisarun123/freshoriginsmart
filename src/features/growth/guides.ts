import type { Guide } from "./types";

/**
 * Buying-guide pages (/guides/[slug]).
 *
 * Governance note: these are commercial-intent pages on a food-health site.
 * Framing rules are strict — "blood-sugar-conscious", "may support",
 * "tends to"; never "controls diabetes", "cures", "treats". Every page
 * renders the food/medical disclaimer.
 */

export const guides: Guide[] = [
  /* ── 1. Best millets for blood sugar ─────────────────────────────── */
  {
    slug: "best-millets-for-blood-sugar",
    metaTitle: "Best Millets for Blood-Sugar-Conscious Eating (Ranked & Explained)",
    metaDescription:
      "Which millets suit a blood-sugar-conscious diet? Foxtail, barnyard, little millet and more — ranked with reasons, portion guidance, and meal ideas. Educational, dietitian-reviewable content.",
    eyebrow: "Buying guide · Blood-sugar-conscious",
    title: "The best millets for blood-sugar-conscious eating",
    intro:
      "If you're building meals that digest slowly and avoid sharp glucose spikes, millets are among the most useful everyday swaps in Indian cooking — but they're not all equal, and how you cook them matters as much as which one you pick. Here's a practical, hype-free ranking.",
    inShort:
      "Whole millets digest more slowly than polished grains thanks to intact structure and fibre — useful in a blood-sugar-conscious eating pattern. Foxtail, barnyard, and little millet are the usual first picks; jowar and bajra work well in roti form. Two rules matter more than the ranking: eat millets whole (not as fine flour products alone), and pair them with dal and vegetables. Millets are food, not treatment — anyone managing diabetes should plan diet changes with their doctor or dietitian.",
    entriesHeading: "Our ranking, with reasons",
    entries: [
      {
        name: "1. Foxtail millet",
        why: "The best-studied everyday millet for slow digestion — good fibre (~8 g/100 g), high protein for a cereal (~12 g), and a texture that substitutes directly for rice in pongal, upma, and khichdi.",
        useIt: "Cook 1:2.5 with water as a rice substitute, or use a ready khichdi blend where it's already paired with moong dal.",
        learnHref: "/learn/millet-foxtail",
      },
      {
        name: "2. Barnyard millet",
        why: "The lightest and fastest-cooking of the majors, with notably high fibre for its softness. Its gentle texture makes the whole-grain habit easy to keep — consistency being what actually moves the needle.",
        useIt: "Khichdi and 'rice' formats; cooks in ~15 minutes, so it suits weeknights.",
        learnHref: "/learn/millet-barnyard",
      },
      {
        name: "3. Little millet",
        why: "Small grain, big fibre. Behaves like a softer rice and blends invisibly into familiar dishes — a stealth upgrade for households that resist visible change.",
        useIt: "Swap into any rice dish 50:50 to start; move to full swaps as taste adjusts.",
        learnHref: "/learn/millet-little",
      },
      {
        name: "4. Jowar (sorghum)",
        why: "The roti answer. Mild-tasting whole-grain flatbreads with ~10 g fibre per 100 g of grain — a direct upgrade over refined-flour rotis for the bread-first half of the plate.",
        useIt: "Jowar bhakri/roti, or a multi-grain roti blend for easier rolling.",
        learnHref: "/learn/millet-jowar-sorghum",
      },
      {
        name: "5. Bajra (pearl millet)",
        why: "High fibre (~11 g) and the best iron of the group; energy-dense, so portions deserve slightly more attention. A strong winter-rotation pick.",
        useIt: "Winter rotis and khichdi; blend with jowar for a milder everyday flour.",
        learnHref: "/learn/millet-bajra-pearl",
      },
    ],
    sections: [
      {
        heading: "The two rules that matter more than the ranking",
        paragraphs: [
          "Whole beats flour. A whole millet grain, cooked and eaten with its structure intact, digests more slowly than the same millet ground fine and baked into a snack. 'Millet' cookies and instant mixes made from fine flours lose much of the advantage — so favour whole-grain formats: khichdi, pongal, 'rice', porridge.",
          "Pairing beats everything. The glucose behaviour of a meal is set by the whole plate — grain plus dal plus vegetables plus fat digests very differently from grain alone. Traditional grain-pulse dishes are the template: they add protein and fibre and slow everything down. This is exactly why our blends are built as grain-plus-pulse rather than millet alone.",
        ],
      },
      {
        heading: "Portions, expectations, and honesty",
        paragraphs: [
          "Millets are not a licence for unlimited servings — they're carbohydrate foods, just slower ones. The usual starting point is the same portion you'd take of rice, watched for how it sits with you personally; responses vary between people more than marketing admits.",
          "And to be direct: no grain manages diabetes. Food pattern, activity, sleep, medication, and monitoring do — together, under professional guidance. What millets offer is a genuinely better default grain within that pattern. If you live with diabetes or prediabetes, bring these swaps to your doctor or dietitian and personalise from there.",
        ],
      },
    ],
    productSlugs: ["metabolic-balance-khichdi", "gluten-free-protein-and-fibre-roti-mix"],
    productNote:
      "Metabolic Balance Khichdi pairs whole millets with moong dal — the whole-grain, grain-plus-pulse pattern this guide recommends, in one pack. Delivered across Bangalore and Hosur.",
    faqs: [
      {
        q: "Which single millet is 'best' for diabetes?",
        a: "There's no single winner, and any page that names one is overselling. Foxtail, barnyard, and little millet are strong everyday picks in whole-grain form; consistency, portions, and pairing with dal matter more than the specific millet. Diet changes for diabetes belong in a plan made with your doctor.",
      },
      {
        q: "Do millet flour products count?",
        a: "Partially. Fine flours digest faster than whole grains, and packaged millet snacks may add refined flours, sugar, or a lot of fat. Whole-grain formats — or blends where whole millets and pulses are visible — keep the advantage.",
      },
      {
        q: "How much millet per meal?",
        a: "Start with your usual rice portion (commonly ½–1 cup cooked) and adjust to your own response and your dietitian's advice. More fibre also means drinking more water.",
      },
      {
        q: "Can I eat millets at night?",
        a: "Yes — lighter millets like barnyard in soft khichdi form are a common, comfortable dinner choice. Heavier preparations may suit lunch better; this is personal preference, not a rule.",
      },
    ],
    related: [
      { label: "Blood-Sugar-Conscious Eating — our health-goal page", href: "/health-goals/blood-sugar-conscious-eating" },
      { label: "Millets vs rice: full comparison", href: "/compare/millets-vs-rice" },
      { label: "Switching from white rice to millets", href: "/learn/switching-from-white-rice-to-millets" },
      { label: "Buy millets online in Bangalore", href: "/millets-online-bangalore" },
    ],
    illustration: "goal",
  },

  /* ── 2. Best millets & grains for weight management ──────────────── */
  {
    slug: "best-millets-for-weight-management",
    metaTitle: "Best Millets for Weight Management: A Practical, No-Hype Guide",
    metaDescription:
      "Which millets keep you full longest? A practical guide to using bajra, foxtail, little millet and whole-grain swaps for satiety and weight management — without fad claims.",
    eyebrow: "Buying guide · Everyday nutrition",
    title: "The best millets for weight management (and what they can't do)",
    intro:
      "The honest mechanism first: no grain burns fat. What high-fibre grains actually do is make meals more filling per calorie, digest slowly, and quiet the 4 pm snack pull — and that, sustained over months, is what supports weight management. Millets are unusually good at exactly this.",
    inShort:
      "For satiety per rupee, millets are hard to beat: their fibre (8–12 g per 100 g, versus ~1 g in white rice) slows digestion and keeps meals with you longer. Bajra and jowar lead for filling rotis; foxtail and little millet make satisfying rice-replacers; ragi porridge makes a breakfast that actually lasts till lunch. Pair them with dal and vegetables, watch cooking fat, and treat the swap as one steady habit — not a crash plan.",
    entriesHeading: "The picks, by meal",
    entries: [
      {
        name: "Breakfast: ragi porridge or millet adai",
        why: "A fibre-and-protein breakfast blunts mid-morning hunger better than refined options — ragi's ~11 g fibre plus adai's pulse protein are the workhorses here.",
        useIt: "Savoury ragi porridge with buttermilk, or adai from a millet-pulse batter with chutney.",
        learnHref: "/learn/fibre-rich-meal-planning",
      },
      {
        name: "Lunch: foxtail or little millet 'rice'",
        why: "Swapping polished rice for whole foxtail or little millet keeps the plate identical while multiplying its fibre several-fold — the highest-leverage single change for rice-first eaters.",
        useIt: "Cook like rice (1:2.5 water), serve with your usual dal and sabzi.",
        learnHref: "/learn/millet-foxtail",
      },
      {
        name: "Dinner: khichdi from a millet-pulse blend",
        why: "One-pot, gentle, and complete — grain-plus-pulse khichdi delivers protein and fibre together, which is the satiety combination that works.",
        useIt: "A ready blend removes the weeknight friction that kills good habits.",
      },
      {
        name: "Rotis: bajra or jowar (or a blend)",
        why: "Dense, chewy millet rotis take longer to eat and longer to digest than refined-flour alternatives — two underrated satiety levers.",
        useIt: "Bajra in winter, jowar year-round, or a multi-grain blend for softness.",
        learnHref: "/learn/millet-bajra-pearl",
      },
    ],
    sections: [
      {
        heading: "Why fibre is the honest lever",
        paragraphs: [
          "Fibre works on weight through boring, reliable mechanisms: it adds bulk without calories, slows stomach emptying, and steadies the glucose curve so energy dips don't send you to the snack cupboard. Whole millets carry roughly eight to twelve times the fibre of polished white rice — that's the entire pitch, and it's enough.",
          "Protein amplifies it. Grain-plus-pulse meals — adai, khichdi, dal-millet combinations — add the second satiety lever, which is why they out-perform grain-alone swaps. Aim for both levers in at least two meals a day.",
        ],
      },
      {
        heading: "What to watch (the parts marketing skips)",
        paragraphs: [
          "Calories still count: millets are energy-dense grains, and a ghee-heavy millet meal can easily out-calorie the rice meal it replaced. Keep portions and cooking fat honest — the swap helps, it doesn't absolve.",
          "Beware 'millet' snacks. Cookies, chips, and instant mixes built on fine millet flour plus sugar and palm oil are snacks first and millets second. The weight-management value lives in whole-grain meals, not the label on a biscuit.",
          "Finally: weight is multi-factor — sleep, activity, stress, and medical conditions all play in. If weight change is a health priority for you, a dietitian can personalise far better than any grain guide.",
        ],
      },
    ],
    productSlugs: ["metabolic-balance-khichdi", "protein-and-fibre-adai-mix"],
    productNote:
      "Both blends are built grain-plus-pulse for exactly the satiety pattern this guide describes — and both deliver across Bangalore and Hosur.",
    faqs: [
      {
        q: "Which millet is best for weight loss?",
        a: "No single millet is magic. Bajra and jowar make the most filling rotis; foxtail and little millet are the easiest rice swaps. The millet you'll eat consistently, in sensible portions, is the best one.",
      },
      {
        q: "Can I lose weight just by switching rice to millets?",
        a: "The swap raises meal fibre substantially and tends to reduce between-meal snacking, which helps. But total intake, activity, and sleep decide the outcome — treat the swap as one solid habit inside a bigger picture.",
      },
      {
        q: "Are millets low-calorie?",
        a: "No — per 100 g they're similar to rice and wheat in calories. The difference is satiety per calorie: fibre and texture make the same energy hold you longer.",
      },
      {
        q: "Is skipping dinner and drinking ragi malt a good idea?",
        a: "Crash patterns rarely hold. A balanced millet-pulse dinner beats a liquid-only evening for most people. If you're considering meal replacement for medical reasons, do it with professional guidance.",
      },
    ],
    related: [
      { label: "Fibre-rich meal planning — the how-to", href: "/learn/fibre-rich-meal-planning" },
      { label: "Protein & Fibre — our health-goal page", href: "/health-goals/protein-and-fibre" },
      { label: "Millets vs quinoa compared", href: "/compare/millets-vs-quinoa" },
      { label: "Best millets for blood-sugar-conscious eating", href: "/guides/best-millets-for-blood-sugar" },
    ],
    illustration: "bowl",
  },

  /* ── 3. Millets for beginners ────────────────────────────────────── */
  {
    slug: "millets-for-beginners",
    metaTitle: "Millets for Beginners: Which to Buy First & How to Start",
    metaDescription:
      "New to millets? Start here — the 3 easiest millets to begin with, the mistakes that make families quit, a 4-week starter plan, and what to buy in Bangalore & Hosur.",
    eyebrow: "Buying guide · Getting started",
    title: "Millets for beginners: which to buy first, and how not to quit",
    intro:
      "Most millet journeys fail the same way: an enthusiastic kilo of the wrong millet, one coarse and unfamiliar meal, a family verdict, and a packet gathering dust. The fix isn't more willpower — it's picking beginner-friendly millets and introducing them where they're invisible. Here's the sequence that works.",
    inShort:
      "Start with barnyard or little millet in a 50:50 blend with your usual rice — they're the softest and most neutral. Add jowar rotis (or a multi-grain roti blend) in week two. Save distinctive-tasting bajra and ragi for when the household is already convinced. Blends and mixed dishes — khichdi, pongal, upma — hide the transition far better than plain millet 'rice', which is exactly why ready millet-pulse blends are the lowest-risk first purchase.",
    entriesHeading: "The beginner sequence",
    entries: [
      {
        name: "Week 1–2: barnyard or little millet, blended into rice",
        why: "Softest texture, mildest flavour — at 50:50 with regular rice in khichdi or curd-rice formats, most families don't notice the change.",
        useIt: "Rinse, soak 15–20 minutes, cook with your rice. Shift toward 100% millet as acceptance grows.",
        learnHref: "/learn/millet-barnyard",
      },
      {
        name: "Week 2–3: jowar rotis (or a blend)",
        why: "The mildest millet flour, and rotis are where whole-grain swaps stick — one meal slot, big fibre difference.",
        useIt: "A multi-grain roti mix rolls and puffs more forgivingly than pure jowar flour for first-timers.",
        learnHref: "/learn/millet-jowar-sorghum",
      },
      {
        name: "Week 3–4: foxtail millet as pongal or upma",
        why: "The classic 'serious' millet — nutty, satisfying, and the natural next step once soft millets are routine.",
        useIt: "Foxtail pongal with pepper and ghee is the beginner recipe with the highest hit rate.",
        learnHref: "/learn/millet-foxtail",
      },
      {
        name: "Later: ragi and bajra, where they shine",
        why: "Both are exceptional grains with distinctive tastes — better introduced through their signature dishes than forced early.",
        useIt: "Ragi as morning porridge or dosa; bajra as winter rotis with jaggery and ghee.",
        learnHref: "/learn/millet-bajra-pearl",
      },
    ],
    sections: [
      {
        heading: "The five mistakes that make families quit",
        paragraphs: [
          "One: starting with the strongest-tasting millet (usually bajra or ragi) as plain 'rice' on day one. Two: cooking millets without rinsing and soaking, which leaves them coarse. Three: switching 100% overnight — the fibre jump can bloat an unaccustomed gut, which reads as 'millets don't suit us'. Four: buying big bags before tastes are known. Five: judging millets by a millet biscuit.",
          "Every one of these has the same cure: go gradual, go blended, go where millets are traditional. Our full week-by-week walkthrough lives in the Learn section if you want the detailed version.",
        ],
      },
      {
        heading: "What to actually buy first",
        paragraphs: [
          "If you want ingredients: a half-kilo each of barnyard or little millet and jowar flour covers the first month. If you want the lowest-friction start, a ready millet-pulse blend — khichdi or adai — removes soaking ratios and recipe risk entirely: you cook it like the dish you already know, and the grain transition happens inside it.",
          "Either way, buy small, buy fresh (millets are best within a few months of milling), and store airtight. In Bangalore and Hosur, we deliver both routes to your door.",
        ],
      },
    ],
    productSlugs: ["metabolic-balance-khichdi", "protein-and-fibre-adai-mix", "gluten-free-protein-and-fibre-roti-mix"],
    productNote:
      "All three blends were designed as first-millet-purchase products: familiar dishes, grain-plus-pulse nutrition, no technique required.",
    faqs: [
      {
        q: "Which single millet should a complete beginner buy?",
        a: "Barnyard or little millet — softest texture, most neutral taste, easiest blending into rice dishes. Jowar flour if your household is roti-first.",
      },
      {
        q: "Do millets cause gas or bloating?",
        a: "A sudden fibre increase can, for anyone unaccustomed. Increase gradually over 2–4 weeks, soak before cooking, and drink more water — for most people this settles as the gut adapts.",
      },
      {
        q: "How do I cook millets so they're not coarse?",
        a: "Rinse well, soak 15–30 minutes, use about 2.5 parts water to 1 part millet, and let them rest covered after cooking. Pressure cooking makes everything more forgiving.",
      },
      {
        q: "Can I feed millets to young children?",
        a: "Soft, well-cooked formats (porridge, khichdi) are traditional weaning foods in many Indian regions — ragi especially. Introduce like any new food, and take paediatric advice for infants.",
      },
    ],
    related: [
      { label: "Switching from white rice to millets — full plan", href: "/learn/switching-from-white-rice-to-millets" },
      { label: "Jowar vs bajra vs ragi: which does which job", href: "/compare/jowar-vs-bajra-vs-ragi" },
      { label: "Buy millets online in Bangalore", href: "/millets-online-bangalore" },
      { label: "Buy millets online in Hosur", href: "/millets-online-hosur" },
    ],
    illustration: "hero",
  },

  /* ── 4. Gluten-free flours for rotis ─────────────────────────────── */
  {
    slug: "best-gluten-free-flours-for-rotis",
    metaTitle: "Best Gluten-Free Flours for Rotis: What Works & What Falls Apart",
    metaDescription:
      "Jowar, bajra, ragi, rice and blended flours for gluten-free rotis compared — which roll well, which tear, binding tricks, and what to buy in Bangalore & Hosur.",
    eyebrow: "Buying guide · Gluten-free",
    title: "The best gluten-free flours for rotis (and why single flours tear)",
    intro:
      "Anyone who has watched a pure jowar roti crack at the edges knows the problem: gluten is the stretchy protein that makes wheat rotis forgiving, and gluten-free flours don't have it. The fix is choosing the right flour — usually the right blend — and a couple of technique changes. Here's the full picture.",
    inShort:
      "For gluten-free rotis, blends beat single flours. Jowar is the best single-flour starting point (mild, workable with hot-water dough); bajra and ragi bring nutrition but need blending for softness; rice flour adds bind and pliability to any mix. A good blend — millet flours for nutrition, rice flour for workability, pulse flour for protein — rolls closest to a wheat roti. Hot-water dough and immediate rolling are the two technique tricks that change everything.",
    entriesHeading: "Flour by flour",
    entries: [
      {
        name: "Jowar flour — the best single-flour start",
        why: "Mildest taste and the most forgiving texture among millet flours; jowar bhakri is a whole cuisine's proof that it works alone.",
        useIt: "Knead with hot water, roll between sheets or with gentle patting, cook immediately.",
        learnHref: "/learn/millet-jowar-sorghum",
      },
      {
        name: "Bajra flour — nutrition-dense, needs warmth",
        why: "Top-tier iron and fibre; its stiffer dough and robust taste suit winter rotis and pair well with jaggery-ghee.",
        useIt: "Hot-water dough, pat rather than roll thin, best eaten fresh off the tawa.",
        learnHref: "/learn/millet-bajra-pearl",
      },
      {
        name: "Ragi flour — calcium champion, blend it",
        why: "Exceptional calcium (~344 mg/100 g) and strong earthy taste; pure ragi rotis are dense, so it performs best at 25–40% of a blend.",
        useIt: "Blend with jowar and rice flour; also superb in dosa and porridge where texture is no issue.",
      },
      {
        name: "Rice flour — the workability fixer",
        why: "Nutritionally modest but structurally vital: rice flour binds and softens gluten-free dough, which is why traditional GF flatbreads across India lean on it.",
        useIt: "20–30% of any millet blend transforms rollability.",
      },
      {
        name: "Pulse flours (besan & friends) — the protein layer",
        why: "Chickpea and other pulse flours add protein, bind well, and round out the amino-acid profile of millet blends.",
        useIt: "10–20% of a blend; also the base of cheela-style GF flatbreads.",
      },
    ],
    sections: [
      {
        heading: "The technique half of the answer",
        paragraphs: [
          "Hot-water dough is the single biggest upgrade: boiling or very hot water partially cooks the starches as you knead, giving gluten-free dough the cohesion gluten would have provided. Knead while warm, keep the dough covered, and work in small batches.",
          "Roll immediately and cook immediately — GF dough dries and cracks with every idle minute. Rolling between two sheets of plastic or parchment, or hand-patting bhakri-style, prevents the sticking-and-tearing cycle. A slightly thicker roti than wheat-standard is normal and pleasant.",
        ],
      },
      {
        heading: "A note on 'gluten-free' labels and cross-contact",
        paragraphs: [
          "Millets and rice are naturally free of gluten, but flours can pick up traces in mills and facilities that also handle wheat. If gluten avoidance is medical (coeliac disease or diagnosed sensitivity), buy flours and blends that state their facility practices — our packs declare allergen and facility information plainly, in line with our claim-governance rules — and check labels rather than assuming.",
          "If you're simply reducing wheat by preference, standard millet flours from a trusted source are fine, and the blend guidance above is all you need.",
        ],
      },
    ],
    productSlugs: ["gluten-free-protein-and-fibre-roti-mix"],
    productNote:
      "Our roti mix is exactly the blend this guide describes — millet flours for nutrition, rice flour for rollability, pulse flour for protein — validated gluten-free and delivered across Bangalore and Hosur.",
    faqs: [
      {
        q: "Which gluten-free flour tastes closest to wheat rotis?",
        a: "Jowar alone comes closest among single flours; a jowar-rice-pulse blend comes closer still in both taste and softness.",
      },
      {
        q: "Why do my millet rotis break when I roll them?",
        a: "No gluten means no stretch. Use hot-water dough, roll between sheets, keep dough covered and warm, and cook each roti as soon as it's rolled. Blends with rice flour are markedly more forgiving.",
      },
      {
        q: "Is millet flour automatically gluten-free?",
        a: "The grain is; the flour depends on milling practices. For medical gluten avoidance, choose products with explicit gluten-free validation and facility disclosure.",
      },
      {
        q: "Can I make dosa and cheela with these flours too?",
        a: "Yes — fermented or spiced batters are actually the easiest gluten-free formats, since spreading a batter needs no gluten at all. Ragi dosa and besan cheela are excellent entry points.",
      },
    ],
    related: [
      { label: "Gluten-free flour delivery in Bangalore", href: "/gluten-free-flour-bangalore" },
      { label: "Jowar vs bajra vs ragi compared", href: "/compare/jowar-vs-bajra-vs-ragi" },
      { label: "Our gluten-free roti mix — the full story", href: "/learn/gluten-free-protein-fibre-roti-mix" },
      { label: "Millets for beginners", href: "/guides/millets-for-beginners" },
    ],
    illustration: "mixes",
  },
];

export function getGuideSlugs(): string[] {
  return guides.map((g) => g.slug);
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
