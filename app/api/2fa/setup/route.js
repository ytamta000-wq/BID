import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import { getCurrentUser } from '../../../../lib/current-user';
import { supabase } from '../../../../lib/supabase';
export async function POST(){const user=await getCurrentUser();if(!user)return NextResponse.json({error:'UNAUTHORIZED'},{status:401});const secret=authenticator.generateSecret();const otpauth=authenticator.keyuri(user.email,'BID',secret);const {error}=await supabase.from('profiles').update({two_factor_secret:secret,two_factor_enabled:false}).eq('id',user.id);if(error)return NextResponse.json({error:error.message},{status:500});return NextResponse.json({secret,otpauth});}
