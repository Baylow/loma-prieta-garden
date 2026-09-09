const fs = require('fs');
const path = require('path');

const startDate = new Date(2026, 8, 1); // Sept 1, 2026
const endDate = new Date(2027, 5, 15);  // June 15, 2027

const shifts = [];

function pad(n) { return n < 10 ? '0' + n : n; }

function getWeekOfMonth(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return Math.ceil((date.getDate() + (firstDay === 0 ? 6 : firstDay - 1)) / 7);
}

// Check which Nth occurrence of a weekday in that month (1st Tuesday, 3rd Friday, etc.)
function getNthWeekdayOfMonth(date) {
  const day = date.getDate();
  return Math.floor((day - 1) / 7) + 1;
}

let cur = new Date(startDate);
let zookToggle = true;

while (cur <= endDate) {
  const year = cur.getFullYear();
  const month = cur.getMonth();
  const monthName = cur.toLocaleString('default', { month: 'short' });
  const dayOfMonth = cur.getDate();
  const dayOfWeek = cur.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const nthWeekday = getNthWeekdayOfMonth(cur);
  const dateStr = `${year}-${pad(month + 1)}-${pad(dayOfMonth)}`;

  // 1. MONDAY
  if (dayOfWeek === 1) {
    // Ignoffo: 1st and 3rd Monday, 2:15 - 2:45 PM (14:15 - 14:45)
    if (nthWeekday === 1 || nthWeekday === 3) {
      shifts.push({
        title: 'Ignoffo Class Garden',
        description: 'Bi-weekly class garden block. Class Lead: Rebecca Witmer',
        type: 'class',
        start_time: `${dateStr}T14:15:00`,
        end_time: `${dateStr}T14:45:00`,
        max_volunteers: 2
      });
    }
  }

  // 2. TUESDAY
  if (dayOfWeek === 2) {
    // Richter: 1st Tuesday of the month, 12:15 - 1:15 PM (12:15 - 13:15)
    if (nthWeekday === 1) {
      shifts.push({
        title: 'Richter Class Garden',
        description: 'Monthly garden class (1st Tuesday). Class Lead: Stephanie Rovegno',
        type: 'class',
        start_time: `${dateStr}T12:15:00`,
        end_time: `${dateStr}T13:15:00`,
        max_volunteers: 2
      });
    }
  }

  // 3. THURSDAY
  if (dayOfWeek === 4) {
    // Hoefer: 1st & 3rd Thursday, 8:50 - 9:20 AM (08:50 - 09:20)
    if (nthWeekday === 1 || nthWeekday === 3) {
      shifts.push({
        title: 'Hoefer Class Garden',
        description: 'Bi-weekly garden class. Class Leads: Amy Wakim and Karly Fogg',
        type: 'class',
        start_time: `${dateStr}T08:50:00`,
        end_time: `${dateStr}T09:20:00`,
        max_volunteers: 2
      });
    }

    // Ray / Perry: Weekly Thursday, 12:15 - 12:45 PM
    shifts.push({
      title: 'Ray/Perry Class Garden',
      description: 'Weekly garden class. Class Lead: Adelia',
      type: 'class',
      start_time: `${dateStr}T12:15:00`,
      end_time: `${dateStr}T12:45:00`,
      max_volunteers: 2
    });

    // Templeton / Cole: 2nd & 4th Thursday, 12:15 - 1:15 PM (12:15 - 13:15)
    if (nthWeekday === 2 || nthWeekday === 4) {
      shifts.push({
        title: 'Templeton/Cole Class Garden',
        description: 'Bi-weekly garden class (2x/month). Class Lead: Joanna Rauh',
        type: 'class',
        start_time: `${dateStr}T12:15:00`,
        end_time: `${dateStr}T13:15:00`,
        max_volunteers: 2
      });
    }
  }

  // 4. FRIDAY
  if (dayOfWeek === 5) {
    // Zook: EOW (Every other week) Friday 9:00 - 10:00 AM
    if (zookToggle) {
      shifts.push({
        title: 'Zook Class Garden',
        description: 'Every other week garden class. Volunteers welcome!',
        type: 'class',
        start_time: `${dateStr}T09:00:00`,
        end_time: `${dateStr}T10:00:00`,
        max_volunteers: 2
      });
    }
    zookToggle = !zookToggle;

    // DePiazza: Every 3rd Friday of the month, 10:30 - 11:30 AM
    if (nthWeekday === 3) {
      shifts.push({
        title: 'DePiazza Class Garden',
        description: 'Monthly garden class (3rd Friday). Open for volunteer leads!',
        type: 'class',
        start_time: `${dateStr}T10:30:00`,
        end_time: `${dateStr}T11:30:00`,
        max_volunteers: 2
      });
    }

    // Zanotto (both 5th grade classes):
    // Weekly in Fall (Sept - Dec), 1st Friday of the month in Winter/Spring (Jan - June)
    const isFall = (month >= 8 && month <= 11);
    if (isFall || nthWeekday === 1) {
      shifts.push({
        title: 'Zanotto 5th Grade Classes',
        description: '5th grade garden session (both classes). Open for volunteer leads!',
        type: 'class',
        start_time: `${dateStr}T12:00:00`,
        end_time: `${dateStr}T13:50:00`,
        max_volunteers: 3
      });
    }

    // Ponkey: 1st & 3rd Friday, 2:00 - 2:45 PM (14:00 - 14:45)
    if (nthWeekday === 1 || nthWeekday === 3) {
      shifts.push({
        title: 'Ponkey Class Garden',
        description: 'Bi-weekly garden class (1st & 3rd Friday). Class Lead: Rebecca Witmer',
        type: 'class',
        start_time: `${dateStr}T14:00:00`,
        end_time: `${dateStr}T14:45:00`,
        max_volunteers: 2
      });
    }

    // LaMacchia: 2nd & 4th Friday, 2:00 - 2:40 PM (14:00 - 14:40)
    if (nthWeekday === 2 || nthWeekday === 4) {
      shifts.push({
        title: 'LaMacchia Class Garden',
        description: 'Bi-weekly garden class (2nd & 4th Friday). Helper: Grandma volunteer (need class lead)',
        type: 'class',
        start_time: `${dateStr}T14:00:00`,
        end_time: `${dateStr}T14:40:00`,
        max_volunteers: 2
      });
    }
  }

  // Next day
  cur.setDate(cur.getDate() + 1);
}

// Generate SQL
let sql = `-- Full School Year Schedule (Sept 2026 - June 2027) generated from Google Sheet\n`;
sql += `-- Clear existing generated class shifts if desired, or insert:\n\n`;
sql += `INSERT INTO shifts (title, description, type, start_time, end_time, max_volunteers)\nVALUES\n`;

const values = shifts.map(s => {
  const title = s.title.replace(/'/g, "''");
  const desc = s.description.replace(/'/g, "''");
  return `  ('${title}', '${desc}', '${s.type}', '${s.start_time}', '${s.end_time}', ${s.max_volunteers})`;
}).join(',\n');

sql += values + ';\n';

fs.writeFileSync(path.join(__dirname, '..', 'seed_school_year_schedule.sql'), sql);
console.log(`Generated ${shifts.length} shift entries in seed_school_year_schedule.sql`);
