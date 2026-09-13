'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MonthlyCalendar({ initialShifts }) {
  // Default to September 2026 or current year
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 = September (0-indexed)
  const [selectedShift, setSelectedShift] = useState(null);

  // Available school year months for quick jumping
  const schoolYearMonths = [
    { year: 2026, month: 8, label: 'September 2026' },
    { year: 2026, month: 9, label: 'October 2026' },
    { year: 2026, month: 10, label: 'November 2026' },
    { year: 2026, month: 11, label: 'December 2026' },
    { year: 2027, month: 0, label: 'January 2027' },
    { year: 2027, month: 1, label: 'February 2027' },
    { year: 2027, month: 2, label: 'March 2027' },
    { year: 2027, month: 3, label: 'April 2027' },
    { year: 2027, month: 4, label: 'May 2027' },
    { year: 2027, month: 5, label: 'June 2027' },
  ];

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
  // We use date formatting matching Pacific Time to avoid any UTC-day-boundary drift
  const monthShifts = (initialShifts || []).filter(shift => {
    const d = new Date(shift.start_time);
    const sYear = d.getFullYear();
    const sMonth = d.getMonth();
    return sYear === currentYear && sMonth === currentMonth;
  });

  // Group shifts by day of month
  const shiftsByDay = {};
  monthShifts.forEach(shift => {
    const d = new Date(shift.start_time);
    const day = d.getDate();
    if (!shiftsByDay[day]) shiftsByDay[day] = [];
    shiftsByDay[day].push(shift);
  });

  // Sort each day's shifts chronologically
  Object.keys(shiftsByDay).forEach(day => {
    shiftsByDay[day].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Build calendar cells array
  const allCells = [];

  // 1. Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    allCells.push({
      dayNumber: prevMonthDays - i,
      isCurrentMonth: false,
      shifts: []
    });
  }

  // 2. Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    allCells.push({
      dayNumber: d,
      isCurrentMonth: true,
      shifts: shiftsByDay[d] || []
    });
  }

  // 3. Next month leading days to complete the final week
  const remainingCells = (7 - (allCells.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    allCells.push({
      dayNumber: i,
      isCurrentMonth: false,
      shifts: []
    });
  }

  // Chunk allCells into weeks (rows of 7 days)
  const weeks = [];
  for (let i = 0; i < allCells.length; i += 7) {
    weeks.push(allCells.slice(i, i + 7));
  }

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Print & Layout Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
            margin: 0.3in;
          }
          nav, header, footer, .no-print, button, .cta-bar {
            display: none !important;
          }
          body {
            background: #fff !important;
            color: #000 !important;
            font-size: 9pt !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .container {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .calendar-card {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            background: transparent !important;
          }
          .calendar-header {
            margin-bottom: 0.5rem !important;
            padding-bottom: 0.3rem !important;
          }
          .calendar-table {
            border: 1.5px solid #000 !important;
            width: 100% !important;
          }
          .calendar-table th {
            background: #f1f5f9 !important;
            color: #000 !important;
            border: 1px solid #000 !important;
            padding: 4px !important;
            font-size: 8.5pt !important;
          }
          .calendar-table td {
            height: 85px !important;
            border: 1px solid #999 !important;
            page-break-inside: avoid !important;
            padding: 3px !important;
          }
          .shift-badge {
            font-size: 6.8pt !important;
            padding: 1px 3px !important;
            margin-bottom: 1px !important;
            border: 1px solid #bbb !important;
            background: #f8fafc !important;
            color: #000 !important;
          }
        }
      `}</style>

      {/* Top Controls Bar (Hidden in Print) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link href="/schedule" className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            ← List / Sign-Up View
          </Link>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--primary-purple)', fontWeight: 'bold' }}>
            📅 Monthly Calendar View
          </span>
        </div>

        {/* Quick Jump Dropdown & Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={`${currentYear}-${currentMonth}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split('-').map(Number);
              setCurrentYear(y);
              setCurrentMonth(m);
            }}
            style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#fff', fontWeight: '500' }}
          >
            {schoolYearMonths.map(item => (
              <option key={`${item.year}-${item.month}`} value={`${item.year}-${item.month}`}>
                {item.label}
              </option>
            ))}
          </select>

          <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
            🖨️ Print / Save as PDF
          </button>
          
          <a href={`/api/calendar/export?month=${formattedMonthParam}`} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
            📅 Export .ics
          </a>
        </div>
      </div>

      {/* Calendar Card Container */}
      <div className="glass-panel calendar-card" style={{ padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', backgroundColor: '#fff' }}>
        
        {/* Month Navigation Header */}
        <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '2px solid var(--teal)', paddingBottom: '0.75rem' }}>
          
          <button onClick={prevMonth} className="btn btn-secondary no-print" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            ← Prev Month
          </button>

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'var(--primary-purple)', margin: 0, fontSize: '1.85rem', fontWeight: 'bold' }}>
              {monthName} {currentYear}
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--teal)', fontWeight: '600' }}>
              Loma Prieta School Garden Schedule
            </span>
          </div>

          <button onClick={nextMonth} className="btn btn-secondary no-print" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            Next Month →
          </button>
        </div>

        {/* 100% Fixed Table Layout (Zero Misalignment) */}
        <table className="calendar-table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              {weekDays.map((day, dIdx) => (
                <th
                  key={day}
                  style={{
                    width: '14.2857%',
                    padding: '0.65rem 0.25rem',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    color: '#475569',
                    borderRight: dIdx < 6 ? '1px solid #e2e8f0' : 'none',
                    borderBottom: '2px solid #cbd5e1'
                  }}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wIdx) => (
              <tr key={wIdx}>
                {week.map((cell, cIdx) => {
                  const isToday = cell.isCurrentMonth && 
                    cell.dayNumber === today.getDate() && 
                    currentMonth === today.getMonth() && 
                    currentYear === today.getFullYear();

                  return (
                    <td
                      key={cIdx}
                      style={{
                        width: '14.2857%',
                        height: '115px',
                        verticalAlign: 'top',
                        padding: '0.35rem',
                        backgroundColor: !cell.isCurrentMonth ? '#f8fafc' : isToday ? 'rgba(59, 181, 181, 0.04)' : '#fff',
                        borderRight: cIdx < 6 ? '1px solid #e2e8f0' : 'none',
                        borderBottom: wIdx < weeks.length - 1 ? '1px solid #e2e8f0' : 'none'
                      }}
                    >
                      {/* Day Header Inside Cell */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: cell.isCurrentMonth ? 'bold' : 'normal',
                            width: isToday ? '22px' : 'auto',
                            height: isToday ? '22px' : 'auto',
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
                          <span className="no-print" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                            {cell.shifts.length} {cell.shifts.length === 1 ? 'class' : 'classes'}
                          </span>
                        )}
                      </div>

                      {/* Day Shifts Badges */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {cell.shifts.map(shift => {
                          const isClass = shift.type === 'class';
                          const signupsCount = shift.shift_signups?.length || 0;

                          return (
                            <div
                              key={shift.id}
                              className="shift-badge"
                              onClick={() => setSelectedShift(shift)}
                              style={{
                                fontSize: '0.72rem',
                                padding: '2px 4px',
                                borderRadius: '4px',
                                backgroundColor: isClass ? 'rgba(102, 46, 128, 0.08)' : 'rgba(0, 75, 141, 0.08)',
                                borderLeft: `3px solid ${isClass ? 'var(--primary-purple)' : 'var(--sapphire-blue)'}`,
                                color: '#1e293b',
                                cursor: 'pointer',
                                lineHeight: '1.2',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              title={`${formatTime(shift.start_time)} - ${shift.title}`}
                            >
                              <span style={{ fontWeight: 'bold', color: isClass ? 'var(--primary-purple)' : 'var(--sapphire-blue)' }}>
                                {formatTime(shift.start_time)}
                              </span>{' '}
                              {shift.title.replace(' Class Garden', '')}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
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

            <div style={{ fontSize: '0.9rem', marginBottom: '1.25rem', color: '#334155' }}>
              <div style={{ marginBottom: '0.3rem' }}>
                <strong>Date:</strong> {new Date(selectedShift.start_time).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div style={{ marginBottom: '0.3rem' }}>
                <strong>Time:</strong> {formatTime(selectedShift.start_time)} - {formatTime(selectedShift.end_time)}
              </div>
              {selectedShift.description && (
                <div style={{ marginTop: '0.5rem', color: '#64748b', fontStyle: 'italic', backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: '4px' }}>
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
