import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/current-user';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const { data, error } = await supabase.from('connection_requests')
    .select('*, requester:profiles!requester_id(id,name,email,image), recipient:profiles!recipient_id(id,name,email,image)')
    .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ requests: data ?? [] });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const { recipientId } = await request.json();
  if (!recipientId || recipientId === user.id) return NextResponse.json({ error: 'INVALID_RECIPIENT' }, { status: 400 });
  const { data, error } = await supabase.from('connection_requests').insert({ requester_id: user.id, recipient_id: recipientId }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ request: data }, { status: 201 });
}
