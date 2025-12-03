import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // If no session, redirect to login
  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
