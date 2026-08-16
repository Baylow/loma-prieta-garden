import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/login/actions'

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Strictly verify Admin role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  if (!profile || profile.role !== 'admin') {
    redirect('/profile') // Redirect non-admins back to their profile
  }

  return (
    <div className="container mt-8 mb-12 animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <h1>Admin Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/profile" className="btn btn-secondary">My Profile</Link>
          <form action={logout}>
            <button className="btn">Log Out</button>
          </form>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <Link href="/admin" style={{ display: 'block', padding: '0.75rem', borderRadius: '4px', backgroundColor: 'rgba(102, 46, 128, 0.05)', fontWeight: '500' }}>
                Dashboard Home
              </Link>
            </li>
            <li>
              <Link href="/admin/volunteers" style={{ display: 'block', padding: '0.75rem', borderRadius: '4px', fontWeight: '500' }}>
                Volunteer Directory
              </Link>
            </li>
            <li>
              <Link href="/admin/content" style={{ display: 'block', padding: '0.75rem', borderRadius: '4px', fontWeight: '500' }}>
                Site Content (CMS)
              </Link>
            </li>
            <li>
              <Link href="/admin/growing" style={{ display: 'block', padding: '0.75rem', borderRadius: '4px', fontWeight: '500' }}>
                Manage Garden Beds
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
