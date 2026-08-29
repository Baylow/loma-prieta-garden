import { createClient } from '@/utils/supabase/server'
import { bulkCreateShifts, deleteShift } from '../actions'

export default async function AdminSchedulePage() {
  const supabase = await createClient()

  // Fetch upcoming shifts
  const { data: shifts } = await supabase
    .from('shifts')
    .select('*, shift_signups(count)')
    .order('start_time', { ascending: true })
    .gte('start_time', new Date().toISOString())

  return (
    <div>
      <h2 style={{ marginBottom: '1rem', color: 'var(--sapphire-blue)' }}>Manage Schedule</h2>
      <p className="text-muted mb-8">Generate recurring class blocks or schedule one-off events.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
        
        {/* Bulk Generator */}
        <section>
          <div className="mb-8" style={{ backgroundColor: '#f8f6fc', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(102, 46, 128, 0.1)' }}>
            <h4 className="mb-4">Bulk Shift Generator</h4>
            <form action={bulkCreateShifts} className="flex flex-col gap-4">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="flex flex-col gap-2">
                  <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Shift Title</label>
                  <input type="text" name="title" placeholder="e.g. 3rd Grade Garden Class" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div className="flex flex-col gap-2">
                  <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Shift Type</label>
                  <select name="type" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
                    <option value="class">Regular Class</option>
                    <option value="event">Special Event</option>
                    <option value="work_day">Work Day</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="flex flex-col gap-2">
                  <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Start Date (Range)</label>
                  <input type="date" name="start_date" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div className="flex flex-col gap-2">
                  <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>End Date (Range)</label>
                  <input type="date" name="end_date" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="flex flex-col gap-2">
                  <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Start Time</label>
                  <input type="time" name="start_time" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div className="flex flex-col gap-2">
                  <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>End Time</label>
                  <input type="time" name="end_time" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div className="flex flex-col gap-2">
                  <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Max Volunteers</label>
                  <input type="number" name="max_volunteers" defaultValue="2" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Days of the Week</label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label><input type="checkbox" name="days_of_week" value="1" /> Mon</label>
                  <label><input type="checkbox" name="days_of_week" value="2" /> Tue</label>
                  <label><input type="checkbox" name="days_of_week" value="3" /> Wed</label>
                  <label><input type="checkbox" name="days_of_week" value="4" /> Thu</label>
                  <label><input type="checkbox" name="days_of_week" value="5" /> Fri</label>
                  <label><input type="checkbox" name="days_of_week" value="6" /> Sat</label>
                  <label><input type="checkbox" name="days_of_week" value="0" /> Sun</label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>Generate Shifts</button>
            </form>
          </div>
        </section>

        {/* Shift List */}
        <section>
          <h4 className="mb-4">Upcoming Shifts</h4>
          {(!shifts || shifts.length === 0) ? (
            <p className="text-muted">No upcoming shifts scheduled.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>Date</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Time</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Title</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Type</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Signups</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map(shift => {
                    const startDate = new Date(shift.start_time)
                    const endDate = new Date(shift.end_time)
                    const signupsCount = shift.shift_signups[0]?.count || 0
                    
                    return (
                      <tr key={shift.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>
                          {startDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          {startDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} - {endDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>{shift.title}</td>
                        <td style={{ padding: '1rem 0.5rem', textTransform: 'capitalize' }}>{shift.type.replace('_', ' ')}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          {signupsCount} / {shift.max_volunteers}
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <form action={deleteShift}>
                            <input type="hidden" name="id" value={shift.id} />
                            <button type="submit" style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', textDecoration: 'underline' }}>Cancel Shift</button>
                          </form>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
