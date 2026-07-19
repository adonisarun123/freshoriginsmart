/**
 * File-based recipe content pack (mirrors the /learn approach: static,
 * reviewed in code, no DB dependency). Each recipe is matched to a real
 * Fresh Origins product so the page works as both content and commerce.
 *
 * Nutrition estimates are approximate per serving and vary with exact
 * ingredients used — presented as estimates per the site's claim rules.
 */

export interface RecipeIngredient {
  name: string;
  qty: string;
}

export interface RecipeRelatedItem {
  title: string;
  meta: string;
  href: string;
  label: string;
}

export interface RecipeContent {
  slug: string;
  title: string;
  metaDescription: string;
  /** e.g. "Recipe · Breakfast" */
  eyebrow: string;
  occasion: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: string;
  /** Product this recipe is built around. */
  productSlug: string;
  productLinkLabel: string;
  ingredients: RecipeIngredient[];
  method: string[];
  tips: string[];
  /** [label, value] rows for the estimate table. */
  nutrition: [string, string][];
  allergens: string;
  related: RecipeRelatedItem[];
}

export const recipes: RecipeContent[] = [
  {
    slug: "vegetable-millet-khichdi-bowl",
    title: "Vegetable millet khichdi bowl",
    metaDescription:
      "A simple vegetable millet khichdi bowl made with Metabolic Balance Khichdi — ingredients, step-by-step method, nutrition estimate, allergens, and related products.",
    eyebrow: "Recipe · Lunch",
    occasion: "Lunch",
    description:
      "A comforting one-pot bowl made with Metabolic Balance Khichdi and everyday vegetables — fibre-forward, gentle, and ready in under half an hour.",
    prepTimeMinutes: 10,
    cookTimeMinutes: 18,
    servings: "3 servings",
    productSlug: "metabolic-balance-khichdi",
    productLinkLabel: "Khichdi mix",
    ingredients: [
      { name: "Metabolic Balance Khichdi mix", qty: "1 cup" },
      { name: "Water", qty: "3 cups" },
      { name: "Mixed vegetables (carrot, beans, peas)", qty: "1 cup" },
      { name: "Ghee or oil", qty: "1 tbsp" },
      { name: "Cumin seeds", qty: "1 tsp" },
      { name: "Ginger, grated", qty: "1 tsp" },
      { name: "Salt", qty: "to taste" },
    ],
    method: [
      "Rinse the khichdi mix until the water runs clear, then drain.",
      "Heat ghee in a pressure cooker, add cumin and ginger, and let them sizzle.",
      "Add the chopped vegetables and sauté for 2 minutes.",
      "Add the rinsed mix, water, and salt. Stir well.",
      "Pressure cook for 3–4 whistles, or simmer 15–18 minutes until soft.",
      "Rest 5 minutes, fluff gently, and serve warm with a spoon of ghee or curd.",
    ],
    tips: [
      "For a softer, porridge-like khichdi (good for seniors), add half a cup more water and one extra whistle.",
      "A squeeze of lime and fresh coriander at the end lifts the whole bowl.",
    ],
    nutrition: [
      ["Energy", "~260 kcal"],
      ["Protein", "~9 g"],
      ["Fibre", "~6 g"],
      ["Fat", "~6 g"],
    ],
    allergens:
      "Contains pulses; may contain gluten and tree nuts depending on garnish.",
    related: [
      {
        title: "Metabolic Balance Khichdi",
        meta: "Shop the mix",
        href: "/products/metabolic-balance-khichdi",
        label: "Khichdi",
      },
      {
        title: "Blood-Sugar-Conscious Eating",
        meta: "Health goal",
        href: "/health-goals/blood-sugar-conscious-eating",
        label: "Goal",
      },
      {
        title: "Millets for beginners",
        meta: "Buying guide",
        href: "/guides/millets-for-beginners",
        label: "Guide",
      },
    ],
  },
  {
    slug: "protein-adai-with-chutney",
    title: "Protein adai with coconut chutney",
    metaDescription:
      "Savoury millet-and-pulse adai pancakes made with Protein & Fibre Adai Mix, plus a five-minute coconut chutney — method, tips, nutrition estimate, and allergens.",
    eyebrow: "Recipe · Breakfast",
    occasion: "Breakfast",
    description:
      "Crisp-edged savoury pancakes from a millet-and-pulse batter — a protein-forward South Indian breakfast that needs no fermenting and no planning ahead.",
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servings: "8–10 adais (4 servings)",
    productSlug: "protein-and-fibre-adai-mix",
    productLinkLabel: "Adai mix",
    ingredients: [
      { name: "Protein & Fibre Adai Mix", qty: "2 cups" },
      { name: "Water", qty: "~2½ cups" },
      { name: "Onion, finely chopped", qty: "1 medium" },
      { name: "Curry leaves, torn", qty: "1 sprig" },
      { name: "Green chilli, chopped (optional)", qty: "1" },
      { name: "Sesame or groundnut oil", qty: "for the tawa" },
      { name: "Fresh coconut, grated (chutney)", qty: "1 cup" },
      { name: "Ginger + green chilli (chutney)", qty: "1 tsp + 1" },
      { name: "Salt", qty: "to taste" },
    ],
    method: [
      "Whisk the adai mix with water into a thick, pourable batter — thicker than dosa batter. Rest 15 minutes.",
      "Stir in the onion, curry leaves, and green chilli. Adjust salt.",
      "Heat a tawa on medium. Pour a ladle of batter and spread into a thick pancake — adai is meant to be rustic, not paper-thin.",
      "Drizzle oil around the edges. Cook 2–3 minutes until the underside is golden and crisp.",
      "Flip and cook 2 minutes more. Repeat with remaining batter.",
      "For the chutney: grind coconut, ginger, green chilli, and salt with a little water until just smooth.",
      "Serve adais hot off the tawa with the chutney.",
    ],
    tips: [
      "A small hole poked in the centre of each adai helps it cook evenly — the traditional trick.",
      "Leftover batter keeps a day in the fridge; add a splash of water before using.",
      "For a heartier plate, top with a spoon of homemade butter or serve with jaggery on the side, as Tamil kitchens do.",
    ],
    nutrition: [
      ["Energy", "~280 kcal"],
      ["Protein", "~12 g"],
      ["Fibre", "~7 g"],
      ["Fat", "~9 g"],
    ],
    allergens:
      "Contains pulses and flaxseed; chutney contains coconut (tree nut family). Manufactured in a facility that also handles gluten-containing cereals and tree nuts.",
    related: [
      {
        title: "Protein & Fibre Adai Mix",
        meta: "Shop the mix",
        href: "/products/protein-and-fibre-adai-mix",
        label: "Adai",
      },
      {
        title: "Pairing grains and pulses",
        meta: "Learn",
        href: "/learn/pairing-grains-and-pulses",
        label: "Learn",
      },
      {
        title: "Protein & Fibre goal",
        meta: "Health goal",
        href: "/health-goals/protein-and-fibre",
        label: "Goal",
      },
    ],
  },
  {
    slug: "savoury-heritage-kanji",
    title: "Savoury heritage kanji",
    metaDescription:
      "A gentle, fibre-forward rice-and-millet porridge made with Heritage Gut-Fibre Kanji Mix — savoury buttermilk finish, method, tips, nutrition estimate, and allergens.",
    eyebrow: "Recipe · Light dinner",
    occasion: "Light dinner",
    description:
      "A soothing porridge of red rice, black rice, millets, and green gram — finished the traditional way with buttermilk, salt, and curry leaves. Comfort food that happens to be fibre-forward.",
    prepTimeMinutes: 5,
    cookTimeMinutes: 30,
    servings: "3 servings",
    productSlug: "heritage-gut-fibre-kanji-mix",
    productLinkLabel: "Kanji mix",
    ingredients: [
      { name: "Heritage Gut-Fibre Kanji Mix", qty: "½ cup" },
      { name: "Water", qty: "4 cups" },
      { name: "Salt", qty: "to taste" },
      { name: "Buttermilk (or thin curd)", qty: "½ cup" },
      { name: "Cumin seeds", qty: "½ tsp" },
      { name: "Curry leaves", qty: "1 sprig" },
      { name: "Ghee or coconut oil", qty: "1 tsp" },
    ],
    method: [
      "Rinse the kanji mix well. For the softest result, soak 20 minutes.",
      "Bring the water to a boil, add the mix, and simmer partially covered, stirring now and then.",
      "Cook 25–30 minutes until the grains are fully soft and the kanji is loose and spoonable. Add hot water if it thickens too much.",
      "Season with salt. Temper cumin and curry leaves in ghee and pour over.",
      "Let it cool from hot to warm, then stir in the buttermilk just before serving.",
    ],
    tips: [
      "Pressure cooking (3 whistles, natural release) cuts the simmer time in half.",
      "Kanji thickens as it rests — thin leftovers with warm water or buttermilk, not cold.",
      "For sick-day or senior-friendly meals, cook longer and softer; the mix takes extra water gracefully.",
    ],
    nutrition: [
      ["Energy", "~180 kcal"],
      ["Protein", "~6 g"],
      ["Fibre", "~5 g"],
      ["Fat", "~3 g"],
    ],
    allergens:
      "Contains pulses; buttermilk adds dairy. Manufactured in a facility that also handles gluten-containing cereals and tree nuts.",
    related: [
      {
        title: "Heritage Gut-Fibre Kanji Mix",
        meta: "Shop the mix",
        href: "/products/heritage-gut-fibre-kanji-mix",
        label: "Kanji",
      },
      {
        title: "Gut Health goal",
        meta: "Health goal",
        href: "/health-goals/gut-health",
        label: "Goal",
      },
      {
        title: "Red vs brown vs white rice",
        meta: "Comparison",
        href: "/compare/red-rice-vs-brown-rice-vs-white-rice",
        label: "Compare",
      },
    ],
  },
];

export function getRecipeSlugs(): string[] {
  return recipes.map((r) => r.slug);
}

export function getRecipeBySlug(slug: string): RecipeContent | undefined {
  return recipes.find((r) => r.slug === slug);
}
