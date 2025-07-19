
import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabase/serveclient' 

// export async function POST(req) {
//   try {
//     const body = await req.json()
//     const { name, email, contact, password, role, organization_id } = body

//     if (!name || !email || !password || !role) {
//       return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
//     }

//     const role_id = role === 'admin' ? 1 : 2

//    const { data: user, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
//   email,
//   password,
//   email_confirm: true, 
//   user_metadata: {
//     name,
//     contact,
//     role: role_id, 
//      organization_id:1,
//   },
// });


//     if (signUpError) {
//       return NextResponse.json({ error: signUpError.message }, { status: 500 })
//     }

//     const { error: insertError } = await supabaseAdmin.from('system_users').insert([
//       {
//         id: user.user.id,
//         name,
//         email,
//         contact_number: contact,
//         role_id,
//          organization_id:1,
        
//       },
//     ])

//     if (insertError) {
//       return NextResponse.json({ error: insertError.message }, { status: 500 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (err) {
//     console.error(' API Error:', err)
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   }
// }

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, contact, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const role_id = role === 'admin' ? 1 : 2;


    const host = req.headers.get('host') || '';
    const subdomain = host.split('.')[0];

    const { data: org, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .eq('slug', subdomain)
      .single();

    if (orgError || !org) {
      return NextResponse.json({ error: 'Invalid organization/subdomain' }, { status: 400 });
    }

    const organization_id = org.id;

    const { data: user, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        contact,
        role: role_id,
        organization_id,
      },
    });

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 500 });
    }

    const { error: insertError } = await supabaseAdmin.from('system_users').insert([
      {
        id: user.user.id,
        name,
        email,
        contact_number: contact,
        role_id,
        organization_id,
      },
    ]);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}