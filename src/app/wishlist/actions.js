'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function claimWishlistItem(formData) {
  const supabase = await createClient();

  const itemId = formData.get('item_id');
  const donorName = (formData.get('donor_name') || '').trim();
  const donorEmail = (formData.get('donor_email') || '').trim();
  const quantity = Math.max(1, parseInt(formData.get('quantity') || '1', 10));
  const notes = (formData.get('notes') || '').trim();

  if (!itemId || !donorName || !donorEmail) {
    return { error: 'Please provide your name and email.' };
  }

  const { data: { user } } = await supabase.auth.getUser();

  // 1. Insert claim record
  const claimData = {
    item_id: itemId,
    user_id: user?.id || null,
    donor_name: donorName,
    donor_email: donorEmail,
    quantity,
    notes,
    status: 'pledged'
  };

  const { error: claimError } = await supabase.from('wishlist_claims').insert([claimData]);

  if (claimError) {
    console.error('Error inserting wishlist claim:', claimError);
    // If table doesn't exist yet, return helpful error
    if (claimError.code === '42P01') {
      return { error: 'Wishlist database table not yet initialized. Please run features_pack.sql in Supabase.' };
    }
    return { error: claimError.message };
  }

  // 2. Increment quantity_claimed in wishlist_items
  const { data: item } = await supabase.from('wishlist_items').select('quantity_claimed').eq('id', itemId).single();
  if (item) {
    const newClaimed = (item.quantity_claimed || 0) + quantity;
    await supabase.from('wishlist_items').update({ quantity_claimed: newClaimed }).eq('id', itemId);
  }

  revalidatePath('/wishlist');
  revalidatePath('/admin/wishlist');
  return { success: true };
}
