'use client';

import { useState } from 'react';
import { submitScheduleRequest } from './actions';
import Link from 'next/link';

const STANDARD_TIME_OPTIONS = [
  '08:50 AM - 09:35 AM (Period 1)',
  '09:40 AM - 10:25 AM (Period 2)',
  '10:30 AM - 11:15 AM (Period 3)',
  '11:20 AM - 12:05 PM (Period 4)',
  '12:15 PM - 01:00 PM (Lunch / Garden Time)',
  '01:10 PM - 01:55 PM (Period 5)',
  '02:00 PM - 02:45 PM (Period 6)',
  'Custom Time (Specify in notes)'
];

const SUGGESTED_TOPICS = [
  '🌱 Soil, Compost & Worm Explorations (Hands-on Science)',
  '🥕 Seed Planting & Cold-Season Bed Prep',
  '🍓 Sensory Tasting & Harvesting Demonstration',
  '🐝 Pollinators, Beneficial Insects & Habitat Walk',
  '🍁 Seasonal Plant Lifecycles & Decomposition',
  '🌿 Herb Garden Scavenger Hunt & Drawing',
  '📚 Custom Curriculum Unit / Teacher-Led Science Project'
];

export default function TeacherRequestForm({ currentUserProfile }) {
  const [teacherName, setTeacherName] = useState(currentUserProfile?.name || '');
  const [teacherEmail, setTeacherEmail] = useState(currentUserProfile?.email || '');
  const [grade, setGrade] = useState('2nd Grade');
  const [studentCount, setStudentCount] = useState(20);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState(STANDARD_TIME_OPTIONS[0]);
  const [topic, setTopic] = useState(SUGGESTED_TOPICS[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [bedNumbers, setBedNumbers] = useState('Beds 1-4');
  const [notes, setNotes] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const chosenTopic = topic.includes('Custom') && customTopic ? customTopic : topic;

    const formData = new FormData();
    formData.append('teacher_name', teacherName);
    formData.append('teacher_email', teacherEmail);
    formData.append('grade', grade);
    formData.append('student_count', studentCount.toString());
    formData.append('preferred_date', preferredDate);
    formData.append('preferred_time', preferredTime);
    formData.append('topic', chosenTopic);
    formData.append('bed_numbers', bedNumbers);
    formData.append('notes', notes);

    const res = await submitScheduleRequest(formData);

    setSubmitting(false);
    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (success) {
    return (
      <div className="glass-panel p-8 text-center" style={{ maxWidth: '650px', margin: '0 auto', border: '2px solid #86efac', backgroundColor: '#f0fdf4' }}>
        <span style={{ fontSize: '3rem' }}>🎉</span>
        <h2 style={{ color: '#166534', margin: '1rem 0 0.5rem 0' }}>Garden Session Requested!</h2>
        <p style={{ color: '#15803d', fontSize: '1rem', lineHeight: '1.5' }}>
          Thank you, <strong>{teacherName}</strong>. Your request for a <strong>{grade}</strong> garden session on <strong>{preferredDate} ({preferredTime})</strong> has been received by our garden coordinators.
        </p>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '1rem' }}>
          You will receive confirmation once the session is approved and added to the volunteer schedule so parent leads can sign up to assist.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link href="/schedule" className="btn btn-primary">
            View Schedule
          </Link>
          <button onClick={() => { setSuccess(false); setPreferredDate(''); }} className="btn btn-secondary">
            Request Another Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-8" style={{ maxWidth: '750px', margin: '0 auto' }}>
      {errorMsg && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Contact Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="flex flex-col gap-1">
            <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
              Teacher / Room Parent Name *
            </label>
            <input 
              type="text" 
              required
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="e.g. Mrs. Smith or Room Parent Alex"
              style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
              Email Address *
            </label>
            <input 
              type="email" 
              required
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
              placeholder="e.g. teacher@loma.k12.ca.us"
              style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {/* Grade & Student Count */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="flex flex-col gap-1">
            <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
              Grade Level *
            </label>
            <select 
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' }}
            >
              <option value="TK">Transitional Kindergarten (TK)</option>
              <option value="Kindergarten">Kindergarten</option>
              <option value="1st Grade">1st Grade</option>
              <option value="2nd Grade">2nd Grade</option>
              <option value="3rd Grade">3rd Grade</option>
              <option value="4th Grade">4th Grade</option>
              <option value="5th Grade">5th Grade</option>
              <option value="Middle School (6th-8th)">Middle School (6th-8th)</option>
              <option value="Special Multi-Grade Project">Special Multi-Grade Project</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
              Estimated Student Count
            </label>
            <input 
              type="number" 
              min="1"
              max="60"
              value={studentCount}
              onChange={(e) => setStudentCount(parseInt(e.target.value) || 20)}
              style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {/* Date & Time Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="flex flex-col gap-1">
            <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
              Preferred Date *
            </label>
            <input 
              type="date" 
              required
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
              Preferred 45-min Time Slot *
            </label>
            <select 
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' }}
            >
              {STANDARD_TIME_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Activity Topic Selection */}
        <div className="flex flex-col gap-1">
          <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
            Garden Topic / Activity Focus *
          </label>
          <select 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' }}
          >
            {SUGGESTED_TOPICS.map(top => (
              <option key={top} value={top}>{top}</option>
            ))}
          </select>
        </div>

        {topic.includes('Custom') && (
          <div className="flex flex-col gap-1">
            <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
              Describe Your Custom Topic or Science Project *
            </label>
            <input 
              type="text" 
              required
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g. Soil pH testing with student science kits"
              style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>
        )}

        {/* Beds & Area */}
        <div className="flex flex-col gap-1">
          <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
            Garden Area or Beds Needed
          </label>
          <input 
            type="text" 
            value={bedNumbers}
            onChange={(e) => setBedNumbers(e.target.value)}
            placeholder="e.g. Beds 1-4, 3-Bin Compost Area, Pavilion only, or Any"
            style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
          />
        </div>

        {/* Notes / Volunteer Support */}
        <div className="flex flex-col gap-1">
          <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
            Special Notes & Volunteer Support Needs
          </label>
          <textarea 
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. We would love 2 parent volunteers to help supervise planting stations. Students will bring science journals."
            style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#64748b' }}>
          💡 <strong>What happens next:</strong> Your request will be reviewed by the Loma Garden coordinators. Once approved, it appears on the public schedule and allows parents to sign up as classroom helper volunteers!
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <Link href="/schedule" style={{ color: '#64748b', fontSize: '0.875rem' }}>
            &larr; Cancel and return to Schedule
          </Link>
          <button 
            type="submit" 
            disabled={submitting}
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 'bold' }}
          >
            {submitting ? 'Submitting Request...' : 'Submit Garden Session Request 🧑‍🏫'}
          </button>
        </div>

      </form>
    </div>
  );
}
