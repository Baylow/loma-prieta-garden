'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MonthlyCalendar({ initialShifts }) {
  // Default to current month or September 2026
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed (0=Jan, 8=Sept)
  const [selectedShift, setSelectedShift] = useState(null);

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Month metadata
  const monthDate = new Date(currentYear, currentMonth, 1);
  const monthName = monthDate.toLocaleString('default', { month: 'long' });
  const formattedMonthParam = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;

  // Calculate calendar grid days (Sunday to Saturday)
  const firstDayIndex = monthDate.getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  // Filter shifts for this month
  const monthShifts = (initialShifts || []).filter(shift => {
    const d = new Date(shift.start_time);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  // Group shifts by day of month
  const shiftsByDay = {};
  monthShifts.forEach(shift => {
    const day = new Date(shift.start_time).getDate();
    if (!shiftsByDay[day]) shiftsByDay[day] = [];
    shiftsByDay[day].push(shift);
  });

  // Sort each day's shifts chronologically
  Object.keys(shiftsByDay).forEach(day => {
    shiftsByDay[day].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Build the 35 or 42 grid cells
  const calendarCells = [];

  // 1. Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      dayNumber: prevMonthDays - i,
      isCurrentMonth: false,
      shifts: []
    });
  }

  // 2. Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({
      dayNumber: d,
      isCurrentMonth: true,
      shifts: shiftsByDay[d] || []
    });
  }

  // 3. Next month leading days to complete row
  const remainingCells = (7 - (calendarCells.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      dayNumber: i,
      isCurrentMonth: false,
      shifts: []
    });
  }

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div>
      {/* Print-specific Styles */}
      <style jsx global>{`
        @media print {
          nav, header, footer, .no-print, button, .cta-bar {
            display: none !important;
          }
          body {
            background: #fff !important;
            color: #000 !important;
            font-size: 10pt !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .container {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .calendar-wrapper {
            box-shadow: none !important;
            border: 1px solid #999 !important;
            border-radius: 0 !important;
            padding: 0 !important;
          }
          .calendar-header {
            margin-bottom: 0.5rem !important;
          }
          .calendar-grid {
            border: 1px solid #000 !important;
          }
          .day-cell {
            min-height: 90px !important;
            border: 1px solid #ccc !important;
            page-break-inside: avoid !important;
          }
          .shift-badge {
            font-size: 7.5pt !important;
            padding: 1px 3px !important;
            border: 1px solid #bbb !important;
            background: #f4f4f4 !important;
            color: #000 !important;
          }
        }
      `}</style>

      {/* Top Controls Bar */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link href="/schedule" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            ← List / Sign-Up View
          </Link>
          <span style={{ color: '#94a3b8' }}>|</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--primary-purple)', fontWeight: '600' }}>
            📅 Monthly Calendar View
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            🖨️ Print / Save as PDF
          </button>
          
          <a href={`/api/calendar/export?month=${formattedMonthParam}`} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            📅 Export {monthName} (.ics)
          </a>

          <a href="/api/calendar/export" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#64748b' }} title="Sync full year schedule to Google / Apple Calendar">
            📥 Full Year (.ics)
          </a>
        </div>
      </div>

      {/* Calendar Card Container */}
      <div className="glass-panel calendar-wrapper" style={{ padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        
        {/* Month Navigation Header */}
        <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid var(--teal)', paddingBottom: '1rem' }}>
          
          <button onClick={prevMonth} className="btn btn-secondary no-print" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            ← Prev Month
          </button>

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'var(--primary-purple)', margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>
              {monthName} {currentYear}
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--teal)', fontWeight: '500' }}>
              Loma Prieta School Garden Schedule
            </span>
          </div>

          <button onClick={nextMonth} className="btn btn-secondary no-print" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            Next Month →
          </button>
        </div>

        {/* 7-Day Column Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', backgroundColor: '#f1f5f9', borderRadius: '8px 8px 0 0', fontWeight: 'bold', color: '#475569', fontSize: '0.9rem', border: '1px solid #e2e8f0' }}>
          {weekDays.map(day => (
            <div key={day} style={{ padding: '0.6rem 0.25rem', borderRight: day !== 'Sat' ? '1px solid #e2e8f0' : 'none' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', border: '1px solid #e2e8f0', borderTop: 'none', backgroundColor: '#fff', borderRadius: '0 0 8px 8px' }}>
          {calendarCells.map((cell, idx) => {
            const isToday = cell.isCurrentMonth && 
              cell.dayNumber === today.getDate() && 
              currentMonth === today.getMonth() && 
              currentYear === today.getFullYear();

            return (
              <div
                key={idx}
                className="day-cell"
                style={{
                  minHeight: '110px',
                  padding: '0.4rem',
                  borderRight: (idx + 1) % 7 !== 0 ? '1px solid #e2e8f0' : 'none',
                  borderBottom: idx < calendarCells.length - 7 ? '1px solid #e2e8f0' : 'none',
                  backgroundColor: !cell.isCurrentMonth ? '#f8fafc' : isToday ? 'rgba(59, 181, 181, 0.05)' : '#fff',
                  position: 'relative'
                }}
              >
                {/* Day Number */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: cell.isCurrentMonth ? 'bold' : 'normal',
                      color: !cell.isCurrentMonth ? '#cbd5e1' : isToday ? 'var(--teal)' : '#334155',
                      width: isToday ? '24px' : 'auto',
                      height: isToday ? '24px' : 'auto',
                      borderRadius: isToday ? '50%' : 'none',
                      backgroundColor: isToday ? 'var(--teal)' : 'transparent',
                      color: isToday ? '#fff' : !cell.isCurrentMonth ? '#cbd5e1' : '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {cell.dayNumber}
                  </span>

                  {cell.shifts.length > 0 && (
                    <span className="no-print" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {cell.shifts.length} {cell.shifts.length === 1 ? 'class' : 'classes'}
                    </span>
                  )}
                </div>

                {/* Day Shifts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {cell.shifts.map(shift => {
                    const isClass = shift.type === 'class';
                    const signupsCount = shift.shift_signups?.length || 0;
                    const isFull = signupsCount >= shift.max_volunteers;

                    return (
                      <div
                        key={shift.id}
                        className="shift-badge"
                        onClick={() => setSelectedShift(shift)}
                        style={{
                          fontSize: '0.75rem',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          backgroundColor: isClass ? 'rgba(102, 46, 128, 0.1)' : 'rgba(0, 75, 141, 0.1)',
                          borderLeft: `3px solid ${isClass ? 'var(--primary-purple)' : 'var(--sapphire-blue)'}`,
                          color: '#1e293b',
                          cursor: 'pointer',
                          lineHeight: '1.2',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={`${formatTime(shift.start_time)} - ${shift.title} (${signupsCount}/${shift.max_volunteers} volunteers)`}
                      >
                        <span style={{ fontWeight: 'bold', color: isClass ? 'var(--primary-purple)' : 'var(--sapphire-blue)' }}>
                          {formatTime(shift.start_time)}
                        </span>{' '}
                        {shift.title.replace(' Class Garden', '')}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal / Shift Details Popup when clicked */}
      {selectedShift && (
        <div
          className="no-print"
          onClick={() => setSelectedShift(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="glass-panel"
            style={{
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '12px',
              maxWidth: '450px',
              width: '100%',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--teal)', fontWeight: 'bold' }}>
                  {selectedShift.type.replace('_', ' ')}
                </span>
                <h3 style={{ color: 'var(--primary-purple)', margin: '0.25rem 0' }}>{selectedShift.title}</h3>
              </div>
              <button
                onClick={() => setSelectedShift(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#334155' }}>
              <div>
                <strong>Date:</strong> {new Date(selectedShift.start_time).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div>
                <strong>Time:</strong> {formatTime(selectedShift.start_time)} - {formatTime(selectedShift.end_time)}
              </div>
              {selectedShift.description && (
                <div style={{ marginTop: '0.5rem', color: '#64748b', fontStyle: 'italic' }}>
                  {selectedShift.description}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.85rem' }}>
                <strong>Volunteers:</strong> {selectedShift.shift_signups?.length || 0} / {selectedShift.max_volunteers}
              </div>
              <Link href="/schedule" className="btn btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
                Sign Up / Manage &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
