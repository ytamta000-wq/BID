import { getServerSession } from 'next-auth';
import { authOptions } from './nextauth-options';
import { supabase } from './supabase';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      email: session.user.email,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
}
