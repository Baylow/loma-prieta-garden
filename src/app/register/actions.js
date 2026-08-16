'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function registerAndOnboard(formData) {
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')

  // 1. Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  const user = authData.user
  if (!user) {
    return { error: 'Failed to create user account.' }
  }

  // 2. Parse availability
  const availability = {
    sunday: { morning: formData.get('sun_m') === 'on', afternoon: formData.get('sun_a') === 'on' },
    monday: { morning: formData.get('mon_m') === 'on', afternoon: formData.get('mon_a') === 'on' },
    tuesday: { morning: formData.get('tue_m') === 'on', afternoon: formData.get('tue_a') === 'on' },
    wednesday: { morning: formData.get('wed_m') === 'on', afternoon: formData.get('wed_a') === 'on' },
    thursday: { morning: formData.get('thu_m') === 'on', afternoon: formData.get('thu_a') === 'on' },
    friday: { morning: formData.get('fri_m') === 'on', afternoon: formData.get('fri_a') === 'on' },
    saturday: { morning: formData.get('sat_m') === 'on', afternoon: formData.get('sat_a') === 'on' },
  }

  // 3. Build profile data
  const profileData = {
    id: user.id,
    name: formData.get('name'),
    email: user.email,
    phone: formData.get('phone'),
    contact_preference: formData.get('contact_preference'),
    availability: availability,
    hours_per_month: parseInt(formData.get('hours_per_month') || '0', 10),
    volunteer_type: formData.get('volunteer_type'),
    training_interest: formData.get('training_interest') === 'yes',
    class_info: formData.get('class_info'),
    role: 'volunteer',
    onboarded: true,
    photo_url: formData.get('photo_url') || null,
    bio: formData.get('bio') || null,
    relationship: formData.get('relationship') || null,
    kids_names: formData.get('kids_names') || null,
  }

  // 4. Insert profile
  const { error: profileError } = await supabase.from('profiles').upsert(profileData)

  if (profileError) {
    console.error('Error saving profile:', profileError)
    // Even if profile fails, account is created, so redirect them so they can at least log in later.
    return { error: 'Account created, but failed to save profile data. Please try logging in and updating your profile later.' }
  }

  revalidatePath('/', 'layout')
  redirect('/profile')
}
