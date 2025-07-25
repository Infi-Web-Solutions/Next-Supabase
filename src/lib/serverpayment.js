
// //   // lib/serverpayment.js
//   import { createServerClient } from "@supabase/ssr";
//   import { cookies } from "next/headers";

//   export async function createSupabaseServerClient() {
//   const cookieStore = await cookies(); // ✅ await the cookies function

//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//     {
//       cookies: {
//         get(name) {
//           return cookieStore.get(name)?.value;
//         },
//       },
//     }
//   );
// }

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createServerClientWithCookies() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

