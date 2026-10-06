"use client";

import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import { roleOf } from "../../components/PanelShell";
import { currentPhase } from "../../lib/gate-config";

const ROLE_LABEL = { exhibitor: "Exhibitor", admin: "GCCI admin", superadmin: "Superadmin" };

/* What each kind of person sees first. Always one "next step" card for an
   exhibitor, so nobody has to wonder what to do. */
export default function DashboardView() {
  const { user } = useAuth();
  const role = roleOf(user);
  const phase = currentPhase();

  return (
    <>
      <div className="page-head">
        <span className="badge">{ROLE_LABEL[role]}</span>
        <h1>Welcome, {user.contactName || "there"}</h1>
        <p>{user.companyName ? `${user.companyName} · ` : ""}GATE 2027, 22–24 April 2027</p>
      </div>

      {role === "exhibitor" ? (
        <div className="cards">
          <section className="card card-next" aria-labelledby="next-step">
            <span className="label">Your next step</span>
            <h2 id="next-step">Complete your company profile</h2>
            <p>
              Your account is ready and both your email and mobile number are verified. To request a stall, GCCI needs
              a few details about your company and what you will display. The profile form opens in the next update.
            </p>
            <p>In the meantime you can see how booking works and what is on offer.</p>
            <div>
              <Link className="btn btn-fill" href="/">See how booking works</Link>
            </div>
          </section>

          <section className="card card-muted" aria-labelledby="c-stalls">
            <h2 id="c-stalls">Stalls</h2>
            <p>Browse and request a stall once your profile is complete.</p>
          </section>
          <section className="card card-muted" aria-labelledby="c-book">
            <h2 id="c-book">My bookings</h2>
            <p>Your requests, their status and your payments will appear here.</p>
          </section>
          {phase && (
            <section className="card" aria-labelledby="c-phase">
              <h2 id="c-phase">Booking rates</h2>
              <p>Phase {phase.no} rates are open until {phase.endsLabel}. Rates rise in each phase.</p>
            </section>
          )}
        </div>
      ) : (
        <div className="cards">
          <section className="card card-next" aria-labelledby="staff-next">
            <span className="label">Staff panel</span>
            <h2 id="staff-next">You are signed in</h2>
            <p>
              The areas listed in the menu (requests, stalls, payments, exhibitors and the activity log) are being built
              step by step and will switch on here as they are ready.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
