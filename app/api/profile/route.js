import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/current-user';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  return NextResponse.json({ profile: user });
}

export async function PATCH(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const body = await request.json();
  const allowed = ['name','bio','currency','profile_visibility','bid_notifications','connection_notifications','role'];
  const update = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
  update.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('profiles').update(update).eq('id', user.id).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ profile: data });
}
