const fs = require('fs');
const path = require('path');

// Helper to convert Pacific Date & Time string to exact UTC ISO String
function pacificToUTC(dateStr, timeStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, min] = timeStr.split(':').map(Number);
  const testUtc = new Date(Date.UTC(year, month - 1, day, hour, min));
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false
  });
  
  const parts = formatter.formatToParts(testUtc);
  const laHour = parseInt(parts.find(p => p.type === 'hour').value, 10) % 24;
  const laDay = parseInt(parts.find(p => p.type === 'day').value, 10);
  
  let hourDiff = hour - laHour;
  if (day !== laDay) {
    if (day > laDay) hourDiff += 24;
    else hourDiff -= 24;
  }
  
  return new Date(testUtc.getTime() + hourDiff * 3600000).toISOString();
}

function pad(n) { return n < 10 ? '0' + n : n; }

// Nth occurrence of a weekday in that month (1st Tuesday, 3rd Friday, etc.)
function getNthWeekdayOfMonth(date) {
  const day = date.getDate();
  return Math.floor((day - 1) / 7) + 1;
}

// Week 0 reference: Start of school year (Monday Aug 31, 2026)
const schoolStartMonday = new Date(2026, 7, 31); // Aug 31, 2026

function getWeekIndex(date) {
  // Get Monday of current date's week
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diffToMonday);
  
  const diffTime = d.getTime() - schoolStartMonday.getTime();
  const diffWeeks = Math.round(diffTime / (7 * 24 * 60 * 60 * 1000));
  return diffWeeks;
}

const startDate = new Date(2026, 8, 1); // Sept 1, 2026
const endDate = new Date(2027, 5, 15);  // June 15, 2027

const shifts = [];
let cur = new Date(startDate);

