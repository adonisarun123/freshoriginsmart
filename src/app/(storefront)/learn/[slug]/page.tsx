import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Disclaimer } from "@/components/content/Disclaimer";
import { Placeholder } from "@/components/ui/Placeholder";

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return [{ slug: "white-rice-to-millets" }];
}

export const metadata: Metadata = {
  title: "How to transition from white rice to millets",
  description:
    "A practical, expert-reviewed guide to gradually introducing millets alongside white rice — cooking ratios, texture, and meal pairings, with sources and a medical disclaimer.",
};

const tags = ["Millets", "Whole grains", "Blood-sugar-conscious"];

const related = [
  { title: "Metabolic Balance Khichdi", meta: "₹245", href: "/products/metabolic-balance-khichdi", label: "Khichdi" },
  { title: "Traditional Rice varieties", meta: "₹190", href: "/shop/traditional-rice", label: "Rice" },
];

export default function ArticleDetailPage({ params }: PageProps) {
  void params;
  return (
    <div className="fo-container">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learn", href: "/learn" },
          { label: "White rice to millets" },
        ]}
      />

      {/* Hero */}
      <div className="mx-auto max-w-editorial pt-6">
        <p className="fo-eyebrow">Health education · Grain guide</p>
        <h1>How to transition from white rice to millets</h1>
        <div className="my-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="fo-badge">
              {tag}
            </span>
          ))}
        </div>
        <div className="my-4 flex flex-wrap items-center gap-3 text-[0.85rem] text-fo-muted">
          <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-fo-sage-100 text-[0.85rem] font-bold text-fo-green-900">
            FO
          </span>
          <span>Written by Fresh Origins editorial</span>
          <span className="opacity-40">·</span>
          <span>Reviewed by [RD name]</span>
          <span className="opacity-40">·</span>
          <span>Published 12 Jun 2026</span>
          <span className="opacity-40">·</span>
          <span>Next review: Dec 2026</span>
        </div>
      </div>

      {/* AEO answer block */}
      <div className="mx-auto mt-8 max-w-editorial rounded-card border border-fo-line border-l-4 border-l-fo-green-600 bg-white p-6 shadow-soft">
        <span className="mb-2 block text-[0.78rem] font-bold uppercase tracking-[0.06em] text-fo-green-600">
          In short
        </span>
        <p className="m-0 text-[1.05rem]">
          The easiest way to add millets is gradually — start by replacing part of your
          rice with millets in dishes you already cook, get the water ratio right, and
          build up as the texture becomes familiar. There&apos;s no need to give up rice
          entirely.
        </p>
      </div>

      {/* Body */}
      <article className="mx-auto mt-8 max-w-editorial fo-legal-body">
        <Placeholder ratio="16x9" label="Millets and rice side by side" className="my-6" />

        <p>
          White rice is a staple in many Indian homes, and there&apos;s nothing wrong
          with enjoying it. Millets are simply another whole-grain option that can add
          variety and fibre to your week. The goal isn&apos;t to replace rice overnight —
          it&apos;s to make room for millets in a way that actually sticks.
        </p>

        <h2>Start with dishes you already make</h2>
        <p>
          Begin with one familiar dish — khichdi, pongal, or a simple grain bowl — and
          swap part of the rice for millets. Mixing the two at first keeps the texture
          close to what your family expects while you adjust.
        </p>

        <h3>Getting the water ratio right</h3>
        <p>
          Millets generally need a little more water than polished rice. A good starting
          point is a 1:2.5 to 1:3 grain-to-water ratio, adjusting to taste. Soaking
          millets for 20–30 minutes before cooking helps them cook evenly and softens the
          texture.
        </p>

        <h2>Build up gradually</h2>
        <p>
          Once a 50:50 mix feels normal, try millet-forward meals a couple of times a
          week. Vary the type of millet — foxtail, barnyard, little, kodo — so meals stay
          interesting and you get a range of textures.
        </p>

        <h2>Pair for a balanced plate</h2>
        <p>
          Whichever grain you choose, pair it with a pulse, a vegetable, and a little
          healthy fat. This is the same principle behind dishes like adai and dal-rice,
          and it makes the meal more satisfying.
        </p>

        {/* Reviewer */}
        <div className="my-8 flex items-center gap-4 rounded-card border border-fo-line bg-white p-6">
          <div className="grid h-14 w-14 flex-none place-items-center rounded-full bg-fo-sage-100 text-[1.15rem] font-bold text-fo-green-900">
            RD
          </div>
          <div>
            <h3 className="mb-0.5 mt-0 text-[1.05rem]">
              Reviewed by [Registered Dietitian name]
            </h3>
            <p className="m-0 text-[0.85rem] text-fo-muted">
              RD · Scope: nutritional accuracy of this article. Reviewed 12 Jun 2026.
            </p>
          </div>
        </div>

        <h2>References</h2>
        <ol className="my-3 list-decimal pl-5 text-[0.88rem] text-fo-muted">
          <li className="mb-1.5">
            Whole grains and dietary fibre guidance — [authoritative source placeholder].
          </li>
          <li className="mb-1.5">
            Millet cooking and preparation — [reference placeholder].
          </li>
        </ol>

        <h2>Products mentioned</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {related.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-3 rounded-card border border-fo-line bg-white p-3 no-underline transition hover:shadow-soft"
            >
              <Placeholder label={item.label} className="!h-14 !w-14 !text-[0.55rem]" />
              <div>
                <h3 className="m-0 text-[0.9rem]">{item.title}</h3>
                <span className="text-[0.85rem] font-bold text-fo-green-900">
                  {item.meta}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <Disclaimer title="Educational information, not medical advice.">
            This article explains general food choices and is not intended to diagnose,
            treat, cure, or prevent any disease. Consult a qualified healthcare
            professional for personalised dietary guidance.
          </Disclaimer>
        </div>
      </article>
    </div>
  );
}
