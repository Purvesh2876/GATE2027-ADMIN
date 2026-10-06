/* ==========================================================================
   GATE 2027 panel — fixed settings shown on screen.
   Event details match the public website (GATE2027-FRONTEND/app/lib/
   gate-config.js). The booking phases below are for display only: the prices
   and phase dates that actually count come from the API once the stall and
   rate work (build step 3) is in.
   ========================================================================== */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export const event = {
  short: "GATE 2027",
  name: "GCCI Annual Trade Expo 2027",
  organiser: "Gujarat Chamber of Commerce & Industry",
  dateLabel: "22 – 24 April 2027",
  venue: "Helipad Exhibition Centre",
  city: "Gandhinagar, Gujarat",
  phone: "+91 99747 44229",
  email: "inquiry@gccigate.com",
};

/* Booking phases (India time). `endsOn` is the last day of the phase. */
export const phases = [
  { no: 1, from: "2026-09-01", endsOn: "2026-10-31", endsLabel: "31 October 2026" },
  { no: 2, from: "2026-11-01", endsOn: "2027-02-28", endsLabel: "28 February 2027" },
  { no: 3, from: "2027-03-01", endsOn: "2027-03-31", endsLabel: "31 March 2027" },
  { no: 4, from: "2027-04-01", endsOn: "2027-04-15", endsLabel: "15 April 2027" },
];

/* The phase running today in India, or null before the first / after the last. */
export function currentPhase(now = new Date()) {
  const india = new Date(now.getTime() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return phases.find((p) => india >= p.from && india <= p.endsOn) || null;
}

/* The four steps every exhibitor goes through. */
export const bookingSteps = [
  { title: "Create your account", text: "Verify your email and mobile number." },
  { title: "Complete your company profile", text: "Tell GCCI about your company and products." },
  { title: "Request a stall", text: "Pick a stall. We hold it for you for up to 3 days." },
  { title: "GCCI confirms", text: "GCCI approves your request and records your payment." },
];

/* How long the browser lets a person sit idle before signing them out. The
   server enforces the same limits; this only lets the screen warn first. */
export const idleMinutes = { exhibitor: 30, staff: 15 };
