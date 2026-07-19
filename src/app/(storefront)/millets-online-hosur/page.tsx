import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalLanding } from "@/features/growth/LocalLanding";
import { getLocalPageBySlug } from "@/features/growth/local-pages";

const page = getLocalPageBySlug("millets-online-hosur");

export const metadata: Metadata = page
  ? {
      title: page.metaTitle,
      description: page.metaDescription,
      alternates: { canonical: `/${page.slug}` },
    }
  : {};

export default async function MilletsOnlineHosurPage() {
  if (!page) notFound();
  return <LocalLanding page={page} />;
}
