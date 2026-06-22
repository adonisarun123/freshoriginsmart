import {
  AdminContent,
  AdminSection,
  AdminTopbar,
  ComingSoonCard,
} from "../_components/AdminShell";

export const metadata = { title: "Content" };

export default function AdminContentPage() {
  return (
    <>
      <AdminTopbar title="Content" />
      <AdminContent>
        <AdminSection>
          <ComingSoonCard />
        </AdminSection>
      </AdminContent>
    </>
  );
}
