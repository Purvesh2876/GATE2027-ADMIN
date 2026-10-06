/* The white card every sign-in style page sits in: a title, one line saying
   what to do, the form, and small links underneath. */
export default function AuthCard({ title, lead, children, footer, wide = false }) {
  return (
    <main id="main" className="auth">
      <div className={"auth-card" + (wide ? " auth-wide" : "")}>
        <h1 className="auth-title">{title}</h1>
        {lead && <p className="auth-lead">{lead}</p>}
        {children}
        {footer && <div className="auth-foot">{footer}</div>}
      </div>
    </main>
  );
}
