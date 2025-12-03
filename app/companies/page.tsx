import { createClient } from "@/lib/supabase/client";

export default async function CompaniesPage() {
  const supabase = createClient();

  const { data: companies, error } = await supabase
    .from("companies")
    .select("company_id, legal_name, dba, created_by, created_at");

  if (error) {
    return (
      <p style={{ color: "red" }}>
        Error loading companies: {error.message}
      </p>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Companies</h1>

      {companies?.map((c) => (
        <div
          key={c.company_id}
          style={{
            border: "1px solid #eee",
            padding: 20,
            marginBottom: 20,
            borderRadius: 8,
          }}
        >
          <p><strong>Company ID:</strong> {c.company_id}</p>
          <p><strong>Legal Name:</strong> {c.legal_name}</p>
          <p><strong>DBA:</strong> {c.dba || "N/A"}</p>
          <p><strong>Created By:</strong> {c.created_by}</p>
          <p><strong>Created At:</strong> {new Date(c.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
