'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitScheduleRequest(formData) {
  const supabase = await createClient();

  const teacherName = (formData.get('teacher_name') || '').trim();
  const teacherEmail = (formData.get('teacher_email') || '').trim();
  const grade = formData.get('grade');
  const studentCount = parseInt(formData.get('student_count') || '20', 10);
  const preferredDate = formData.get('preferred_date'); // YYYY-MM-DD
  const preferredTime = formData.get('preferred_time');
  const topic = (formData.get('topic') || '').trim();
  const bedNumbers = formData.get('bed_numbers') || 'Any';
  const notes = (formData.get('notes') || '').trim();

  if (!teacherName || !teacherEmail || !grade || !preferredDate || !preferredTime || !topic) {
    return { error: 'Please fill in all required fields marked with *.' };
  }

  const requestData = {
    teacher_name: teacherName,
    teacher_email: teacherEmail,
    grade,
    student_count: studentCount,
    preferred_date: preferredDate,
    preferred_time: preferredTime,
    topic,
    bed_numbers: bedNumbers,
    notes,
    status: 'pending'
  };

  const { error } = await supabase.from('schedule_requests').insert([requestData]);

  if (error) {
    console.error('Error submitting schedule request:', error);
    if (error.code === '42P01') {
      return { error: 'Schedule request database table not yet initialized. Please run features_pack.sql in Supabase.' };
    }
    return { error: error.message };
  }

  revalidatePath('/schedule');
  revalidatePath('/admin/schedule');
  return { success: true };
}
