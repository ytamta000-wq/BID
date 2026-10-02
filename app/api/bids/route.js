import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/current-user';
import { supabase } from '../../../lib/supabase';
export async function POST(request){const user=await getCurrentUser();if(!user)return NextResponse.json({error:'UNAUTHORIZED'},{status:401});const {listingId,amount}=await request.json();const numeric=Number(amount);if(!listingId||!Number.isFinite(numeric))return NextResponse.json({error:'INVALID_BID'},{status:400});const {data,error}=await supabase.rpc('place_bid',{p_listing_id:listingId,p_bidder_id:user.id,p_amount:numeric});if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({bid:data},{status:201});}
