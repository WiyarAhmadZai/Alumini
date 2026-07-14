// Centralized, timezone-correct date/time formatting for the whole app.
//
// Backend timestamps (created_at, applied_at, posted_at, …) are UTC ISO strings
// like "2026-06-26T14:24:17.000000Z". `new Date()` parses them and converts to
// the viewer's LOCAL time, so the time shown is correct for the user.
//
// Use `formatDateTime` for "created at"-style timestamps (date + time) and
// `formatDate` when only the calendar date is meaningful (e.g. an event day).

const parse = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

// e.g. "Jun 26, 2026, 2:24 PM" — date + local time. This is the standard format
// for created_at / timestamps across the system.
export const formatDateTime = (value, locale) => {
  const d = parse(value);
  if (!d) return '';
  return d.toLocaleString(locale, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
};

// e.g. "Jun 26, 2026" — date only.
export const formatDate = (value, locale) => {
  const d = parse(value);
  if (!d) return '';
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
};
