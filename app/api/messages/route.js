import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/current-user';
import { supabase } from '../../../lib/supabase';

async function canAccessConversation(id, userId) {
  const { data } = await supabase.from('conversations').select('*').eq('id', id).single();
  return data && (data.user_a === userId || data.user_b === userId) ? data : null;
}

export async function GET(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('conversationId');
  if (!id) return NextResponse.json({ error: 'CONVERSATION_ID_REQUIRED' }, { status: 400 });
  const conversation = await canAccessConversation(id, user.id);
  if (!conversation) return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  const { data, error } = await supabase.from('messages').select('*, sender:profiles!sender_id(id,name,image)').eq('conversation_id', id).order('created_at');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data ?? [] });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const { conversationId, body } = await request.json();
  const conversation = await canAccessConversation(conversationId, user.id);
  if (!conversation) return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  const { data, error } = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: user.id, body: String(body || '').trim() }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: data }, { status: 201 });
}
