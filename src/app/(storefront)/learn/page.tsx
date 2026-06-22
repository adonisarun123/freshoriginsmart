import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section } from "@/components/content/Section";
import { Disclaimer } from "@/components/content/Disclaimer";
import { Placeholder } from "@/components/ui/Placeholder";

export const metadata: Metadata = {
  title: "Health Education",
  description:
    "Practical, expert-reviewed guides to traditional grains, millets, and balanced everyday eating from Fresh Origins.",
};

const articles = [
  {
    title: "How to transition from white rice to millets",
    meta: "Grain guide · 6 min read",
    desc: "A practical, expert-reviewed guide to gradually introducing millets alongside white rice.",
    href: "/learn/white-rice-to-millets",
  },
  {
    title: "Understanding fibre in everyday meals",
    meta: "Nutrition basics · 5 min read",
    desc: "What dietary fibre does, where it comes from, and how to build more into familiar dishes.",
    href: "/learn/white-rice-to-millets",
  },
  {
    title: "Grain + pulse pairing, the Indian way",
    meta: "Food traditions · 5 min read",
    desc: "Why combining grains and pulses across the day is a long-standing feature of Indian cooking.",
    href: "/learn/white-rice-to-millets",
  },
  {
    title: "A simple guide to traditional rice varieties",
    meta: "Grain guide · 7 min read",
    desc: "Red, black, and brown rice — taste, cooking ratios, and where each one shines.",
    href: "/learn/white-rice-to-millets",
  },
];

export default function LearnPage() {
  return (
    <div className="fo-container">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learn" },
        ]}
      />

      <div className="py-8">
        <p className="fo-eyebrow">Health education</p>
        <h1 className="mb-3">Learn about traditional grains</h1>
        <p className="max-w-[60ch] text-fo-muted">
          Clear, careful, expert-reviewed guidance on millets, traditional rice, and
          balanced everyday eating — without wellness noise.
        </p>
      </div>

      <Section tight>
        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.title}
              href={article.href}
              className="overflow-hidden rounded-card border border-fo-line bg-white transition hover:shadow-card"
            >
              <Placeholder ratio="16x9" className="!rounded-none" />
              <div className="p-5">
                <p className="mb-1.5 text-[0.78rem] font-bold uppercase tracking-[0.06em] text-fo-green-600">
                  {article.meta}
                </p>
                <h2 className="mb-1.5 text-[1.15rem]">{article.title}</h2>
                <p className="m-0 text-[0.9rem] text-fo-muted">{article.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section tight>
        <Disclaimer title="Educational information, not medical advice.">
          Our articles explain general food choices and are not intended to diagnose,
          treat, cure, or prevent any disease. Consult a qualified healthcare
          professional for personalised dietary guidance.
        </Disclaimer>
      </Section>
    </div>
  );
}
