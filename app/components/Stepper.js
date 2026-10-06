/* "Step 2 of 4" with a bar, so a person always knows where they are and how
   much is left. `current` starts at 1. */
export default function Stepper({ steps, current }) {
  return (
    <div className="stepper">
      <p className="stepper-count">
        Step {current} of {steps.length}: <b>{steps[current - 1]}</b>
      </p>
      <ol className="stepper-bar" aria-label="Progress">
        {steps.map((label, i) => (
          <li
            key={label}
            className={i + 1 < current ? "done" : i + 1 === current ? "current" : ""}
            aria-current={i + 1 === current ? "step" : undefined}
          >
            <span className="sr-only">{label}{i + 1 < current ? " (done)" : ""}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
