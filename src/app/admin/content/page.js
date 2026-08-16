import { createClient } from '@/utils/supabase/server'
import { updateSiteContent, createUpdate } from '../actions'

export default async function ContentAdminPage() {
  const supabase = await createClient()
  
  // Fetch site content
  const { data: siteContent } = await supabase.from('site_content').select('*')
  const homepageMission = siteContent?.find(c => c.id === 'homepage_mission')?.content || ''
  const homepageHero = siteContent?.find(c => c.id === 'homepage_hero')?.content || ''

  // Fetch recent updates
  const { data: updates } = await supabase.from('updates').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <h2 style={{ marginBottom: '1rem', color: 'var(--sapphire-blue)' }}>Site Content (CMS)</h2>
      <p className="text-muted mb-8">Edit the text that appears on the public website.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
        
        {/* HOMEPAGE CONTENT */}
        <section>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Homepage Text</h3>
          
          <form action={updateSiteContent} className="mb-4">
            <input type="hidden" name="id" value="homepage_hero" />
            <div className="flex flex-col gap-2">
              <label style={{ fontWeight: '500' }}>Hero Headline</label>
              <div className="flex gap-2">
                <input type="text" name="content" defaultValue={homepageHero} required style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </div>
          </form>

          <form action={updateSiteContent}>
            <input type="hidden" name="id" value="homepage_mission" />
            <div className="flex flex-col gap-2">
              <label style={{ fontWeight: '500' }}>Mission Statement (Intro Paragraph)</label>
              <textarea name="content" defaultValue={homepageMission} required rows="4" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }} />
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Mission</button>
            </div>
          </form>
        </section>


        {/* NEWS AND UPDATES */}
        <section>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>News & Updates</h3>
          
          <div className="mb-8" style={{ backgroundColor: '#f8f6fc', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(102, 46, 128, 0.1)' }}>
            <h4 className="mb-4">Post a New Update</h4>
            <form action={createUpdate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Title</label>
                <input type="text" name="title" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div className="flex flex-col gap-2">
                <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Author</label>
                <input type="text" name="author" defaultValue="Garden Team" required style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div className="flex flex-col gap-2">
                <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Body</label>
                <textarea name="body" required rows="4" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Publish Update</button>
            </form>
          </div>

          <h4 className="mb-4">Recent Updates</h4>
          {(!updates || updates.length === 0) ? (
            <p className="text-muted">No updates posted yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {updates.map(u => (
                <li key={u.id} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
                  <div style={{ fontWeight: '600' }}>{u.title}</div>
                  <div className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>By {u.author} on {new Date(u.created_at).toLocaleDateString()}</div>
                  <p style={{ fontSize: '0.875rem' }}>{u.body.substring(0, 100)}...</p>
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </div>
  )
}
