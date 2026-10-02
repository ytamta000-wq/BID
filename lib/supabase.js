import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.warn('BID: Supabase environment variables are not configured yet.');
}

export const supabase = url && key ? createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false }
}) : null;
