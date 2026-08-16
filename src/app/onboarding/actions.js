'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function saveProfile(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Parse availability (Sun-Sat, Morning/Afternoon)
  const availability = {
    sunday: { morning: formData.get('sun_m') === 'on', afternoon: formData.get('sun_a') === 'on' },
    monday: { morning: formData.get('mon_m') === 'on', afternoon: formData.get('mon_a') === 'on' },
    tuesday: { morning: formData.get('tue_m') === 'on', afternoon: formData.get('tue_a') === 'on' },
    wednesday: { morning: formData.get('wed_m') === 'on', afternoon: formData.get('wed_a') === 'on' },
    thursday: { morning: formData.get('thu_m') === 'on', afternoon: formData.get('thu_a') === 'on' },
    friday: { morning: formData.get('fri_m') === 'on', afternoon: formData.get('fri_a') === 'on' },
    saturday: { morning: formData.get('sat_m') === 'on', afternoon: formData.get('sat_a') === 'on' },
  }

  const profileData = {
    id: user.id, // Primary key linking to auth.users
    name: formData.get('name'),
    email: user.email,
    phone: formData.get('phone'),
    contact_preference: formData.get('contact_preference'),
    availability: availability,
    hours_per_month: parseInt(formData.get('hours_per_month') || '0', 10),
    volunteer_type: formData.get('volunteer_type'),
    training_interest: formData.get('training_interest') === 'yes',
    class_info: formData.get('class_info'),
    role: 'volunteer', // Default role
    onboarded: true, // Flag to indicate they finished onboarding
  }

  const { error } = await supabase.from('profiles').upsert(profileData)

  if (error) {
    console.error('Error saving profile:', error)
    return { error: 'Failed to save profile. Please try again.' }
  }

  redirect('/profile')
}
