import { createClient } from '@/utils/supabase/server';
import MonthlyCalendar from './MonthlyCalendar';
import WeatherWidget from '@/components/WeatherWidget';

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

  // Fetch weather notice from site_content
  const { data: weatherNotice } = await supabase
    .from('site_content')
    .select('content')
    .eq('id', 'weather_notice')
    .single();

  return (
    <div className="container mt-8 animate-fade-in-down mb-12">
      <div className="no-print">
        <h1 className="text-center mb-2">Garden Monthly Calendar</h1>
        <p className="text-center mb-6 text-muted">
          Monthly overview of all classroom garden sessions, work days, and special events.
        </p>

        {/* Live Weather Forecast & Rain Plan Notice */}
        <WeatherWidget weatherNotice={weatherNotice?.content} />
      </div>

      <MonthlyCalendar initialShifts={shifts || []} />
    </div>
  );
}
