import { getCurrentUser } from '../../lib/current-user';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default async function Profile() {
  const user = await getCurrentUser();
  if (!user) return <main className="page"><section className="page-title glass"><h1>Profile</h1><p>Please sign in to view your profile.</p><Link className="btn primary" href="/login">Sign in</Link></section></main>;

  const [{ count: listings }, { count: bids }, { count: sales }] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('seller_id', user.id),
    supabase.from('bids').select('*', { count: 'exact', head: true }).eq('bidder_id', user.id),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('seller_id', user.id),
  ]);

  return <main className="page"><section className="page-title glass"><span className="eyebrow">PROFILE</span><h1>{user.name || user.email}</h1><p>{user.email}</p><p>{user.bio || 'Add a short bio in Settings.'}</p></section><div className="dashboard-grid"><div className="stat glass"><b>{listings || 0}</b><span>Listings</span></div><div className="stat glass"><b>{bids || 0}</b><span>Bids</span></div><div className="stat glass"><b>{sales || 0}</b><span>Sales</span></div></div><section className="glass" style={{padding:20,marginTop:16}}><Link className="btn ghost" href="/settings">Edit profile & settings</Link></section></main>;
}
