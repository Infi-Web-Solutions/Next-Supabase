import { getSupabaseSessionClient } from '../../../lib/supabase/sessionclient'; 
import supabaseAdmin from '../../../lib/supabase/serveclient'; 

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 });
    }


    const supabase = await getSupabaseSessionClient();
    const {
      data: { session },
      error: loginError,
    } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError || !session) {
      return Response.json({ error: loginError?.message || 'Login failed' }, { status: 401 });
    }

    const userId = session.user.id;

    const { data: systemUser } = await supabaseAdmin
  .from("system_users")
  .select("id")
  .eq("id", userId)
  .single();

if (!systemUser) {
  return Response.json({ error: "You are not an admin/staff" }, { status: 403 });
}

console.log("🔑 Logged-in user ID:", userId);

    
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('system_users')
      .select(`
        id,
        name,
        email,
        role:role_id (
          id,
          name,
          role_permissions (
            permission:permission_id (
              module,
              action
            )
          )
        )
      `)
      .eq('id', userId)
      .maybeSingle();

      console.log("📦 system_users record:", user);


    if (fetchError) {
      return Response.json({ error: fetchError.message }, { status: 500 });
    }

    if (!user) {
      return Response.json({ error: 'User not found in system_users' }, { status: 404 });
    }

  
    const permissions = user.role?.role_permissions?.map((rp) => {
      const p = rp.permission;
      return `${p.module}:${p.action}`;
    }) || [];

    
console.log("🔐 Extracted permissions:", permissions);

 

    return Response.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.name,
          role_id: user.role.id,
        },
        accessToken: session.access_token,
        permissions,
        
      },
      
      
      { status: 200 }
      
    );

  } catch (err) {
    console.error('Admin login error:', err);
    return Response.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
