import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import {
  AdminContent,
  AdminSection,
  AdminTopbar,
  EmptyRow,
  TableWrap,
  tdClass,
  thClass,
} from "../_components/AdminShell";

function DataUnavailableNotice() {
  return (
    <div className="max-w-[640px] rounded-card border border-fo-line bg-white p-6">
      <p className="text-[0.9rem] text-fo-muted">
        Admin data is unavailable. Confirm SUPABASE_SERVICE_ROLE_KEY is set in
        the environment.
      </p>
    </div>
  );
}

export const metadata = { title: "Enquiries" };
export const dynamic = "force-dynamic";

interface EnquiryRow {
  id: string;
  enquiry_type: string;
  name: string;
  organisation: string | null;
  email: string;
  city: string | null;
  status: string;
  created_at: string;
}

export default async function AdminEnquiriesPage() {
  let enquiries: EnquiryRow[] = [];
  let dataError = false;
  try {
    if (hasSupabaseAdminEnv()) {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("enquiries")
        .select(
          "id, enquiry_type, name, organisation, email, city, status, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      enquiries = (data as EnquiryRow[] | null) ?? [];
    } else {
      dataError = true;
    }
  } catch {
    dataError = true;
  }

  return (
    <>
      <AdminTopbar
        title="Enquiries"
        subtitle={
          dataError ? "Data unavailable" : `${enquiries.length} enquiries`
        }
      />
      <AdminContent>
        <AdminSection>
          {dataError ? (
            <DataUnavailableNotice />
          ) : (
          <TableWrap>
            <thead>
              <tr>
                <th className={thClass}>Type</th>
                <th className={thClass}>Name</th>
                <th className={thClass}>Organisation</th>
                <th className={thClass}>Email</th>
                <th className={thClass}>City</th>
                <th className={thClass}>Received</th>
                <th className={thClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 ? (
                <EmptyRow colSpan={7} label="No enquiries yet." />
              ) : (
                enquiries.map((enquiry) => (
                  <tr key={enquiry.id}>
                    <td className={`${tdClass} capitalize`}>
                      {enquiry.enquiry_type.replace(/_/g, " ")}
                    </td>
                    <td className={tdClass}>{enquiry.name}</td>
                    <td className={tdClass}>{enquiry.organisation ?? "—"}</td>
                    <td className={tdClass}>{enquiry.email}</td>
                    <td className={tdClass}>{enquiry.city ?? "—"}</td>
                    <td className={tdClass}>
                      {new Date(enquiry.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className={`${tdClass} capitalize`}>
                      {enquiry.status.replace(/_/g, " ")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </TableWrap>
          )}
        </AdminSection>
      </AdminContent>
    </>
  );
}
