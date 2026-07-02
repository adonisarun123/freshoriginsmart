import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountNav } from "./_components/account-nav";

/**
 * Account shell. The root layout already provides the storefront header/footer,
 * so this layout only adds the in-page account side-nav + content column.
 * Auth is enforced here (and in middleware) for defence in depth.
 */
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?redirect=/account");
  }

  return (
    <div className="fo-container py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <AccountNav />
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
