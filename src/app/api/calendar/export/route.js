import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

function formatICSDate(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escapeICS(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month'); // optional YYYY-MM
  const supabase = await createClient();

  let query = supabase.from('shifts').select('*').order('start_time', { ascending: true });

  if (month) {
    const [yearStr, monthStr] = month.split('-');
    const year = parseInt(yearStr, 10);
    const m = parseInt(monthStr, 10);
    const startOfMonth = new Date(Date.UTC(year, m - 1, 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, m, 0, 23, 59, 59));
    query = query.gte('start_time', startOfMonth.toISOString()).lte('start_time', endOfMonth.toISOString());
  }

  const { data: shifts, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Loma Prieta School Garden//Volunteer Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Loma Prieta Garden Schedule',
    'X-WR-TIMEZONE:America/Los_Angeles'
  ];

  (shifts || []).forEach(shift => {
    const startDate = new Date(shift.start_time);
    const endDate = new Date(shift.end_time);
    const uid = `${shift.id}@lomagarden.org`;
    const summary = escapeICS(shift.title);
    const description = escapeICS(shift.description || `Loma Garden session: ${shift.title}`);
    const location = escapeICS('Loma Prieta School Garden, Los Gatos, CA');

    ics.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });

  ics.push('END:VCALENDAR');

  const filename = month ? `loma-garden-${month}.ics` : 'loma-garden-schedule.ics';

  return new NextResponse(ics.join('\r\n'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
}
