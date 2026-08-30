'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function signUpForShift(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to sign up.' }

  const shiftId = formData.get('shift_id')
  const isRecurring = formData.get('recurring') === 'true'

  // Fetch the target shift
  const { data: targetShift } = await supabase
    .from('shifts')
    .select('*')
    .eq('id', shiftId)
    .single()

  if (!targetShift) return { error: 'Shift not found' }

  if (!isRecurring) {
    // Single shift signup
    const { data: signups } = await supabase.from('shift_signups').select('user_id').eq('shift_id', shiftId)
    if (signups && signups.length >= targetShift.max_volunteers) {
      return { error: 'This shift is already full.' }
    }

    const { error } = await supabase.from('shift_signups').insert([{ shift_id: shiftId, user_id: user.id }])
    if (error && !error.message.includes('duplicate key')) return { error: error.message }
  } else {
    // Recurring signup: find all upcoming matching shifts (same title, day of week, and time)
    const targetDate = new Date(targetShift.start_time)
    const targetDay = targetDate.getDay()
    const targetHours = targetDate.getHours()
    const targetMinutes = targetDate.getMinutes()

    const { data: allUpcoming } = await supabase
      .from('shifts')
      .select('*, shift_signups(user_id)')
      .gte('start_time', targetShift.start_time)
      .order('start_time', { ascending: true })

    const matchingShifts = allUpcoming?.filter(s => {
      if (s.title.trim().toLowerCase() !== targetShift.title.trim().toLowerCase()) return false
      const sDate = new Date(s.start_time)
      return sDate.getDay() === targetDay && 
             sDate.getHours() === targetHours && 
             sDate.getMinutes() === targetMinutes
    }) || []

    const signupsToInsert = []
    for (const s of matchingShifts) {
      const alreadySignedUp = s.shift_signups.some(signup => signup.user_id === user.id)
      const isFull = s.shift_signups.length >= s.max_volunteers
      if (!alreadySignedUp && !isFull) {
        signupsToInsert.push({ shift_id: s.id, user_id: user.id })
      }
    }

    if (signupsToInsert.length > 0) {
      const { error } = await supabase.from('shift_signups').insert(signupsToInsert)
      if (error && !error.message.includes('duplicate key')) return { error: error.message }
    }
  }

  revalidatePath('/schedule')
  revalidatePath('/profile')
  return { success: true }
}

export async function cancelShiftSignup(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in.' }

  const shiftId = formData.get('shift_id')
  const cancelAllRecurring = formData.get('cancel_recurring') === 'true'

  if (!cancelAllRecurring) {
    const { error } = await supabase.from('shift_signups').delete().match({ shift_id: shiftId, user_id: user.id })
    if (error) return { error: error.message }
  } else {
    // Find target shift to identify recurrence pattern
    const { data: targetShift } = await supabase.from('shifts').select('*').eq('id', shiftId).single()
    if (targetShift) {
      const targetDate = new Date(targetShift.start_time)
      const targetDay = targetDate.getDay()
      const targetHours = targetDate.getHours()
      const targetMinutes = targetDate.getMinutes()

      const { data: allUpcoming } = await supabase
        .from('shifts')
        .select('id, title, start_time')
        .gte('start_time', targetShift.start_time)

      const matchingShiftIds = allUpcoming?.filter(s => {
        if (s.title.trim().toLowerCase() !== targetShift.title.trim().toLowerCase()) return false
        const sDate = new Date(s.start_time)
        return sDate.getDay() === targetDay && 
               sDate.getHours() === targetHours && 
               sDate.getMinutes() === targetMinutes
      }).map(s => s.id) || []

      if (matchingShiftIds.length > 0) {
        await supabase
          .from('shift_signups')
          .delete()
          .eq('user_id', user.id)
          .in('shift_id', matchingShiftIds)
      }
    } else {
      await supabase.from('shift_signups').delete().match({ shift_id: shiftId, user_id: user.id })
    }
  }

  revalidatePath('/schedule')
  revalidatePath('/profile')
  return { success: true }
}
