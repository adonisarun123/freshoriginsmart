import {
  AdminContent,
  AdminSection,
  AdminTopbar,
  ComingSoonCard,
} from "../_components/AdminShell";

export const metadata = { title: "Discounts" };

export default function AdminDiscountsPage() {
  return (
    <>
      <AdminTopbar title="Discounts" />
      <AdminContent>
        <AdminSection>
          <ComingSoonCard />
        </AdminSection>
      </AdminContent>
    </>
  );
}
