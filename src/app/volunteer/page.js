"use client";
import { useState } from 'react';
import styles from './page.module.css';

export default function Volunteer() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const days = Array.from({ length: 30 }, (_, i) => i + 1); // Mock month
  
  const handleDateClick = (day) => {
    setSelectedDate(day);
    setSelectedShift(null); // Reset shift when day changes
    setStatus({ loading: false, success: false, error: '' });
  };

  const handleSignUpClick = (shiftName, shiftTime) => {
    setSelectedShift({ name: shiftName, time: shiftTime });
    setStatus({ loading: false, success: false, error: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    
    try {
      const response = await fetch('/api/volunteer/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          date: `2026-08-${String(selectedDate).padStart(2, '0')}`, // Mocking current year/month
          shiftName: selectedShift.name,
          shiftTime: selectedShift.time,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to sign up. Please try again.');
      }
      
      setStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', email: '' }); // Clear form
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
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
            <div className="glass-panel" style={{ padding: '1.5rem', height: '100%', overflowY: 'auto' }}>
              <h3>Shifts for the {selectedDate}th</h3>
              
              {!selectedShift ? (
                <ul className={styles.shiftList}>
                  <li>
                    <div className="flex-col">
                      <strong>Morning Watering</strong>
                      <span className="text-muted" style={{ fontSize: '0.875rem' }}>8:00 AM - 9:00 AM</span>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => handleSignUpClick('Morning Watering', '8:00 AM - 9:00 AM')}>Sign Up</button>
                  </li>
                  <li>
                    <div className="flex-col">
                      <strong>Weeding & Maintenance</strong>
                      <span className="text-muted" style={{ fontSize: '0.875rem' }}>3:00 PM - 4:30 PM</span>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => handleSignUpClick('Weeding & Maintenance', '3:00 PM - 4:30 PM')}>Sign Up</button>
                  </li>
                </ul>
              ) : (
                <div className={styles.signupForm}>
                  <button className="btn" style={{ marginBottom: '1rem', padding: '0.25rem 0.5rem' }} onClick={() => setSelectedShift(null)}>
                    &larr; Back to shifts
                  </button>
                  <h4>Sign up for {selectedShift.name}</h4>
                  <p className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>{selectedShift.time}</p>
                  
                  {status.success ? (
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 181, 181, 0.2)', borderRadius: '4px', borderLeft: '4px solid var(--teal)' }}>
                      <strong>Success!</strong> You're signed up. A confirmation email has been sent.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="name" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Full Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          name="name" 
                          required 
                          value={formData.name} 
                          onChange={handleInputChange}
                          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }} 
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          required 
                          value={formData.email} 
                          onChange={handleInputChange}
                          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }} 
                        />
                      </div>
                      
                      {status.error && <div style={{ color: 'red', fontSize: '0.875rem' }}>{status.error}</div>}
                      
                      <button type="submit" className="btn btn-primary" disabled={status.loading} style={{ marginTop: '0.5rem' }}>
                        {status.loading ? 'Signing up...' : 'Confirm Sign Up'}
                      </button>
                    </form>
                  )}
                </div>
              )}
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
