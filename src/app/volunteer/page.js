"use client";
import { useState } from 'react';
import styles from './page.module.css';

export default function Volunteer() {
  const [selectedDate, setSelectedDate] = useState(null);

  const days = Array.from({ length: 30 }, (_, i) => i + 1); // Mock month
  
  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  return (
    <div className="container mt-8 animate-fade-in-down">
      <h1 className="text-center mb-4">Volunteer Schedule</h1>
      <p className="text-center mb-8 text-muted">Select a date to view available volunteer shifts in the garden.</p>
      
      <div className={styles.calendarContainer}>
        <div className={styles.calendar}>
          <div className={styles.weekdays}>
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>
          <div className={styles.days}>
            {/* Adding some empty slots for formatting */}
            <span></span><span></span>
            {days.map(day => (
              <button 
                key={day} 
                className={`${styles.day} ${selectedDate === day ? styles.selected : ''}`}
                onClick={() => handleDateClick(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.sidebar}>
          {selectedDate ? (
            <div className="glass-panel" style={{ padding: '1.5rem', height: '100%' }}>
              <h3>Shifts for the {selectedDate}th</h3>
              <ul className={styles.shiftList}>
                <li>
                  <div className="flex-col">
                    <strong>Morning Watering</strong>
                    <span className="text-muted" style={{ fontSize: '0.875rem' }}>8:00 AM - 9:00 AM</span>
                  </div>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => alert('Signed up!')}>Sign Up</button>
                </li>
                <li>
                  <div className="flex-col">
                    <strong>Weeding & Maintenance</strong>
                    <span className="text-muted" style={{ fontSize: '0.875rem' }}>3:00 PM - 4:30 PM</span>
                  </div>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => alert('Signed up!')}>Sign Up</button>
                </li>
              </ul>
            </div>
          ) : (
            <div className={`glass-panel flex items-center justify-center ${styles.emptyState}`}>
              <p className="text-muted">Please select a date on the calendar to see available shifts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
