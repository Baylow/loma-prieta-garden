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

export async function createShift(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  let startTime = formData.get('start_time')
  let endTime = formData.get('end_time')
  
  // If it comes from datetime-local input, it won't have a timezone (length 16 like YYYY-MM-DDTHH:MM)
  // We parse it into a local Date object, then get the UTC ISO string to save to the DB
  if (startTime && startTime.length <= 16) {
    startTime = new Date(startTime).toISOString()
  }
  if (endTime && endTime.length <= 16) {
    endTime = new Date(endTime).toISOString()
  }

  const shiftData = {
    title: formData.get('title'),
    description: formData.get('description'),
    start_time: startTime,
    end_time: endTime,
    type: formData.get('type'),
    max_volunteers: parseInt(formData.get('max_volunteers') || '2', 10),
  }

  const { error } = await supabase.from('shifts').insert([shiftData])

  if (error) return { error: error.message }

  revalidatePath('/schedule')
  revalidatePath('/admin/schedule')
  return { success: true }
}

export async function deleteShift(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  const id = formData.get('id')
  
  const { error } = await supabase.from('shifts').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/schedule')
  revalidatePath('/admin/schedule')
  return { success: true }
}

export async function bulkCreateShifts(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  const title = formData.get('title')
  const description = formData.get('description')
  const type = formData.get('type')
  const max_volunteers = parseInt(formData.get('max_volunteers') || '2', 10)
  
  const startDateStr = formData.get('start_date') // YYYY-MM-DD
  const endDateStr = formData.get('end_date') // YYYY-MM-DD
  const startTimeStr = formData.get('start_time') // HH:MM
  const endTimeStr = formData.get('end_time') // HH:MM
  
  const daysOfWeek = formData.getAll('days_of_week') // Array of '0' (Sun) to '6' (Sat)

  if (!startDateStr || !endDateStr || !startTimeStr || !endTimeStr || daysOfWeek.length === 0) {
    return { error: 'Missing required fields' }
  }

  const startDate = new Date(startDateStr + 'T00:00:00')
  const endDate = new Date(endDateStr + 'T23:59:59')
  
  const shiftsToInsert = []
  
  let currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay().toString()
    if (daysOfWeek.includes(dayOfWeek)) {
      const year = currentDate.getFullYear()
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
      const dayStr = currentDate.getDate().toString().padStart(2, '0')
      const dateString = `${year}-${month}-${dayStr}`
      
      const startDateTime = new Date(`${dateString}T${startTimeStr}:00`)
      const endDateTime = new Date(`${dateString}T${endTimeStr}:00`)
      
      shiftsToInsert.push({
        title,
        description,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        type,
        max_volunteers
      })
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  if (shiftsToInsert.length === 0) {
    return { error: 'No dates matched the selected criteria' }
  }

  const recurringVolunteerId = formData.get('recurring_volunteer_id')

  const { data: insertedShifts, error } = await supabase.from('shifts').insert(shiftsToInsert).select('id')

  if (error) return { error: error.message }

  // If a recurring volunteer / class lead was selected, automatically sign them up for all shifts in this batch
  if (recurringVolunteerId && insertedShifts && insertedShifts.length > 0) {
    const signupsToInsert = insertedShifts.map(s => ({
      shift_id: s.id,
      user_id: recurringVolunteerId
    }))
    await supabase.from('shift_signups').insert(signupsToInsert)
  }

  revalidatePath('/schedule')
  revalidatePath('/admin/schedule')
  return { success: true }
}

export async function assignVolunteerToShift(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  const shiftId = formData.get('shift_id')
  const volunteerId = formData.get('volunteer_id')
  const isRecurring = formData.get('is_recurring') === 'true'

  if (!shiftId || !volunteerId) return { error: 'Missing required fields' }

  const { data: targetShift } = await supabase.from('shifts').select('*').eq('id', shiftId).single()
  if (!targetShift) return { error: 'Shift not found' }

  if (!isRecurring) {
    const { error } = await supabase.from('shift_signups').insert([{ shift_id: shiftId, user_id: volunteerId }])
    if (error && !error.message.includes('duplicate key')) return { error: error.message }
  } else {
    const targetDate = new Date(targetShift.start_time)
    const targetDay = targetDate.getDay()
    const targetHours = targetDate.getHours()
    const targetMinutes = targetDate.getMinutes()

    const { data: allUpcoming } = await supabase
      .from('shifts')
      .select('*, shift_signups(user_id)')
      .gte('start_time', targetShift.start_time)

    const matchingShifts = allUpcoming?.filter(s => {
      if (s.title.trim().toLowerCase() !== targetShift.title.trim().toLowerCase()) return false
      const sDate = new Date(s.start_time)
      return sDate.getDay() === targetDay && 
             sDate.getHours() === targetHours && 
             sDate.getMinutes() === targetMinutes
    }) || []

    const signupsToInsert = []
    for (const s of matchingShifts) {
      const alreadySignedUp = s.shift_signups.some(signup => signup.user_id === volunteerId)
      if (!alreadySignedUp && s.shift_signups.length < s.max_volunteers) {
        signupsToInsert.push({ shift_id: s.id, user_id: volunteerId })
      }
    }

    if (signupsToInsert.length > 0) {
      await supabase.from('shift_signups').insert(signupsToInsert)
    }
  }

  revalidatePath('/schedule')
  revalidatePath('/admin/schedule')
  return { success: true }
}

export async function removeVolunteerFromShift(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  const shiftId = formData.get('shift_id')
  const volunteerId = formData.get('volunteer_id')

  const { error } = await supabase.from('shift_signups').delete().match({ shift_id: shiftId, user_id: volunteerId })
  if (error) return { error: error.message }

  revalidatePath('/schedule')
  revalidatePath('/admin/schedule')
  return { success: true }
}

export async function promoteToAdmin(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('email').eq('id', user.id).single()
  
  const userEmail = (user.email || profile?.email || '').toLowerCase().trim()
  if (userEmail !== 'baylow@gmail.com') return { error: 'Not authorized' }

  const id = formData.get('id')
  
  const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', id)

  if (error) {
    console.error('Error promoting to admin:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/volunteers')
  return { success: true }
}

export async function revokeAdmin(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('email').eq('id', user.id).single()
  
  const userEmail = (user.email || profile?.email || '').toLowerCase().trim()
  if (userEmail !== 'baylow@gmail.com') return { error: 'Not authorized' }

  const id = formData.get('id')
  
  const { error } = await supabase.from('profiles').update({ role: 'volunteer' }).eq('id', id)

  if (error) {
    console.error('Error revoking admin:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/volunteers')
  return { success: true }
}

