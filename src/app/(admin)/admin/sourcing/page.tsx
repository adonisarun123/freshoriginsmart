import {
  AdminContent,
  AdminSection,
  AdminTopbar,
  ComingSoonCard,
} from "../_components/AdminShell";

export const metadata = { title: "Sourcing" };

export default function AdminSourcingPage() {
  return (
    <>
      <AdminTopbar title="Sourcing" />
      <AdminContent>
        <AdminSection>
          <ComingSoonCard />
        </AdminSection>
      </AdminContent>
    </>
  );
}
