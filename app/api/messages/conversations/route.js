import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/current-user';
import { supabase } from '../../../../lib/supabase';
export async function GET(){const user=await getCurrentUser();if(!user)return NextResponse.json({error:'UNAUTHORIZED'},{status:401});const {data,error}=await supabase.from('conversations').select('*').or(`user_a.eq.${user.id},user_b.eq.${user.id}`).order('created_at',{ascending:false});if(error)return NextResponse.json({error:error.message},{status:500});return NextResponse.json({conversations:data||[]});}
