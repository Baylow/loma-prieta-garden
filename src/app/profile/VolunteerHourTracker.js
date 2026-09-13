'use client';

import { useState } from 'react';

export default function VolunteerHourTracker({ allShifts, profile }) {
  const [showHistory, setShowHistory] = useState(false);
  const now = new Date();

  // Compute stats
  let completedHours = 0;
  let upcomingHours = 0;
  let completedCount = 0;
  let upcomingCount = 0;

  const processedShifts = (allShifts || []).map(shift => {
    const start = new Date(shift.start_time);
    const end = new Date(shift.end_time);
    const durationHours = Math.max(0.25, (end - start) / (1000 * 60 * 60));
    const isCompleted = end <= now;

    if (isCompleted) {
      completedHours += durationHours;
      completedCount += 1;
    } else {
      upcomingHours += durationHours;
      upcomingCount += 1;
    }

    return {
      ...shift,
      startDate: start,
      endDate: end,
      durationHours,
      isCompleted
    };
  }).sort((a, b) => b.startDate - a.startDate);

  // Milestone definitions
  const DISTRICT_GOAL = 10.0;
  const progressPct = Math.min(100, Math.round((completedHours / DISTRICT_GOAL) * 100));
  const hoursRemaining = Math.max(0, DISTRICT_GOAL - completedHours);

  const badges = [
    {
      id: 'sprout',
      title: 'Sprout Scout',
      desc: 'Completed your 1st garden shift',
      icon: '🌱',
      unlocked: completedCount >= 1,
      requirement: '1 shift'
    },
    {
      id: 'regular',
      title: 'Garden Regular',
      desc: 'Logged 5+ hours in the garden',
      icon: '🌿',
      unlocked: completedHours >= 5,
      requirement: '5.0 hrs'
    },
    {
      id: 'hero',
      title: 'District Milestone Hero',
      desc: 'Certified 10+ hours school district milestone!',
      icon: '🏆',
      unlocked: completedHours >= 10,
      requirement: '10.0 hrs'
    },
    {
      id: 'master',
      title: 'Master Harvester',
      desc: '20+ hours of dedicated service',
      icon: '🌟',
      unlocked: completedHours >= 20,
      requirement: '20.0 hrs'
    }
  ];

  const handlePrintVerification = () => {
    window.print();
  };

  return (
    <div style={{ marginTop: '2.5rem', borderTop: '2px solid #f1f5f9', paddingTop: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ color: 'var(--primary-purple)', margin: 0, fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⏱️</span>
            <span>Volunteer Hour Tracker & District Milestones</span>
          </h3>
          <p className="text-muted" style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
            Track your hours towards the Loma Prieta School District 10-Hour Volunteer Milestone.
          </p>
        </div>

        <button 
          onClick={handlePrintVerification}
          className="btn btn-secondary no-print"
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <span>📄</span>
          <span>Print Hours Summary</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        
        <div style={{ backgroundColor: '#f0fdf4', padding: '1.25rem', borderRadius: '10px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534', lineHeight: 1 }}>
            {completedHours.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>hrs</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: '600', marginTop: '0.4rem' }}>
            Completed Hours ({completedCount} shifts)
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#475569', lineHeight: 1 }}>
            {upcomingHours.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>hrs</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginTop: '0.4rem' }}>
            Upcoming Scheduled ({upcomingCount} shifts)
          </div>
        </div>

        <div style={{ backgroundColor: completedHours >= 10 ? '#fef3c7' : '#faf5ff', padding: '1.25rem', borderRadius: '10px', border: completedHours >= 10 ? '1px solid #fde047' : '1px solid #e9d5ff', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: completedHours >= 10 ? '#854d0e' : 'var(--primary-purple)', lineHeight: 1 }}>
            {completedHours >= 10 ? '🎉 Certified!' : `${hoursRemaining.toFixed(1)} hrs`}
          </div>
          <div style={{ fontSize: '0.85rem', color: completedHours >= 10 ? '#a16207' : '#7e22ce', fontWeight: '600', marginTop: '0.4rem' }}>
            {completedHours >= 10 ? '10-Hr Milestone Achieved' : 'Needed to Reach 10-Hr Goal'}
          </div>
        </div>

      </div>

      {/* Loma Prieta District 10-Hour Milestone Progress Card */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          border: '2px solid rgba(102, 46, 128, 0.15)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--primary-purple)', fontSize: '1rem' }}>
            🏫 Loma Prieta District 10-Hour Volunteer Milestone Progress
          </span>
          <span style={{ fontWeight: 'bold', color: 'var(--teal)', fontSize: '1rem' }}>
            {completedHours.toFixed(1)} / {DISTRICT_GOAL.toFixed(1)} Hours ({progressPct}%)
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div style={{ width: '100%', height: '14px', backgroundColor: '#e2e8f0', borderRadius: '7px', overflow: 'hidden', position: 'relative' }}>
          <div 
            style={{
              width: `${progressPct}%`,
              height: '100%',
              background: completedHours >= 10 
                ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' 
                : 'linear-gradient(90deg, var(--teal) 0%, var(--primary-purple) 100%)',
              borderRadius: '7px',
              transition: 'width 0.6s ease-in-out'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
          <span>0 hrs (Start)</span>
          <span>5 hrs (Midpoint)</span>
          <span style={{ fontWeight: 'bold', color: completedHours >= 10 ? '#059669' : '#64748b' }}>
            10 hrs (District Certified ⭐)
          </span>
        </div>
      </div>

      {/* Badges Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ color: '#334155', fontSize: '1.05rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          🏅 Earned Badges & Milestones
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {badges.map(badge => (
            <div 
              key={badge.id}
              style={{
                padding: '1.2rem',
                borderRadius: '10px',
                border: badge.unlocked ? '2px solid #86efac' : '1px dashed #cbd5e1',
                backgroundColor: badge.unlocked ? '#f0fdf4' : '#f8fafc',
                opacity: badge.unlocked ? 1 : 0.6,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.2s'
              }}
            >
              <div 
                style={{
                  fontSize: '2rem',
                  filter: badge.unlocked ? 'none' : 'grayscale(100%)',
                  backgroundColor: badge.unlocked ? '#dcfce7' : '#e2e8f0',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  flexShrink: 0
                }}
              >
                {badge.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.95rem', color: badge.unlocked ? '#14532d' : '#475569' }}>
                    {badge.title}
                  </span>
                  {badge.unlocked && <span style={{ color: '#16a34a', fontSize: '0.8rem' }}>✓</span>}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                  {badge.desc}
                </div>
                <div style={{ fontSize: '0.7rem', color: badge.unlocked ? '#15803d' : '#94a3b8', fontWeight: 'bold', marginTop: '0.35rem' }}>
                  Req: {badge.requirement}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History Log Toggle */}
      <div className="no-print" style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => setShowHistory(!showHistory)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--sapphire-blue)',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span>{showHistory ? '▲ Hide Full Volunteer Shift History Log' : '▼ View Full Volunteer Shift History Log (' + processedShifts.length + ' Total)'}</span>
        </button>
      </div>

      {/* Shift History Table */}
      {(showHistory || typeof window === 'undefined') && (
        <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1rem', marginBottom: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #cbd5e1', color: '#475569' }}>
                <th style={{ padding: '0.6rem 0.5rem' }}>Date</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Shift / Class</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Type</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Time & Duration</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Hours Credit</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {processedShifts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>
                    No shifts logged yet.
                  </td>
                </tr>
              ) : (
                processedShifts.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: '500' }}>
                      {s.startDate.toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 'bold', color: 'var(--primary-purple)' }}>
                      {s.title}
                    </td>
                    <td style={{ padding: '0.6rem 0.5rem', textTransform: 'capitalize' }}>
                      {s.type.replace('_', ' ')}
                    </td>
                    <td style={{ padding: '0.6rem 0.5rem', color: '#64748b' }}>
                      {s.startDate.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' })} - {s.endDate.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 'bold', color: s.isCompleted ? '#166534' : '#64748b' }}>
                      {s.durationHours.toFixed(2)} hrs
                    </td>
                    <td style={{ padding: '0.6rem 0.5rem' }}>
                      <span 
                        style={{
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontWeight: '500',
                          backgroundColor: s.isCompleted ? '#dcfce7' : '#e0f2fe',
                          color: s.isCompleted ? '#15803d' : '#0369a1'
                        }}
                      >
                        {s.isCompleted ? '✓ Completed' : '⏳ Scheduled'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
