'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MonthlyCalendar({ initialShifts }) {
  // Default to September 2026 or current year
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 = September (0-indexed)
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'full-year'
  const [hideTentative, setHideTentative] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  // Available 10 school year months (September 2026 - June 2027)
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

  // Month navigation for single month view
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

  const handlePrintCurrent = () => {
    window.print();
  };

  const handlePrintFullYear = () => {
    setViewMode('full-year');
    // Allow React to render all months, then open browser print dialog
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const getPacificParts = (isoString) => {
    const d = new Date(isoString);
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
    const parts = formatter.formatToParts(d);
    return {
      year: parseInt(parts.find(p => p.type === 'year').value, 10),
      month: parseInt(parts.find(p => p.type === 'month').value, 10) - 1,
      day: parseInt(parts.find(p => p.type === 'day').value, 10)
    };
  };

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' });
  };

  const isShiftTentative = (shift) => {
    return (
      shift.title?.toLowerCase().includes('tentative') ||
      shift.description?.toLowerCase().includes('tentative') ||
      shift.status === 'tentative'
    );
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper to build a calendar table for a given year & month
  const renderMonthTable = (year, month, isFullYearView = false) => {
    const mDate = new Date(year, month, 1);
    const mName = mDate.toLocaleString('default', { month: 'long' });
    const firstDayIndex = mDate.getDay(); // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Filter shifts for this month in California timezone (and apply hideTentative if active)
    const mShifts = (initialShifts || []).filter(shift => {
      if (hideTentative && isShiftTentative(shift)) {
        return false;
      }
      const p = getPacificParts(shift.start_time);
      return p.year === year && p.month === month;
    });

    // Group shifts by California day
    const shiftsByDay = {};
    mShifts.forEach(shift => {
      const p = getPacificParts(shift.start_time);
      if (!shiftsByDay[p.day]) shiftsByDay[p.day] = [];
      shiftsByDay[p.day].push(shift);
    });

    Object.keys(shiftsByDay).forEach(day => {
      shiftsByDay[day].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    });

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

    // 3. Next month leading days
    const remainingCells = (7 - (allCells.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      allCells.push({
        dayNumber: i,
        isCurrentMonth: false,
        shifts: []
      });
    }

    // Chunk into weeks
    const weeks = [];
    for (let i = 0; i < allCells.length; i += 7) {
      weeks.push(allCells.slice(i, i + 7));
    }

    return (
      <div key={`${year}-${month}`} className="glass-panel month-page-wrapper" style={{ padding: '1.75rem', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', backgroundColor: '#fff', marginBottom: isFullYearView ? '2.5rem' : '0' }}>
        
        {/* Month Header */}
        <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid var(--teal)', paddingBottom: '0.6rem' }}>
          {!isFullYearView ? (
            <button onClick={prevMonth} className="btn btn-secondary no-print" style={{ padding: '0.35rem 0.8rem', fontSize: '0.85rem' }}>
              ← Prev Month
            </button>
          ) : <div />}

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'var(--primary-purple)', margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>
              {mName} {year}
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--teal)', fontWeight: '600' }}>
              Loma Prieta School Garden Schedule
            </span>
          </div>

          {!isFullYearView ? (
            <button onClick={nextMonth} className="btn btn-secondary no-print" style={{ padding: '0.35rem 0.8rem', fontSize: '0.85rem' }}>
              Next Month →
            </button>
          ) : <div />}
        </div>

        {/* 100% Fixed Table Layout */}
        <table className="calendar-table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              {weekDays.map((day, dIdx) => (
                <th
                  key={day}
                  style={{
                    width: '14.2857%',
                    padding: '0.5rem 0.25rem',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
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
                    month === today.getMonth() && 
                    year === today.getFullYear();

                  return (
                    <td
                      key={cIdx}
                      style={{
                        width: '14.2857%',
                        height: isFullYearView ? '95px' : '110px',
                        verticalAlign: 'top',
                        padding: '0.3rem',
                        backgroundColor: !cell.isCurrentMonth ? '#f8fafc' : isToday ? 'rgba(59, 181, 181, 0.04)' : '#fff',
                        borderRight: cIdx < 6 ? '1px solid #e2e8f0' : 'none',
                        borderBottom: wIdx < weeks.length - 1 ? '1px solid #e2e8f0' : 'none'
                      }}
                    >
                      {/* Day Header Inside Cell */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: cell.isCurrentMonth ? 'bold' : 'normal',
                            width: isToday ? '20px' : 'auto',
                            height: isToday ? '20px' : 'auto',
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
                          const isTentative = isShiftTentative(shift);

                          return (
                            <div
                              key={shift.id}
                              className="shift-badge"
                              onClick={() => setSelectedShift(shift)}
                              style={{
                                fontSize: '0.7rem',
                                padding: '2px 4px',
                                borderRadius: '4px',
                                backgroundColor: isTentative ? 'rgba(234, 88, 12, 0.08)' : isClass ? 'rgba(102, 46, 128, 0.08)' : 'rgba(0, 75, 141, 0.08)',
                                borderLeft: `3px solid ${isTentative ? '#ea580c' : isClass ? 'var(--primary-purple)' : 'var(--sapphire-blue)'}`,
                                color: '#1e293b',
                                cursor: 'pointer',
                                lineHeight: '1.2',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              title={`${formatTime(shift.start_time)} - ${shift.title}`}
                            >
                              <span style={{ fontWeight: 'bold', color: isTentative ? '#ea580c' : isClass ? 'var(--primary-purple)' : 'var(--sapphire-blue)' }}>
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
    );
  };

  const formattedMonthParam = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
  const exportUrl = viewMode === 'single'
    ? `/api/calendar/export?month=${formattedMonthParam}${hideTentative ? '&hideTentative=true' : ''}`
    : `/api/calendar/export${hideTentative ? '?hideTentative=true' : ''}`;

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
            font-size: 8.5pt !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .container {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .month-page-wrapper {
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            padding: 0 !important;
            margin: 0 0 1.5rem 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
          }
          .month-page-wrapper:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .calendar-header {
            margin-bottom: 0.35rem !important;
            padding-bottom: 0.2rem !important;
          }
          .calendar-table {
            border: 1.5px solid #000 !important;
            width: 100% !important;
          }
          .calendar-table th {
            background: #f1f5f9 !important;
            color: #000 !important;
            border: 1px solid #000 !important;
            padding: 3px !important;
            font-size: 8pt !important;
          }
          .calendar-table td {
            height: 75px !important;
            border: 1px solid #999 !important;
            page-break-inside: avoid !important;
            padding: 2px !important;
          }
          .shift-badge {
            font-size: 6.5pt !important;
            padding: 1px 2px !important;
            margin-bottom: 1px !important;
            border: 1px solid #bbb !important;
            background: #f8fafc !important;
            color: #000 !important;
          }
        }
      `}</style>

      {/* Top Controls Bar (Hidden in Print) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        
        {/* Navigation & Mode Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/schedule" className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            ← List View
          </Link>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <button
            onClick={() => setViewMode('single')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'single' ? 'var(--primary-purple)' : 'transparent',
              color: viewMode === 'single' ? '#fff' : '#475569',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Single Month
          </button>
          <button
            onClick={() => setViewMode('full-year')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'full-year' ? 'var(--primary-purple)' : 'transparent',
              color: viewMode === 'full-year' ? '#fff' : '#475569',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Full Year (All 10 Months)
          </button>
          <span style={{ color: '#cbd5e1' }}>|</span>
          
          {/* HIDE TENTATIVE TOGGLE BUTTON */}
          <button
            onClick={() => setHideTentative(!hideTentative)}
            title="Toggle tentative class spots (Ponkey, Richter, DePiazza) in calendar and export"
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: hideTentative ? '1px solid #e11d48' : '1px solid #cbd5e1',
              backgroundColor: hideTentative ? '#fff1f2' : '#fff',
              color: hideTentative ? '#e11d48' : '#475569',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            {hideTentative ? '👁️ Show Tentative' : '🚫 Hide Tentative'}
          </button>
        </div>

        {/* Print & Export Actions */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {viewMode === 'single' && (
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
          )}

          {viewMode === 'single' ? (
            <button onClick={handlePrintCurrent} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
              🖨️ Print Month
            </button>
          ) : null}

          {/* PRINT FULL YEAR PDF BUTTON */}
          <button onClick={handlePrintFullYear} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: '600' }}>
            📄 Print Full Year PDF (Sept–June)
          </button>
          
          <a href={exportUrl} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} title={hideTentative ? "Export confirmed schedule to iCal (.ics)" : "Export full schedule to iCal (.ics)"}>
            📅 {hideTentative ? 'Export Confirmed .ics' : 'Export .ics'}
          </a>
        </div>
      </div>

      {hideTentative && (
        <div className="no-print" style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', color: '#9f1239', padding: '0.5rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            🔒 <strong>Tentative spots hidden:</strong> Currently displaying and exporting <strong>confirmed classes only</strong>.
          </span>
          <button onClick={() => setHideTentative(false)} style={{ background: 'none', border: 'none', color: '#be123c', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
            Show Tentative
          </button>
        </div>
      )}

      {/* RENDER CALENDAR CONTENT */}
      {viewMode === 'single' ? (
        renderMonthTable(currentYear, currentMonth, false)
      ) : (
        <div>
          <div className="no-print" style={{ backgroundColor: 'rgba(59, 181, 181, 0.1)', padding: '0.75rem 1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--teal)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: '#0f766e', fontWeight: '500' }}>
              Showing all 10 months of the school year (September 2026 – June 2027). Click <strong>"Print Full Year PDF"</strong> to generate a clean 10-page printable PDF {hideTentative ? '(confirmed classes only)' : ''}.
            </span>
            <button onClick={handlePrintFullYear} className="btn btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
              🖨️ Open Print / PDF Dialog
            </button>
          </div>

          {schoolYearMonths.map(item => (
            renderMonthTable(item.year, item.month, true)
          ))}
        </div>
      )}

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
                <strong>Date:</strong> {new Date(selectedShift.start_time).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
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
