import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    return new NextResponse('Forbidden - Admin only', { status: 403 });
  }

  // Fetch all profiles
  const { data: volunteers } = await supabase.from('profiles').select('*').order('name', { ascending: true });

  // Fetch all signups and shifts
  const { data: signups } = await supabase.from('shift_signups').select('user_id, shift_id, shifts(*)');

  const now = new Date();
  const userHoursMap = new Map();

  (signups || []).forEach(s => {
    if (!s.shifts) return;
    const start = new Date(s.shifts.start_time);
    const end = new Date(s.shifts.end_time);
    const durationHours = Math.max(0, (end - start) / (1000 * 60 * 60));
    const isCompleted = end <= now;

    const current = userHoursMap.get(s.user_id) || { completedHours: 0, upcomingHours: 0, completedShifts: 0 };
    if (isCompleted) {
      current.completedHours += durationHours;
      current.completedShifts += 1;
    } else {
      current.upcomingHours += durationHours;
    }
    userHoursMap.set(s.user_id, current);
  });

  // Generate CSV rows
  const headers = [
    'Name',
    'Email',
    'Phone',
    'Role Type',
    'Class Info',
    'Completed Shifts',
    'Completed Hours',
    'Upcoming Committed Hours',
    '10hr District Milestone Reached'
  ];

  const rows = (volunteers || []).map(v => {
    const stats = userHoursMap.get(v.id) || { completedHours: 0, upcomingHours: 0, completedShifts: 0 };
    const milestoneReached = stats.completedHours >= 10 ? 'YES' : 'NO';

    return [
      `"${(v.name || '').replace(/"/g, '""')}"`,
      `"${(v.email || '').replace(/"/g, '""')}"`,
      `"${(v.phone || '').replace(/"/g, '""')}"`,
      `"${(v.volunteer_type || '').replace(/"/g, '""')}"`,
      `"${(v.class_info || '').replace(/"/g, '""')}"`,
      stats.completedShifts,
      stats.completedHours.toFixed(2),
      stats.upcomingHours.toFixed(2),
      milestoneReached
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="loma-garden-volunteer-hours-${new Date().toISOString().slice(0, 10)}.csv"`
    }
  });
}
