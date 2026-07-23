import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, date, shiftName, shiftTime } = body;

    if (!name || !email || !date || !shiftName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Save to Supabase (only if keys are configured)
    if (supabase) {
      const { error: dbError } = await supabase
        .from('volunteers')
        .insert([
          { name, email, date, shift_name: shiftName, shift_time: shiftTime, status: 'confirmed' }
        ]);
        
      if (dbError) {
        console.error('Supabase Error:', dbError);
        return NextResponse.json({ error: 'Failed to save to database' }, { status: 500 });
      }
    } else {
      console.log('Supabase not configured yet. Skipping DB insert for:', name);
    }

    // 2. Send Confirmation Email via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'Garden Volunteer <onboarding@resend.dev>', // Resend testing domain (only sends to your verified email)
      to: [email],
      subject: 'Loma Garden - Volunteer Confirmation',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #662e80;">Thanks for volunteering, ${name}! 🌱</h2>
          <p>You are officially confirmed for the garden.</p>
          <div style="background-color: #f7f9fc; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Shift:</strong> ${shiftName}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${shiftTime}</p>
          </div>
          <p>We'll send you a reminder email the day before your shift with the curriculum PDF for that day!</p>
          <br/>
          <p style="color: #666;">- The Loma Prieta School Garden Team</p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Resend Error:', emailError);
      return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
