import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { ProfileForm, type ProfileFormValues } from "./profile-form";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your Fresh Origins profile details.",
};

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user!.id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone, marketing_consent")
    .eq("id", userId)
    .maybeSingle();

  const initial: ProfileFormValues = {
    full_name: profile?.full_name ?? "",
    email: profile?.email ?? user!.email ?? "",
    phone: profile?.phone ?? "",
    marketing_consent: profile?.marketing_consent ?? false,
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Profile" },
        ]}
      />

      <header className="pb-6 pt-4">
        <h1 className="text-[clamp(1.7rem,2.8vw,2.2rem)]">Profile</h1>
        <p className="mt-1 text-fo-muted">
          Your contact details and communication preferences.
        </p>
      </header>

      <section className="fo-card p-6">
        <ProfileForm userId={userId} initial={initial} />
      </section>
    </div>
  );
}
