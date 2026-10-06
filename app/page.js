import HeroActions from "./components/HeroActions";
import { bookingSteps, currentPhase, event, SITE_URL } from "./lib/gate-config";

/* The panel's front door. It opens for everyone, with no login, because
   people want to see what is on offer before they make an account. Login is
   asked only when someone presses "Request this stall". */

const FAQ = [
  {
    q: "How do I book a stall?",
    a: "Create an account, complete your company profile, then choose a stall and send a request. GCCI reviews every request and confirms it once the first payment is recorded.",
  },
  {
    q: "Do I pay when I request a stall?",
    a: "No. Sending a request costs nothing. After GCCI approves it, you have 7 days to pay the first 25% to confirm your stall. For now, payments are made to GCCI directly, not on this website, and GCCI records them here.",
  },
  {
    q: "What does “held for 3 days” mean?",
    a: "When you request a stall, nobody else can request it while GCCI reviews your request, for up to 3 days. If it has not been approved by then, the stall is released automatically.",
  },
  {
    q: "Can I book more than one stall?",
    a: "Each booking is for one stall, and an account can have up to 2 open requests at a time. For combined or custom booths, please contact GCCI.",
  },
  {
    q: "Which rate will I pay?",
    a: "Rates depend on the booking phase, whether you are a GCCI member and whether you exhibited before. GCCI confirms which discounts apply to you when it approves your request. The full rate card is on the main website.",
  },
  {
    q: "Can I cancel a booking?",
    a: "You can ask for a cancellation from your dashboard, and GCCI will process it. The cancellation terms are in the tariff sheet.",
  },
];

export default function Home() {
  const phase = currentPhase();

  return (
    <main id="main">
      {/* ═════════ Hero ═════════ */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-in">
          <span className="hero-eyebrow">{event.name}</span>
          <h1 id="hero-title">Book your stall at GATE 2027</h1>
          <p className="hero-lede">
            Meet 50,000+ business visitors across 12 focus sectors. Browse the stalls, send a request, and GCCI
            takes it from there.
          </p>
          <div className="hero-facts">
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
              {event.dateLabel}
            </span>
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
              {event.venue}, {event.city.split(",")[0]}
            </span>
          </div>
          {phase && (
            <p className="phase-pill">
              <i aria-hidden="true" />
              Phase {phase.no} booking rates are open until {phase.endsLabel}
            </p>
          )}
          <HeroActions />
        </div>
      </section>

      {/* ═════════ How it works ═════════ */}
      <section className="sec" aria-labelledby="how-title">
        <div className="shell">
          <div className="sec-head">
            <h2 id="how-title">Booking takes four steps</h2>
            <p>You will never be asked to do anything out of order. Each screen tells you what to do next.</p>
          </div>
          <ol className="steps">
            {bookingSteps.map((s) => (
              <li className="step" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═════════ Stalls ═════════ */}
      <section className="sec sec-soft" id="stalls" aria-labelledby="stalls-title">
        <div className="shell">
          <div className="sec-head">
            <h2 id="stalls-title">Stalls</h2>
            <p>Sizes, what is included and the rate for the current phase, for every stall in both halls.</p>
          </div>
          <div className="stalls-soon">
            <h3>The stall list opens here soon</h3>
            <p>
              GCCI is publishing the floor plan and the list of stalls. They will appear in this section, and you will
              be able to look at them without logging in. In the meantime, you can already create your account and
              get it ready, so you are first in line when they open.
            </p>
            <a className="btn btn-line" href={`${SITE_URL}/exhibitor`}>See tariffs and facilities</a>
          </div>
        </div>
      </section>

      {/* ═════════ Questions ═════════ */}
      <section className="sec" aria-labelledby="faq-title">
        <div className="shell">
          <div className="sec-head">
            <h2 id="faq-title">Common questions</h2>
          </div>
          <div className="faq">
            {FAQ.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
