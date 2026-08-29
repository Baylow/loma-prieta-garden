'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSiteContent(formData) {
  const supabase = await createClient()

  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  const contentId = formData.get('id')
  const contentText = formData.get('content')

  const { error } = await supabase.from('site_content').update({ content: contentText, updated_at: new Date().toISOString() }).eq('id', contentId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/') // Revalidate homepage to show new content
  revalidatePath('/admin/content')
  return { success: true }
}

export async function createUpdate(formData) {
  const supabase = await createClient()

  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  const updateData = {
    title: formData.get('title'),
    body: formData.get('body'),
    author: formData.get('author'),
  }

  const { error } = await supabase.from('updates').insert([updateData])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/updates')
  revalidatePath('/admin/content')
  return { success: true }
}

export async function createGardenBed(formData) {
  const supabase = await createClient()

  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  const bedData = {
    bed_number: formData.get('bed_number'),
    plant_name: formData.get('plant_name'),
    description: formData.get('description'),
    harvest_date: formData.get('harvest_date'),
    image_url: formData.get('image_url') || '/images/raised-beds.jpg',
  }

  const { error } = await supabase.from('garden_beds').insert([bedData])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/growing')
  revalidatePath('/admin/growing')
  return { success: true }
}

export async function deleteGardenBed(formData) {
  const supabase = await createClient()

  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  const id = formData.get('id')
  
  const { error } = await supabase.from('garden_beds').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/growing')
  revalidatePath('/admin/growing')
  return { success: true }
}

export async function updateBedGrid(id, gridData) {
  const supabase = await createClient()

  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  const { error } = await supabase.from('garden_beds').update({ grid_data: gridData }).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/growing')
  revalidatePath('/admin/growing')
  return { success: true }
}

