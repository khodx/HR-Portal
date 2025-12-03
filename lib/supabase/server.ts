// lib/supabase/server.ts

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates the Supabase client for server components (Next.js 16 compatible)
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          try {
            return cookieStore.getAll();
          } catch {
            return [];
          }
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignore — middleware persists cookies on server anyway
          }
        },
      },
    }
  );
}

/**
 * Fetch all companies from Supabase
 */
export async function getCompanies() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Company") // ⚠️ Make sure table name matches EXACTLY
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error loading companies:", error);
    return [];
  }

  return data || [];
}
