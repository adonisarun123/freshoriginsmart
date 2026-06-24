export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Health Goals", href: "/health-goals" },
  { label: "Our Sourcing", href: "/our-sourcing" },
  { label: "Learn", href: "/learn" },
  { label: "For Business", href: "/for-business" },
  { label: "About", href: "/about" },
];

export const footerColumns: { title: string; links: NavItem[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Millets", href: "/shop/millets" },
      { label: "Traditional Rice", href: "/shop/traditional-rice" },
      { label: "Ready-to-Cook Mixes", href: "/shop/ready-to-cook-mixes" },
      { label: "Shop All", href: "/shop" },
    ],
  },
  {
    title: "Health Goals",
    links: [
      { label: "Protein & Fibre", href: "/health-goals/protein-and-fibre" },
      { label: "Gut Health", href: "/health-goals/gut-health" },
      { label: "Blood-Sugar-Conscious", href: "/health-goals/blood-sugar-conscious-eating" },
      { label: "Senior Nutrition", href: "/health-goals/senior-nutrition" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Recipes", href: "/recipes" },
      { label: "Health Education", href: "/learn" },
      { label: "Meet the Experts", href: "/experts" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Our Sourcing", href: "/our-sourcing" },
      { label: "For Business", href: "/for-business" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const policyLinks: NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Shipping & Returns", href: "/shipping-returns" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Inventory", href: "/admin/inventory" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Abandoned Carts", href: "/admin/abandoned-carts" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Enquiries", href: "/admin/enquiries" },
  { label: "Discounts", href: "/admin/discounts" },
  { label: "Content", href: "/admin/content" },
  { label: "Experts", href: "/admin/experts" },
  { label: "Sourcing", href: "/admin/sourcing" },
  { label: "Settings", href: "/admin/settings" },
];
