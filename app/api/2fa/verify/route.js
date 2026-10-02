import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import { getCurrentUser } from '../../../../lib/current-user';
import { supabase } from '../../../../lib/supabase';
export async function POST(request){const user=await getCurrentUser();if(!user)return NextResponse.json({error:'UNAUTHORIZED'},{status:401});const {code}=await request.json();const {data}=await supabase.from('profiles').select('two_factor_secret').eq('id',user.id).single();if(!data?.two_factor_secret||!authenticator.check(String(code||''),data.two_factor_secret))return NextResponse.json({error:'INVALID_CODE'},{status:400});await supabase.from('profiles').update({two_factor_enabled:true}).eq('id',user.id);return NextResponse.json({enabled:true});}
