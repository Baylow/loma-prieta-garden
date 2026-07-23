import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export async function GET(request) {
  try {
    if (!supabase) {
      return NextResponse.json({ message: 'Supabase not configured, skipping cron job' });
    }

    // 1. Calculate tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD format

    // 2. Query Supabase for volunteers scheduled for tomorrow
    const { data: volunteers, error: dbError } = await supabase
      .from('volunteers')
      .select('*')
      .eq('date', dateString)
      .eq('status', 'confirmed');

    if (dbError) {
      console.error('Database query error:', dbError);
      return NextResponse.json({ error: 'Failed to query database' }, { status: 500 });
    }

    if (!volunteers || volunteers.length === 0) {
      return NextResponse.json({ message: 'No volunteers scheduled for tomorrow' });
    }

    // 3. Send reminder emails
    const emailsToSend = volunteers.map(volunteer => {
      // For now, we link to a generic placeholder curriculum. 
      // In a real app, this could match the grade based on the date.
      // E.g., 'https://your-domain.com/curriculum/grade-k.pdf'
      const curriculumUrl = 'https://loma-prieta-garden.onrender.com/curriculum/grade-k.pdf';

      return resend.emails.send({
        from: 'Garden Volunteer <onboarding@resend.dev>',
        to: [volunteer.email],
        subject: `Reminder: Tomorrow's Garden Shift - ${volunteer.shift_name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #662e80;">Hello ${volunteer.name}! 🌻</h2>
            <p>This is a quick reminder that you are scheduled to volunteer in the garden tomorrow!</p>
            <div style="background-color: #f7f9fc; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Shift:</strong> ${volunteer.shift_name}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${volunteer.shift_time}</p>
            </div>
            <h3 style="color: #004b8d;">Tomorrow's Curriculum</h3>
            <p>Please review tomorrow's curriculum before your shift so you're ready to help the kids learn!</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${curriculumUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3bb5b5; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Download Curriculum PDF</a>
            </div>
            <br/>
            <p>See you in the garden!</p>
            <p style="color: #666;">- The Loma Prieta School Garden Team</p>
          </div>
        `,
      });
    });

    const results = await Promise.allSettled(emailsToSend);
    
    return NextResponse.json({ 
      success: true, 
      message: `Processed ${volunteers.length} reminders`,
      results
    });
    
  } catch (error) {
    console.error('Cron API Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
