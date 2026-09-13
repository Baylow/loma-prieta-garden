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

function getPacificUTCISOString(dateStr, timeStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hour, min] = timeStr.split(':').map(Number)
  const testUtc = new Date(Date.UTC(year, month - 1, day, hour, min))
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false
  })
  
  const parts = formatter.formatToParts(testUtc)
  const laHour = parseInt(parts.find(p => p.type === 'hour').value, 10) % 24
  const laDay = parseInt(parts.find(p => p.type === 'day').value, 10)
  
  let hourDiff = hour - laHour
  if (day !== laDay) {
    if (day > laDay) hourDiff += 24
    else hourDiff -= 24
  }
  
  return new Date(testUtc.getTime() + hourDiff * 3600000).toISOString()
}

export async function createShift(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  let startTime = formData.get('start_time')
  let endTime = formData.get('end_time')
  
  // If it comes from datetime-local input (length 16 like YYYY-MM-DDTHH:MM), convert Pacific to UTC
  if (startTime && startTime.length <= 16) {
    const [dPart, tPart] = startTime.split('T')
    startTime = getPacificUTCISOString(dPart, tPart)
  }
  if (endTime && endTime.length <= 16) {
    const [dPart, tPart] = endTime.split('T')
    endTime = getPacificUTCISOString(dPart, tPart)
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
  const intervalWeeks = Math.max(1, parseInt(formData.get('interval_weeks') || '1', 10))
  
  const daysOfWeek = formData.getAll('days_of_week') // Array of '0' (Sun) to '6' (Sat)

  if (!startDateStr || !endDateStr || !startTimeStr || !endTimeStr || daysOfWeek.length === 0) {
    return { error: 'Missing required fields' }
  }

  const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number)
  const [eYear, eMonth, eDay] = endDateStr.split('-').map(Number)
  const startDate = new Date(sYear, sMonth - 1, sDay)
  const endDate = new Date(eYear, eMonth - 1, eDay)

  // Helper to get Monday of a date for week counting
  const getMondayOfDate = (d) => {
    const temp = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const day = temp.getDay()
    const diff = temp.getDate() - day + (day === 0 ? -6 : 1)
    temp.setDate(diff)
    temp.setHours(0, 0, 0, 0)
    return temp
  }

  const startMonday = getMondayOfDate(startDate)
  
  const shiftsToInsert = []
  
  let currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay().toString()
    if (daysOfWeek.includes(dayOfWeek)) {
      const currentMonday = getMondayOfDate(currentDate)
      const weekDiff = Math.round((currentMonday.getTime() - startMonday.getTime()) / (7 * 24 * 60 * 60 * 1000))

      if (weekDiff % intervalWeeks === 0) {
        const year = currentDate.getFullYear()
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
        const dayStr = currentDate.getDate().toString().padStart(2, '0')
        const dateString = `${year}-${month}-${dayStr}`
        
        shiftsToInsert.push({
          title,
          description,
          start_time: getPacificUTCISOString(dateString, startTimeStr),
          end_time: getPacificUTCISOString(dateString, endTimeStr),
          type,
          max_volunteers
        })
      }
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
  revalidatePath('/schedule/monthly')
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

export async function createWishlistItem(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  const itemData = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category') || 'Tools & Gear',
    quantity_needed: parseInt(formData.get('quantity_needed') || '1', 10),
    urgency: formData.get('urgency') || 'normal',
    link_url: formData.get('link_url') || null,
  }

  const { error } = await supabase.from('wishlist_items').insert([itemData])
  if (error) return { error: error.message }

  revalidatePath('/wishlist')
  revalidatePath('/admin/wishlist')
  return { success: true }
}

export async function deleteWishlistItem(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  const id = formData.get('id')
  const { error } = await supabase.from('wishlist_items').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/wishlist')
  revalidatePath('/admin/wishlist')
  return { success: true }
}

export async function updateWishlistClaimStatus(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  const claimId = formData.get('claim_id')
  const status = formData.get('status')

  const { error } = await supabase.from('wishlist_claims').update({ status }).eq('id', claimId)
  if (error) return { error: error.message }

  revalidatePath('/wishlist')
  revalidatePath('/admin/wishlist')
  return { success: true }
}

export async function approveScheduleRequest(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  const requestId = formData.get('request_id')
  const { data: req } = await supabase.from('schedule_requests').select('*').eq('id', requestId).single()
  if (!req) return { error: 'Request not found' }

  // Compute shift start and end
  // If time string is like "08:50 - 09:35" or standard format
  const dateStr = req.preferred_date // YYYY-MM-DD
  let startHour = 9, startMin = 0, endHour = 9, endMin = 45

  if (req.preferred_time) {
    const timeMatch = req.preferred_time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10)
      const m = parseInt(timeMatch[2], 10)
      const meridiem = timeMatch[3]?.toUpperCase()
      if (meridiem === 'PM' && h < 12) h += 12
      if (meridiem === 'AM' && h === 12) h = 0
      startHour = h
      startMin = m
      endHour = h
      endMin = m + 45
      if (endMin >= 60) {
        endHour += Math.floor(endMin / 60)
        endMin = endMin % 60
      }
    }
  }

  const startDateTime = new Date(`${dateStr}T${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}:00`)
  const endDateTime = new Date(`${dateStr}T${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}:00`)

  // 1. Create shift in shifts table
  const shiftTitle = `${req.grade} Class - ${req.teacher_name} (${req.topic})`
  const shiftData = {
    title: shiftTitle,
    description: `Teacher Request for ${req.student_count || 20} students. Topic: ${req.topic}. ${req.notes ? 'Notes: ' + req.notes : ''}`,
    start_time: startDateTime.toISOString(),
    end_time: endDateTime.toISOString(),
    type: 'class',
    max_volunteers: 2
  }

  const { error: shiftError } = await supabase.from('shifts').insert([shiftData])
  if (shiftError) return { error: shiftError.message }

  // 2. Mark request approved
  await supabase.from('schedule_requests').update({ 
    status: 'approved',
    admin_notes: 'Approved and added to calendar shift schedule.'
  }).eq('id', requestId)

  revalidatePath('/schedule')
  revalidatePath('/admin/schedule')
  return { success: true }
}

export async function declineScheduleRequest(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  const requestId = formData.get('request_id')
  const adminNotes = formData.get('admin_notes') || 'Declined'

  const { error } = await supabase.from('schedule_requests').update({
    status: 'declined',
    admin_notes: adminNotes
  }).eq('id', requestId)

  if (error) return { error: error.message }

  revalidatePath('/admin/schedule')
  return { success: true }
}

export async function updateWeatherNotice(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Not authorized' }

  const status = formData.get('status') || 'normal'
  const customMessage = formData.get('custom_message') || ''

  const contentJson = JSON.stringify({
    status,
    custom_message: customMessage,
    last_updated: new Date().toISOString()
  })

  // Upsert into site_content
  const { error } = await supabase.from('site_content').upsert({
    id: 'weather_notice',
    content: contentJson,
    updated_at: new Date().toISOString()
  })

  if (error) return { error: error.message }

  revalidatePath('/schedule')
  revalidatePath('/schedule/monthly')
  revalidatePath('/admin/schedule')
  revalidatePath('/admin/content')
  revalidatePath('/')
  return { success: true }
}


