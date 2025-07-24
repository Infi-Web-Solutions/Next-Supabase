

import { NextResponse } from 'next/server';
import { createServerClientWithCookies } from '../../../lib/serverpayment';
import supabase from "../../../lib/supabase/serveclient";

export async function POST(req) {
  const { stripe_secret_key } = await req.json();

  const supabaseAuth = createServerClientWithCookies();

  const {
    data: { user },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const rawOrgId = user.user_metadata?.organization_id;
  const orgId = rawOrgId && !isNaN(Number(rawOrgId)) ? parseInt(rawOrgId, 10) : null;

  console.log("🧩 Raw org ID:", rawOrgId);
  console.log("🧾 Parsed org ID:", orgId, typeof orgId);

  if (!orgId) {
    return NextResponse.json({ message: 'Invalid org ID' }, { status: 400 });
  }

  if (!stripe_secret_key || typeof stripe_secret_key !== 'string') {
    return NextResponse.json({ message: 'Invalid stripe_secret_key' }, { status: 400 });
  }


  const { error: rlsError } = await supabase.rpc('set_rls_organization_id', {
    org_id: orgId,
  });

  if (rlsError) {
    console.error('❌ Failed to set RLS context:', rlsError);
    return NextResponse.json(
      { message: 'Failed to set RLS context', error: rlsError },
      { status: 500 }
    );
  }

  const { data: insertData, error: insertError } = await supabase
    .from('stripe_credentials')
    .insert([
      {
        organization_id: orgId,
        stripe_secret_key,
      },
    ]);

  if (insertError) {
    console.error('❌ Error inserting stripe_credentials:', insertError);
    return NextResponse.json(
      { message: 'Failed to save credentials', error: insertError },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: 'Stripe key saved successfully',
    data: insertData,
  });
}

