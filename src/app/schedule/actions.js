'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function signUpForShift(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to sign up.' }

  const shiftId = formData.get('shift_id')

  // Double check if there's room
  const { data: signups } = await supabase.from('shift_signups').select('user_id').eq('shift_id', shiftId)
  const { data: shift } = await supabase.from('shifts').select('max_volunteers').eq('id', shiftId).single()
  
  if (signups && shift && signups.length >= shift.max_volunteers) {
    return { error: 'This shift is already full.' }
  }

  const { error } = await supabase.from('shift_signups').insert([{ shift_id: shiftId, user_id: user.id }])

  if (error) return { error: error.message }

  revalidatePath('/schedule')
  revalidatePath('/profile')
  return { success: true }
}

export async function cancelShiftSignup(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in.' }

  const shiftId = formData.get('shift_id')

  const { error } = await supabase.from('shift_signups').delete().match({ shift_id: shiftId, user_id: user.id })

  if (error) return { error: error.message }

  revalidatePath('/schedule')
  revalidatePath('/profile')
  return { success: true }
}
