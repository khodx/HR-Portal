import CompanyCard from "./CompanyCard";
import { getCompanies } from "@/lib/supabase/server";

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">Companies</h1>

      {companies.map((c: any) => (
        <CompanyCard key={c.id} company={c} />
      ))}
    </div>
  );
}
