import { createClient } from '@/utils/supabase/server'
import { createShift, deleteShift } from '../actions'
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

  const { data: shifts } = await supabase
    .from('shifts')
    .select('*, shift_signups(count)')
    .gte('start_time', weekStart.toISOString())
    .lte('start_time', weekEnd.toISOString())
    .order('start_time', { ascending: true })

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

  // Format to local date time correctly
  const toLocalISOString = (date) => {
    const tzoffset = date.getTimezoneOffset() * 60000;
    return (new Date(date.getTime() - tzoffset)).toISOString().slice(0, -1);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--sapphire-blue)' }}>Weekly Schedule</h2>
          <p className="text-muted">Claim daily 45-min blocks on behalf of teachers.</p>
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
          // Format as YYYY-MM-DD in local time
          const year = date.getFullYear()
          const month = (date.getMonth() + 1).toString().padStart(2, '0')
          const dayStr = date.getDate().toString().padStart(2, '0')
          const dateStr = `${year}-${month}-${dayStr}`
          
          return (
            <div key={dateStr} style={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <h3 style={{ borderBottom: '2px solid var(--teal)', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary-purple)' }}>
                {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
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

                  return (
                    <div key={block.start} style={{ 
                      padding: '1rem', 
                      border: '1px solid',
                      borderColor: claimedShift ? 'rgba(102, 46, 128, 0.2)' : '#e2e8f0',
                      backgroundColor: claimedShift ? 'rgba(102, 46, 128, 0.02)' : '#f8fafc',
                      borderRadius: '6px'
                    }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#475569' }}>
                        {formatTime(block.start)} - {formatTime(block.end)}
                      </div>
                      
                      {claimedShift ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', color: 'var(--primary-purple)' }}>{claimedShift.title}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{claimedShift.shift_signups[0]?.count || 0} / {claimedShift.max_volunteers} volunteers</div>
                          </div>
                          <form action={deleteShift}>
                            <input type="hidden" name="id" value={claimedShift.id} />
                            <button type="submit" style={{ background: 'none', border: 'none', color: 'red', textDecoration: 'underline', fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
                          </form>
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
                        <div key={evt.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                          <div>
                            <strong>{new Date(evt.start_time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</strong> - {evt.title} ({evt.shift_signups[0]?.count || 0}/{evt.max_volunteers})
                          </div>
                          <form action={deleteShift}>
                            <input type="hidden" name="id" value={evt.id} />
                            <button type="submit" style={{ background: 'none', border: 'none', color: 'red', textDecoration: 'underline', cursor: 'pointer' }}>Cancel</button>
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

      <div style={{ marginTop: '4rem', padding: '1.5rem', backgroundColor: '#f8f6fc', borderRadius: '8px', border: '1px solid rgba(102, 46, 128, 0.1)' }}>
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
