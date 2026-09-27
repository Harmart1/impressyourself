/**
 * impressyourself — Google Calendar booking bridge
 * Deploy this project as a Web App while signed into the Google account whose
 * PRIMARY calendar should control website availability.
 *
 * Recommended project timezone: America/Toronto
 */
const CONFIG = {
  CALENDAR_ID: 'primary',
  TIMEZONE: 'America/Toronto',
  OWNER_EMAIL: 'impressyourself17@gmail.com',
  DAYS_AHEAD: 93,
  BUFFER_MINUTES: 15,
  MIN_LEAD_HOURS: 12,
  SERVICES: {
    discovery: { label: 'Free 20-minute systems discovery call', minutes: 20 },
    physical:  { label: 'Workplace & physical organization · 2-hour session', minutes: 120 },
    digital:   { label: 'Digital information systems · 90-minute session', minutes: 90 },
    life:      { label: 'Administrative systems & coordination · 60-minute session', minutes: 60 },
    process:   { label: 'Process & workflow optimization · 60-minute session', minutes: 60 },
    rightsize: { label: 'Personal organizing / right-sizing · 60-minute session', minutes: 60 }
  },
  // 0=Sunday ... 6=Saturday. Empty array means closed.
  HOURS: {
    0: [],
    1: [{ start: '09:00', end: '17:00' }],
    2: [{ start: '09:00', end: '17:00' }],
    3: [{ start: '09:00', end: '17:00' }],
    4: [{ start: '09:00', end: '17:00' }],
    5: [{ start: '09:00', end: '17:00' }],
    6: [{ start: '10:00', end: '14:00' }]
  },
  SLOT_STEP_MINUTES: 30
};

