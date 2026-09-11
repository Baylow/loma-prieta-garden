import { createClient } from '@/utils/supabase/server';
import MonthlyCalendar from './MonthlyCalendar';

export default async function MonthlySchedulePage() {
  const supabase = await createClient();

  // Fetch all shifts for the year
  const { data: shifts, error } = await supabase
    .from('shifts')
    .select('*, shift_signups(user_id)')
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching shifts for monthly calendar:', error);
  }

  return (
    <div className="container mt-8 animate-fade-in-down mb-12">
      <h1 className="text-center mb-2">Garden Monthly Calendar</h1>
      <p className="text-center mb-8 text-muted">
        Monthly overview of all classroom garden sessions, work days, and special events.
      </p>

      <MonthlyCalendar initialShifts={shifts || []} />
    </div>
  );
}
