import {
  AdminContent,
  AdminSection,
  AdminTopbar,
  ComingSoonCard,
} from "../_components/AdminShell";

export const metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  return (
    <>
      <AdminTopbar title="Settings" />
      <AdminContent>
        <AdminSection>
          <ComingSoonCard />
        </AdminSection>
      </AdminContent>
    </>
  );
}
