// import supabaseServerClient from '../../../lib/supabase/serveclient';

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     const {
//       email,
//       password,
//       name,
//       contact_number,
//       role_id,
//       created_by,
//     } = body;

//     if (!email || !password || !name || !role_id ) {
//       return Response.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     // Step 1: Create the Auth user
//     const { data: user, error: createUserError } = await supabaseServerClient.auth.admin.createUser({
//       email,
//       password,
//       email_confirm: true
//     });

//     if (createUserError) {
//       return Response.json({ error: createUserError.message }, { status: 400 });
//     }

//     const userId = user?.user?.id;

//     // Step 2: Insert into system_users
//     const { error: insertError } = await supabaseServerClient
//       .from('system_users')
//       .insert([{
//         id: userId,
//         name,
//         email,
//         contact_number,
//         role_id,
//         created_by
//       }]);

//     if (insertError) {
//       return Response.json({ error: insertError.message }, { status: 500 });
//     }

//     return Response.json({ message: 'System user created successfully' }, { status: 201 });

//   } catch (err) {
//     return Response.json({ error: 'Server error' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabase/serveclient' // Admin client

export async function POST(req) {
  try {
    const body = await req.json()
    const { name, email, contact, password, role } = body

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Map role name to ID
    const role_id = role === 'admin' ? 1 : 2

    // 1️⃣ Create user in Supabase Auth
   const { data: user, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
  email,
  password,
  email_confirm: true, // ensures email is confirmed
  user_metadata: {
    name,
    contact,
    role: role_id, // store role_id (1, 2, 3)
  },
});


    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 500 })
    }

    // 2️⃣ Save to system_users table
    const { error: insertError } = await supabaseAdmin.from('system_users').insert([
      {
        id: user.user.id,
        name,
        email,
        contact_number: contact,
        role_id,
      },
    ])

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('❌ API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}