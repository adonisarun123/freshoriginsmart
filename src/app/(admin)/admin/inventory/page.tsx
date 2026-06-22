import {
  AdminContent,
  AdminSection,
  AdminTopbar,
  ComingSoonCard,
} from "../_components/AdminShell";

export const metadata = { title: "Inventory" };

export default function AdminInventoryPage() {
  return (
    <>
      <AdminTopbar title="Inventory" />
      <AdminContent>
        <AdminSection>
          <ComingSoonCard />
        </AdminSection>
      </AdminContent>
    </>
  );
}
