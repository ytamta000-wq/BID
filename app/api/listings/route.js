import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/current-user';
import { supabase } from '../../../lib/supabase';

export const runtime = 'nodejs';

export async function GET() {
  if (!supabase) return NextResponse.json({ error: 'DATABASE_NOT_CONFIGURED' }, { status: 503 });
  const { data, error } = await supabase.from('listings').select('*, listing_images(*)').eq('status', 'active').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ listings: data ?? [] });
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    if (!supabase) return NextResponse.json({ error: 'DATABASE_NOT_CONFIGURED' }, { status: 503 });

    const form = await request.formData();
    const title = String(form.get('title') || '').trim();
    const description = String(form.get('description') || '').trim();
    const category = String(form.get('category') || 'Other').trim();
    const currency = String(form.get('currency') || user.currency || 'USD').trim();
    const minimumBid = Number(form.get('minimumBid'));
    const files = form.getAll('images').filter((v) => v instanceof File);

    if (!title || !description || !Number.isFinite(minimumBid) || minimumBid < 0 || files.length < 1) {
      return NextResponse.json({ error: 'TITLE_DESCRIPTION_MINIMUM_BID_AND_ONE_IMAGE_REQUIRED' }, { status: 400 });
    }
    if (files.length > 8) return NextResponse.json({ error: 'MAX_8_IMAGES' }, { status: 400 });

    const { data: listing, error: listingError } = await supabase.from('listings').insert({
      seller_id: user.id,
      title,
      description,
      category,
      currency,
      minimum_bid: minimumBid,
      status: 'active',
    }).select('*').single();

    if (listingError) return NextResponse.json({ error: listingError.message }, { status: 500 });

    const images = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('ONLY_JPG_PNG_WEBP_ALLOWED');
        if (file.size > 10 * 1024 * 1024) throw new Error('IMAGE_TOO_LARGE_MAX_10MB');
        const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
        const path = `${user.id}/${listing.id}/${crypto.randomUUID()}.${ext}`;
        const bytes = Buffer.from(await file.arrayBuffer());

        // The Supabase bucket created for BID is product-images.
        const upload = await supabase.storage.from('product-images').upload(path, bytes, {
          contentType: file.type,
          upsert: false,
        });
        if (upload.error) throw new Error(upload.error.message);

        const { data: publicUrl } = supabase.storage.from('product-images').getPublicUrl(path);
        images.push({ listing_id: listing.id, url: publicUrl.publicUrl, storage_path: path, sort_order: i, is_main: i === 0 });
      }

      const { error: imageError } = await supabase.from('listing_images').insert(images);
      if (imageError) throw new Error(imageError.message);
    } catch (e) {
      await supabase.from('listings').delete().eq('id', listing.id);
      return NextResponse.json({ error: e.message || 'IMAGE_UPLOAD_FAILED' }, { status: 400 });
    }

    return NextResponse.json({ listing: { ...listing, images } }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'PUBLISH_FAILED' }, { status: 500 });
  }
}
