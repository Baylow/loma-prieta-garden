import { createClient } from '@/utils/supabase/server';
import TeacherRequestForm from './TeacherRequestForm';
import Link from 'next/link';

export default async function TeacherRequestPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let currentUserProfile = null;
  if (user) {
    const { data: prof } = await supabase.from('profiles').select('name, email').eq('id', user.id).single();
    currentUserProfile = prof;
  }

  return (
    <div className="container mt-8 animate-fade-in-down mb-12">
      <div className="text-center mb-8">
        <Link href="/schedule" style={{ fontSize: '0.875rem', color: 'var(--sapphire-blue)', textDecoration: 'underline' }}>
          &larr; Back to Public Schedule
        </Link>
        <h1 className="mt-2 mb-2">🧑‍🏫 Request a Class Garden Session</h1>
        <p className="text-muted" style={{ maxWidth: '650px', margin: '0 auto' }}>
          Teachers & room parents: Schedule a 45-minute hands-on garden lesson or custom project for your classroom.
        </p>
      </div>

      <TeacherRequestForm currentUserProfile={currentUserProfile} />
    </div>
  );
}
