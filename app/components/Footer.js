import { event, SITE_URL } from "../lib/gate-config";

/* Small footer. The legal links (Privacy, Terms, Cancellation) are added here
   once GCCI supplies the texts; an empty link is worse than none. */
export default function Footer() {
  return (
    <footer className="ftr">
      <div className="shell ftr-in">
        <div className="ftr-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/gate-logo-white.png" alt="GATE 2027" width="120" height="42" />
          <p>
            {event.name}<br />
            {event.dateLabel} · {event.venue}, {event.city.split(",")[0]}
          </p>
        </div>
        <div className="ftr-links">
          <a href={SITE_URL}>Main website</a>
          <a href={`${SITE_URL}/exhibitor`}>Tariffs and facilities</a>
          <a href={`${SITE_URL}/contact`}>Contact</a>
        </div>
        <div className="ftr-help">
          <b>Need help?</b>
          <a href={`mailto:${event.email}`}>{event.email}</a>
          <a href={`tel:${event.phone.replace(/\s/g, "")}`}>{event.phone}</a>
        </div>
      </div>
      <div className="shell ftr-end">
        <span>© {new Date().getFullYear()} {event.organiser}</span>
      </div>
    </footer>
  );
}
