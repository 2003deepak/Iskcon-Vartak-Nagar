/**
 * Date & Timezone Utilities for Vaishnava Calendar Management
 *
 * DESIGN RATIONALE:
 * Religious calendar observances (such as Ekadashi tithis and festival dates)
 * are calendar-date bound rather than absolute UTC timestamps.
 *
 * To avoid subtle bugs where an event saved as "2026-03-03" shifts to "2026-03-02"
 * due to UTC/local browser timezone conversions (e.g. UTC vs IST +05:30),
 * we treat `dateString` in canonical "YYYY-MM-DD" format as the primary authoritative key.
 *
 * For database queries and indexing, the ISODate `date` is always constructed at UTC noon
 * or midnight from `dateString + "T00:00:00.000Z"`.
 */

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const MONTH_SHORT_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Validates whether a string matches strict YYYY-MM-DD format
 */
export function isValidDateString(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== "string") return false;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Validate days in month
  const testDate = new Date(Date.UTC(year, month - 1, day));
  return (
    testDate.getUTCFullYear() === year &&
    testDate.getUTCMonth() === month - 1 &&
    testDate.getUTCDate() === day
  );
}

/**
 * Extracts year, month (1-indexed), and day from YYYY-MM-DD without any timezone offset.
 */
export function parseDateString(dateStr: string): { year: number; month: number; day: number } | null {
  if (!isValidDateString(dateStr)) return null;
  const parts = dateStr.split("-");
  return {
    year: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10),
    day: parseInt(parts[2], 10),
  };
}

/**
 * Calculates the subsequent date string (YYYY-MM-DD) for Parana (breaking fast the next day).
 */
export function getNextDateString(dateStr: string): string {
  const parsed = parseDateString(dateStr);
  if (!parsed) return dateStr;

  const d = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
  d.setUTCDate(d.getUTCDate() + 1);

  const nextYear = d.getUTCFullYear();
  const nextMonth = String(d.getUTCMonth() + 1).padStart(2, "0");
  const nextDay = String(d.getUTCDate()).padStart(2, "0");

  return `${nextYear}-${nextMonth}-${nextDay}`;
}

/**
 * Formats a YYYY-MM-DD string into a human-readable display string (e.g. "Tuesday, 3 Mar 2026")
 */
export function formatDisplayDate(dateStr: string): string {
  const parsed = parseDateString(dateStr);
  if (!parsed) return dateStr;

  const d = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
  const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()];
  const monthName = MONTH_SHORT_NAMES[parsed.month - 1];

  return `${dayName}, ${parsed.day} ${monthName} ${parsed.year}`;
}

/**
 * Validates a time string (e.g. "06:15", "06:15 AM", "10:45 PM", "14:30")
 */
export function isValidTimeString(timeStr?: string): boolean {
  if (!timeStr || typeof timeStr !== "string") return false;
  const trimmed = timeStr.trim();
  // Matches 24h format (HH:MM or HH:MM:SS) or 12h format (HH:MM AM/PM)
  const regex24 = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
  const regex12 = /^(0?[1-9]|1[0-2]):([0-5]\d)(\s?[APap][Mm])$/;
  return regex24.test(trimmed) || regex12.test(trimmed);
}

/**
 * Generates array of calendar day objects for rendering a full monthly grid.
 */
export interface CalendarGridDay {
  dateString: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function generateMonthGrid(year: number, monthZeroIndexed: number): CalendarGridDay[] {
  const firstDayOfMonth = new Date(Date.UTC(year, monthZeroIndexed, 1));
  const daysInMonth = new Date(Date.UTC(year, monthZeroIndexed + 1, 0)).getUTCDate();
  const startingDayOfWeek = firstDayOfMonth.getUTCDay(); // 0 = Sun, 1 = Mon...

  const daysInPrevMonth = new Date(Date.UTC(year, monthZeroIndexed, 0)).getUTCDate();

  const days: CalendarGridDay[] = [];

  // Today in YYYY-MM-DD according to local browser or system
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Previous month trailing days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthDate = new Date(Date.UTC(year, monthZeroIndexed - 1, dayNum));
    const dStr = `${prevMonthDate.getUTCFullYear()}-${String(prevMonthDate.getUTCMonth() + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    days.push({
      dateString: dStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dStr === todayStr,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = `${year}-${String(monthZeroIndexed + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    days.push({
      dateString: dStr,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: dStr === todayStr,
    });
  }

  // Next month leading days (fill up to grid multiple of 7)
  const remainingCells = 42 - days.length; // 6 rows of 7
  if (remainingCells > 0 && remainingCells < 7) {
    for (let day = 1; day <= remainingCells; day++) {
      const nextMonthDate = new Date(Date.UTC(year, monthZeroIndexed + 1, day));
      const dStr = `${nextMonthDate.getUTCFullYear()}-${String(nextMonthDate.getUTCMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      days.push({
        dateString: dStr,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: dStr === todayStr,
      });
    }
  }

  return days;
}