while (cur <= endDate) {
  const year = cur.getFullYear();
  const month = cur.getMonth();
  const dayOfMonth = cur.getDate();
  const dayOfWeek = cur.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const nthWeekday = getNthWeekdayOfMonth(cur);
  const weekIdx = getWeekIndex(cur);
  const isWeekA = (weekIdx % 2 === 0);
  const isWeekB = (weekIdx % 2 === 1);
  const dateStr = `${year}-${pad(month + 1)}-${pad(dayOfMonth)}`;

  // Skip school holidays / breaks:
  // Labor Day: Sep 7, 2026
  const isLaborDay = (month === 8 && dayOfMonth === 7);
  // Thanksgiving week: Nov 23 - Nov 27, 2026
  const isThanksgivingBreak = (month === 10 && dayOfMonth >= 23 && dayOfMonth <= 27);
  // Winter break: Dec 21, 2026 - Jan 1, 2027
  const isWinterBreak = (month === 11 && dayOfMonth >= 21) || (month === 0 && dayOfMonth === 1);
  // MLK Day: Jan 18, 2027
  const isMLK = (month === 0 && dayOfMonth === 18);
  // Presidents / Ski week: Feb 15 - Feb 19, 2027
  const isPresidentsBreak = (month === 1 && dayOfMonth >= 15 && dayOfMonth <= 19);
  // Spring break: April 5 - April 9, 2027
  const isSpringBreak = (month === 3 && dayOfMonth >= 5 && dayOfMonth <= 9);
  // Memorial Day: May 31, 2027
  const isMemorialDay = (month === 4 && dayOfMonth === 31);

  const isHoliday = isLaborDay || isThanksgivingBreak || isWinterBreak || isMLK || isPresidentsBreak || isSpringBreak || isMemorialDay;

  if (!isHoliday) {

    // 1. MONDAY
    if (dayOfWeek === 1) {
      // Ignoffo: Every Other Week (Week A), 2:00 - 2:45 PM
      if (isWeekA) {
        shifts.push({
          title: 'Ignoffo Class Garden',
          description: 'Every other week garden class. Class Lead: Rebecca Whitmer',
          type: 'class',
          start_time: pacificToUTC(dateStr, '14:00'),
          end_time: pacificToUTC(dateStr, '14:45'),
          max_volunteers: 2
        });
      }
    }

    // 2. TUESDAY
    if (dayOfWeek === 2) {
      // Richter: 1st Tuesday of the month, 12:15 - 1:15 PM [TENTATIVE]
      if (nthWeekday === 1) {
        shifts.push({
          title: 'Richter Class Garden (Tentative)',
          description: '[TENTATIVE SCHEDULE] Monthly garden class (Every 1st Tuesday of month). Class Lead: Stephanie Rovegno',
          type: 'class',
          start_time: pacificToUTC(dateStr, '12:15'),
          end_time: pacificToUTC(dateStr, '13:15'),
          max_volunteers: 2
        });
      }
    }

    // 3. THURSDAY
    if (dayOfWeek === 4) {
      // Hoefer: Every Other Week (Week A), 8:50 - 9:20 AM
      if (isWeekA) {
        shifts.push({
          title: 'Hoefer Class Garden',
          description: 'Every other week garden class. Class Leads: Amy Wakim, Karly Fogg, Erin Matteucci, Stephen Garaffo, Irene Whitney',
          type: 'class',
          start_time: pacificToUTC(dateStr, '08:50'),
          end_time: pacificToUTC(dateStr, '09:20'),
          max_volunteers: 2
        });
      }

      // Perry / Ray: Every Week Thursday, 12:00 - 12:45 PM
      shifts.push({
        title: 'Perry/Ray Class Garden',
        description: 'Weekly garden class. Class Lead: Adelia Rowland',
        type: 'class',
        start_time: pacificToUTC(dateStr, '12:00'),
        end_time: pacificToUTC(dateStr, '12:45'),
        max_volunteers: 2
      });
    }

    // 4. FRIDAY
    if (dayOfWeek === 5) {
      // Zook: Every Other Week (Week A), 9:00 - 9:40 AM
      if (isWeekA) {
        shifts.push({
          title: 'Zook Class Garden',
          description: 'Every other week garden class. Class Leads: Pam Hagedorn & Stephen Garaffo',
          type: 'class',
          start_time: pacificToUTC(dateStr, '09:00'),
          end_time: pacificToUTC(dateStr, '09:40'),
          max_volunteers: 2
        });
      }

      // DePiazza: Every 3rd Friday of the month (or every 3rd week), 10:30 - 11:30 AM [TENTATIVE]
      if (nthWeekday === 3) {
        shifts.push({
          title: 'DePiazza Class Garden (Tentative)',
          description: '[TENTATIVE SCHEDULE] Monthly garden class (Every 3rd Friday). Open for volunteer leads!',
          type: 'class',
          start_time: pacificToUTC(dateStr, '10:30'),
          end_time: pacificToUTC(dateStr, '11:30'),
          max_volunteers: 2
        });
      }

      // Templeton / Cole: Every Other Week (Week B - starting Sept 11), 1:00 - 1:40 PM
      if (isWeekB) {
        shifts.push({
          title: 'Templeton/Cole Class Garden',
          description: 'Every other week garden class (Started Sept 11). Class Leads: Joanna Rauh & Lauren Miller',
          type: 'class',
          start_time: pacificToUTC(dateStr, '13:00'),
          end_time: pacificToUTC(dateStr, '13:40'),
          max_volunteers: 2
        });
      }

      // Ponkey: Every Other Week (Week A), 2:00 - 2:45 PM [TENTATIVE]
      if (isWeekA) {
        shifts.push({
          title: 'Ponkey Class Garden (Tentative)',
          description: '[TENTATIVE SCHEDULE] Every other week garden class (Alternating with LaMacchia). Class Lead: Rebecca Whitmer',
          type: 'class',
          start_time: pacificToUTC(dateStr, '14:00'),
          end_time: pacificToUTC(dateStr, '14:45'),
          max_volunteers: 2
        });
      }

      // LaMacchia: Every Other Week (Week B), 2:00 - 2:45 PM
      if (isWeekB) {
        shifts.push({
          title: 'LaMacchia Class Garden',
          description: 'Every other week garden class (Alternating with Ponkey). Class Leads: Pam Hagedorn & Kathy Adams',
          type: 'class',
          start_time: pacificToUTC(dateStr, '14:00'),
          end_time: pacificToUTC(dateStr, '14:45'),
          max_volunteers: 2
        });
      }
    }
  }

  // Next day
  cur.setDate(cur.getDate() + 1);
}

// Generate SQL
let sql = `-- Full School Year Schedule (Sept 2026 - June 2027) with Tentative flags and Exact California Timezones\n`;
sql += `-- Scraps all recurring weekday classes (type = 'class') while preserving work days & special events:\n`;
sql += `DELETE FROM shifts WHERE type = 'class';\n\n`;
sql += `INSERT INTO shifts (title, description, type, start_time, end_time, max_volunteers)\nVALUES\n`;

const values = shifts.map(s => {
  const title = s.title.replace(/'/g, "''");
  const desc = s.description.replace(/'/g, "''");
  return `  ('${title}', '${desc}', '${s.type}', '${s.start_time}'::timestamptz, '${s.end_time}'::timestamptz, ${s.max_volunteers})`;
}).join(',\n');

sql += values + ';\n';

fs.writeFileSync(path.join(__dirname, '..', 'seed_school_year_schedule.sql'), sql);
console.log(`Generated ${shifts.length} shift entries in seed_school_year_schedule.sql.`);
