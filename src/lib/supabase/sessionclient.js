// lib/supabase/sessionclient.js

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getSupabaseSessionClient() {
  const cookieStore = await cookies(); // ✅ await cookies()
  return createRouteHandlerClient({ cookies: () => cookieStore });
}
