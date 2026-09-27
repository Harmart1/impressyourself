# Connect the website calendar to Google Calendar

The website already contains the calendar UI. Until you connect it, the page intentionally shows **Preview availability** so you can see the experience without pretending the sample dates are live.

## 1. Create the calendar bridge

1. Sign into the Google account that owns the Calendar you want to use. For this site that will normally be **impressyourself17@gmail.com**.
2. Open **script.google.com** and create a **New project**.
3. Replace the contents of `Code.gs` with the supplied `Code.gs` file from this package.
4. In **Project Settings**, set the project timezone to **America/Toronto**.
5. Review the `CONFIG` block near the top of `Code.gs` and change business hours, service durations, buffer time, or the booking window if desired.
6. Run any function once from the editor so Google asks you to authorize Calendar and email access.

## 2. Deploy it

1. Choose **Deploy → New deployment**.
2. Select **Web app**.
3. Set **Execute as: Me**. This is what lets the script read and book the deployer's Google Calendar.
4. For a public website, choose the access option that allows website visitors to reach the web app without signing into Google (the exact label depends on the Google account type).
5. Deploy and copy the production URL ending in `/exec`.

Google's current Apps Script documentation confirms that web apps use `doGet(e)` / `doPost(e)` and can execute as the script owner. The supplied script uses `CalendarApp` and never sends calendar event titles or private descriptions to the public page.

## 3. Put the URL into the website

Open `index.html` and find this tag near the top:

```html
<meta name="impressyourself-calendar-endpoint" content="">
```

Paste the `/exec` URL inside `content`, for example:

```html
<meta name="impressyourself-calendar-endpoint" content="https://script.google.com/macros/s/XXXXX/exec">
```

Save and republish the site. The badge will automatically change from **Preview availability** to **Live Google Calendar**.

## How bookings work

- The public website asks the Apps Script only for open time slots.
- Days with no remaining slots appear subtly muted as **Booked**.
- Existing Google Calendar event names, people, locations and descriptions are never exposed.
- When a visitor selects a time, the server re-checks it inside a lock immediately before creating the event. This reduces double-booking risk.
- A 15-minute buffer is placed around appointments when checking availability.
- The new Calendar event includes the customer as a guest and sends a Google Calendar invite.
- The script also sends a branded confirmation email to the customer and a booking notice to `impressyourself17@gmail.com`.

## Important production note

A publicly callable booking endpoint can attract automated spam. The supplied implementation includes strict service/date validation, a honeypot, and server-side re-checking. For heavier public traffic, adding a challenge such as Cloudflare Turnstile in front of the POST is a sensible additional safeguard.
