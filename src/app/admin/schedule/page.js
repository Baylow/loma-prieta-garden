import { createClient } from '@/utils/supabase/server'
import { createShift, deleteShift, bulkCreateShifts, assignVolunteerToShift, removeVolunteerFromShift } from '../actions'
import Link from 'next/link'

const STANDARD_BLOCKS = [
  { start: '08:30', end: '09:15' },
  { start: '09:15', end: '10:00' },
  { start: '10:00', end: '10:45' },
  { start: '10:45', end: '11:30' },
  { start: '11:30', end: '12:15' },
  { start: '12:15', end: '13:00' },
  { start: '13:00', end: '13:45' },
  { start: '13:45', end: '14:30' }
]

export default async function AdminSchedulePage(props) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  // Calculate dates
  const weekOffset = parseInt(searchParams?.week || '0', 10)
  
  // Get current Monday
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
  const currentMonday = new Date(today.setDate(diff))
  currentMonday.setHours(0, 0, 0, 0)
  
  // Apply offset
  const weekStart = new Date(currentMonday)
  weekStart.setDate(weekStart.getDate() + (weekOffset * 7))
  
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  // Fetch shifts for the week
  const { data: shifts } = await supabase
    .from('shifts')
    .select('*, shift_signups(user_id, profiles(name, email))')
    .gte('start_time', weekStart.toISOString())
    .lte('start_time', weekEnd.toISOString())
    .order('start_time', { ascending: true })

  // Fetch all registered volunteers for assign dropdowns
  const { data: volunteers } = await supabase
    .from('profiles')
    .select('id, name, email')
    .order('name', { ascending: true })

  // Build the 5 school days
  const schoolDays = []
  for (let i = 0; i < 5; i++) {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + i)
    schoolDays.push(date)
  }

  // Format time for display (e.g. 08:30 -> 8:30 AM)
  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(':')
    const d = new Date()
    d.setHours(parseInt(h, 10), parseInt(m, 10))
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--sapphire-blue)' }}>Weekly Schedule</h2>
          <p className="text-muted">Claim daily 45-min blocks and manage volunteer assignments.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href={`?week=${weekOffset - 1}`} className="btn btn-secondary">&larr; Prev Week</Link>
          <span style={{ fontWeight: 'bold' }}>
            {weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(weekStart.getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
          <Link href={`?week=${weekOffset + 1}`} className="btn btn-secondary">Next Week &rarr;</Link>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {schoolDays.map(date => {
          const year = date.getFullYear()
          const month = (date.getMonth() + 1).toString().padStart(2, '0')
          const dayStr = date.getDate().toString().padStart(2, '0')
          const dateStr = `${year}-${month}-${dayStr}`
          
          return (
            <div key={dateStr} style={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <h3 style={{ borderBottom: '2px solid var(--teal)', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary-purple)' }}>
                {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {STANDARD_BLOCKS.map(block => {
                  // Find if claimed
                  const claimedShift = shifts?.find(s => {
                    const sDate = new Date(s.start_time)
                    const sYear = sDate.getFullYear()
                    const sMonth = (sDate.getMonth() + 1).toString().padStart(2, '0')
                    const sDayStr = sDate.getDate().toString().padStart(2, '0')
                    const sDateStr = `${sYear}-${sMonth}-${sDayStr}`
                    
                    return sDateStr === dateStr && 
                           `${sDate.getHours().toString().padStart(2, '0')}:${sDate.getMinutes().toString().padStart(2, '0')}` === block.start
                  })

                  const signups = claimedShift?.shift_signups || []
                  const canAddMore = claimedShift && signups.length < claimedShift.max_volunteers

                  return (
                    <div key={block.start} style={{ 
                      padding: '1.2rem', 
                      border: '1px solid',
                      borderColor: claimedShift ? 'rgba(102, 46, 128, 0.2)' : '#e2e8f0',
                      backgroundColor: claimedShift ? 'rgba(102, 46, 128, 0.02)' : '#f8fafc',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#475569' }}>
                          {formatTime(block.start)} - {formatTime(block.end)}
                        </span>
                        {claimedShift && (
                          <span style={{ fontSize: '0.75rem', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '10px' }}>
                            {signups.length}/{claimedShift.max_volunteers} volunteers
                          </span>
                        )}
                      </div>
                      
                      {claimedShift ? (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--primary-purple)', fontSize: '1rem' }}>
                              {claimedShift.title}
                            </span>
                            <form action={deleteShift}>
                              <input type="hidden" name="id" value={claimedShift.id} />
                              <button type="submit" style={{ background: 'none', border: 'none', color: '#ef4444', textDecoration: 'underline', fontSize: '0.75rem', cursor: 'pointer' }}>Cancel Block</button>
                            </form>
                          </div>

                          {/* List Assigned Volunteers */}
                          <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '600' }}>Assigned Volunteers / Leads:</div>
                            {signups.length === 0 ? (
                              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>No volunteers signed up yet.</div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {signups.map(s => (
                                  <div key={s.user_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '3px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                                    <span>👤 {s.profiles?.name || s.profiles?.email || 'Volunteer'}</span>
                                    <form action={removeVolunteerFromShift}>
                                      <input type="hidden" name="shift_id" value={claimedShift.id} />
                                      <input type="hidden" name="volunteer_id" value={s.user_id} />
                                      <button type="submit" title="Remove" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', padding: '0 4px' }}>×</button>
                                    </form>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Assign Volunteer Form */}
                          {canAddMore && volunteers && volunteers.length > 0 && (
                            <form action={assignVolunteerToShift} style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              <input type="hidden" name="shift_id" value={claimedShift.id} />
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <select name="volunteer_id" required style={{ flex: 1, padding: '0.35rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.75rem', backgroundColor: '#fff' }}>
                                  <option value="">+ Assign Volunteer...</option>
                                  {volunteers.map(v => (
                                    <option key={v.id} value={v.id}>{v.name} ({v.email})</option>
                                  ))}
                                </select>
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}>Add</button>
                              </div>
                              <label style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                                <input type="checkbox" name="is_recurring" value="true" />
                                🔁 Apply to all upcoming weeks (Recurring Lead)
                              </label>
                            </form>
                          )}
                        </div>
                      ) : (
                        <form action={createShift} style={{ display: 'flex', gap: '0.5rem' }}>
                          <input type="hidden" name="type" value="class" />
                          <input type="hidden" name="start_time" value={new Date(year, date.getMonth(), date.getDate(), parseInt(block.start.split(':')[0]), parseInt(block.start.split(':')[1])).toISOString()} />
                          <input type="hidden" name="end_time" value={new Date(year, date.getMonth(), date.getDate(), parseInt(block.end.split(':')[0]), parseInt(block.end.split(':')[1])).toISOString()} />
                          <input type="hidden" name="max_volunteers" value="2" />
                          <input type="text" name="title" placeholder="Teacher / Class Name" required style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.875rem' }} />
                          <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem', fontSize: '0.875rem' }}>Claim</button>
                        </form>
                      )}
                    </div>
                  )
                })}
              </div>
              
              {/* Custom Events on this day */}
              {(() => {
                const customEvents = shifts?.filter(s => {
                  const sDate = new Date(s.start_time)
                  const sYear = sDate.getFullYear()
                  const sMonth = (sDate.getMonth() + 1).toString().padStart(2, '0')
                  const sDayStr = sDate.getDate().toString().padStart(2, '0')
                  const sDateStr = `${sYear}-${sMonth}-${sDayStr}`
                  
                  if (sDateStr !== dateStr) return false
                  const sTime = `${sDate.getHours().toString().padStart(2, '0')}:${sDate.getMinutes().toString().padStart(2, '0')}`
                  return !STANDARD_BLOCKS.some(b => b.start === sTime)
                })

                if (!customEvents || customEvents.length === 0) return null

                return (
                  <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(59, 181, 181, 0.05)', borderRadius: '6px' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--teal)' }}>Special Events & Work Days</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {customEvents.map(evt => (
                        <div key={evt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', backgroundColor: '#fff', padding: '0.5rem', borderRadius: '4px' }}>
                          <div>
                            <strong>{new Date(evt.start_time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</strong> - {evt.title} ({evt.shift_signups?.length || 0}/{evt.max_volunteers})
                          </div>
                          <form action={deleteShift}>
                            <input type="hidden" name="id" value={evt.id} />
                            <button type="submit" style={{ background: 'none', border: 'none', color: 'red', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                          </form>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>
          )
        })}
      </div>

      {/* Bulk Generator with Recurring Lead Assignment */}
      <div style={{ marginTop: '4rem', padding: '1.5rem', backgroundColor: '#f8f6fc', borderRadius: '8px', border: '1px solid rgba(102, 46, 128, 0.1)' }}>
        <h3 className="mb-2">Bulk Schedule Recurring Classes</h3>
        <p className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>Use this to automatically populate the schedule for the entire semester (e.g. every Tuesday at 9:15 AM until June 15th) and optionally assign a recurring class lead.</p>
        
        <form action={bulkCreateShifts} className="flex flex-col gap-4">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="flex flex-col gap-2">
              <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Shift Title</label>
              <input type="text" name="title" placeholder="e.g. Mrs. Smith 3rd Grade" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
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
              <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Start Date</label>
              <input type="date" name="start_date" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div className="flex flex-col gap-2">
              <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>End Date (Until)</label>
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
            <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Assign Recurring Volunteer / Class Lead (Optional)</label>
            <select name="recurring_volunteer_id" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
              <option value="">-- No Lead Assigned (Open for Volunteers to Sign Up) --</option>
              {volunteers?.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.email})</option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>If selected, this volunteer will automatically be signed up for all occurrences of this class.</span>
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

      {/* One-Off Event Form */}
      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f6fc', borderRadius: '8px', border: '1px solid rgba(102, 46, 128, 0.1)' }}>
        <h3 className="mb-4">Schedule a One-Off Custom Event</h3>
        <form action={createShift} className="flex flex-col gap-4">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="flex flex-col gap-2">
              <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Event Title</label>
              <input type="text" name="title" placeholder="e.g. Weekend Weeding Party" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div className="flex flex-col gap-2">
              <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Event Type</label>
              <select name="type" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
                <option value="event">Special Event</option>
                <option value="work_day">Work Day</option>
                <option value="class">Class</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="flex flex-col gap-2">
              <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Start Date & Time</label>
              <input type="datetime-local" name="start_time" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div className="flex flex-col gap-2">
              <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>End Date & Time</label>
              <input type="datetime-local" name="end_time" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div className="flex flex-col gap-2">
              <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Max Volunteers</label>
              <input type="number" name="max_volunteers" defaultValue="5" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Description / Notes (Optional)</label>
            <textarea name="description" rows="2" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Create Event</button>
        </form>
      </div>

    </div>
  )
}