function doGet(e) {
  try {
    const action = String((e.parameter && e.parameter.action) || 'availability');
    if (action !== 'availability') return jsonp_(e, { ok: false, error: 'Unsupported action.' });
    const month = String(e.parameter.month || '');
    const serviceKey = String(e.parameter.service || '');
    const service = CONFIG.SERVICES[serviceKey];
    if (!/^\\d{4}-\\d{2}$/.test(month) || !service) return jsonp_(e, { ok: false, error: 'Invalid request.' });
    return jsonp_(e, { ok: true, month: month, service: serviceKey, days: getMonthAvailability_(month, serviceKey) });
  } catch (err) {
    return jsonp_(e, { ok: false, error: 'Availability is temporarily unavailable.' });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const p = (e && e.parameter) || {};
    if (String(p.website || '').trim()) return postResult_(false, 'Unable to complete booking.'); // honeypot
    const serviceKey = String(p.service || '');
    const service = CONFIG.SERVICES[serviceKey];
    const name = clean_(p.name, 100);
    const email = clean_(p.email, 180);
    const meeting = clean_(p.meeting, 120);
    const notes = clean_(p.notes, 1200);
    const slotStartRaw = String(p.slotStart || '');
    if (!service || !name || !validEmail_(email) || !meeting || !slotStartRaw) return postResult_(false, 'Please complete the booking details.');

    const start = new Date(slotStartRaw);
    if (isNaN(start.getTime())) return postResult_(false, 'Invalid appointment time.');
    const earliest = new Date(Date.now() + CONFIG.MIN_LEAD_HOURS * 3600000);
    const latest = new Date(Date.now() + CONFIG.DAYS_AHEAD * 86400000);
    if (start < earliest || start > latest) return postResult_(false, 'That appointment is outside the bookable window.');

    lock.waitLock(10000);
    const validSlots = getSlotsForDay_(start, serviceKey);
    const matched = validSlots.some(s => s.start.getTime() === start.getTime());
    if (!matched) return postResult_(false, 'That time is no longer available. Please choose another.');

    const end = new Date(start.getTime() + service.minutes * 60000);
    const calendar = getCalendar_();
    // Re-check inside the lock immediately before event creation.
    if (!slotIsFree_(calendar, start, end)) return postResult_(false, 'That time was just booked. Please choose another.');

    const title = `impressyourself — ${service.label} — ${name}`;
    const description = [
      `Website booking`,
      `Client: ${name}`,
      `Email: ${email}`,
      `Meeting preference: ${meeting}`,
      `Service: ${service.label}`,
      notes ? `Notes: ${notes}` : ''
    ].filter(Boolean).join('\\n');

    const event = calendar.createEvent(title, start, end, {
      description: description,
      location: meeting,
      guests: email,
      sendInvites: true
    });

    try {
      MailApp.sendEmail({
        to: email,
        replyTo: CONFIG.OWNER_EMAIL,
        subject: `Your impressyourself booking — ${Utilities.formatDate(start, CONFIG.TIMEZONE, 'EEE, MMM d')}`,
        htmlBody: confirmationHtml_(name, service.label, start, meeting)
      });
      MailApp.sendEmail({
        to: CONFIG.OWNER_EMAIL,
        replyTo: email,
        subject: `New website booking — ${service.label}`,
        htmlBody: ownerHtml_(name, email, service.label, start, meeting, notes)
      });
    } catch (mailErr) {
      // The Calendar event is the source of truth. Email failure should not duplicate the booking.
      console.log(mailErr);
    }

    return postResult_(true, `Booked for ${Utilities.formatDate(start, CONFIG.TIMEZONE, 'EEE, MMM d \'at\' h:mm a')}. A confirmation has been sent to ${email}.`);
  } catch (err) {
    console.log(err);
    return postResult_(false, 'We could not complete that booking. Please try another time or email Kelly.');
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function getMonthAvailability_(month, serviceKey) {
  const parts = month.split('-').map(Number);
  const start = new Date(parts[0], parts[1]-1, 1, 0, 0, 0, 0);
  const end = new Date(parts[0], parts[1], 0, 23, 59, 59, 999);
  const today = new Date(); today.setHours(0,0,0,0);
  const max = new Date(); max.setDate(max.getDate() + CONFIG.DAYS_AHEAD); max.setHours(23,59,59,999);
  const out = {};
  for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
    const day = new Date(d);
    if (day < today || day > max) continue;
    const hours = CONFIG.HOURS[day.getDay()] || [];
    if (!hours.length) continue;
    const slots = getSlotsForDay_(day, serviceKey).map(slot => ({
      start: slot.start.toISOString(),
      label: Utilities.formatDate(slot.start, CONFIG.TIMEZONE, 'h:mm a')
    }));
    const fullDayCapacity = estimateCapacity_(day, serviceKey);
    out[dateKey_(day)] = {
      status: slots.length === 0 ? 'booked' : slots.length <= Math.max(2, Math.ceil(fullDayCapacity * 0.35)) ? 'limited' : 'available',
      slots: slots
    };
  }
  return out;
}

function getSlotsForDay_(dayLike, serviceKey) {
  const service = CONFIG.SERVICES[serviceKey];
  if (!service) return [];
  const day = new Date(dayLike);
  const hours = CONFIG.HOURS[day.getDay()] || [];
  if (!hours.length) return [];
  const calendar = getCalendar_();
  const earliest = new Date(Date.now() + CONFIG.MIN_LEAD_HOURS * 3600000);
  const slots = [];
  hours.forEach(window => {
    let cursor = setTime_(day, window.start);
    const close = setTime_(day, window.end);
    while (cursor.getTime() + service.minutes*60000 <= close.getTime()) {
      const end = new Date(cursor.getTime() + service.minutes*60000);
      if (cursor >= earliest && slotIsFree_(calendar, cursor, end)) slots.push({ start: new Date(cursor), end: end });
      cursor = new Date(cursor.getTime() + CONFIG.SLOT_STEP_MINUTES*60000);
    }
  });
  return slots;
}

function estimateCapacity_(day, serviceKey) {
  const service = CONFIG.SERVICES[serviceKey];
  let n = 0;
  (CONFIG.HOURS[day.getDay()] || []).forEach(window => {
    const a = setTime_(day, window.start), b = setTime_(day, window.end);
    n += Math.max(0, Math.floor(((b-a)/60000 - service.minutes) / CONFIG.SLOT_STEP_MINUTES) + 1);
  });
  return n;
}

function slotIsFree_(calendar, start, end) {
  const bufferedStart = new Date(start.getTime() - CONFIG.BUFFER_MINUTES*60000);
  const bufferedEnd = new Date(end.getTime() + CONFIG.BUFFER_MINUTES*60000);
  return calendar.getEvents(bufferedStart, bufferedEnd).length === 0;
}

function getCalendar_() {
  if (CONFIG.CALENDAR_ID === 'primary') return CalendarApp.getDefaultCalendar();
  const cal = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
  if (!cal) throw new Error('Calendar not found.');
  return cal;
}

function setTime_(day, hhmm) {
  const parts = hhmm.split(':').map(Number);
  const d = new Date(day); d.setHours(parts[0], parts[1], 0, 0); return d;
}
function dateKey_(d) { return Utilities.formatDate(d, CONFIG.TIMEZONE, 'yyyy-MM-dd'); }
function clean_(value, max) { return String(value || '').replace(/[<>]/g,'').trim().slice(0,max); }
function validEmail_(v) { return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v); }
function jsonp_(e, payload) {
  const cb = String((e.parameter && e.parameter.callback) || '').replace(/[^A-Za-z0-9_$]/g,'');
  if (!cb) return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
  return ContentService.createTextOutput(`${cb}(${JSON.stringify(payload)});`).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
function postResult_(ok, message) {
  const payload = JSON.stringify({ source: 'impressyourself-calendar', ok: ok, message: ok ? message : undefined, error: ok ? undefined : message }).replace(/</g,'\\u003c');
  return HtmlService.createHtmlOutput(`<script>window.parent.postMessage(${payload}, '*');<\\/script>`).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function confirmationHtml_(name, service, start, meeting) {
  const when = Utilities.formatDate(start, CONFIG.TIMEZONE, "EEEE, MMMM d 'at' h:mm a");
  return `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#292522"><h2 style="color:#b21f4a">You’re booked.</h2><p>Hi ${escapeHtml_(name)},</p><p>Your <strong>${escapeHtml_(service)}</strong> with impressyourself is booked for <strong>${when}</strong>.</p><p>Meeting preference: ${escapeHtml_(meeting)}</p><p>If anything changes, reply to this email.</p><p>— Kelly<br>impressyourself</p></div>`;
}
function ownerHtml_(name,email,service,start,meeting,notes) {
  const when = Utilities.formatDate(start, CONFIG.TIMEZONE, "EEEE, MMMM d 'at' h:mm a");
  return `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>New website booking</h2><p><strong>${escapeHtml_(service)}</strong><br>${when}</p><p>${escapeHtml_(name)} · <a href="mailto:${escapeHtml_(email)}">${escapeHtml_(email)}</a><br>${escapeHtml_(meeting)}</p>${notes?`<p>${escapeHtml_(notes)}</p>`:''}</div>`;
}
function escapeHtml_(s) { return String(s||'').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
