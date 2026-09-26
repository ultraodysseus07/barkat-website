"use client";
import { useState } from "react";
import Link from "next/link";
const steps = ["Choose", "Pour", "Place", "Light"];
const instructions = [
  "Choose a stable, heat-safe candle container. A decorative bowl is not automatically safe for candles.",
  "Pour the pearls. Follow the fill-depth and spacing instructions on your pack.",
  "Place the recommended wick. Follow your pack’s depth, spacing and exposed-length guidance.",
  "Light your prepared candle and stay with it. Extinguish before leaving; let everything cool fully.",
];
export function PourDemo() {
  const [step, setStep] = useState(0);
  const change = (n: number) =>
    setStep(Math.max(0, Math.min(steps.length - 1, n)));
  const poured = step >= 1,
    wick = step >= 2,
    lit = step === 3;
  return (
    <div className="pour-demo">
      <div className="demo-scene">
        <svg
          viewBox="0 0 440 370"
          role="img"
          aria-label={`Candle vessel${poured ? ", filled with pearls" : ""}${wick ? ", wick placed" : ""}${lit ? ", illustrated flame lit" : ""}`}
        >
          <ellipse cx="220" cy="329" rx="144" ry="17" fill="#370d2c12" />
          <path
            d="M100 135 Q220 105 340 135 L323 291 Q220 345 117 291Z"
            fill="#ffffff70"
            stroke="#755665"
            strokeWidth="2"
          />
          <ellipse
            cx="220"
            cy="135"
            rx="120"
            ry="28"
            fill="#f8f4e9"
            stroke="#755665"
            strokeWidth="2"
          />
          {poured && (
            <g className="pearls">
              {Array.from({ length: 130 }, (_, i) => (
                <circle
                  key={i}
                  cx={122 + (i % 13) * 16 + (Math.floor(i / 13) % 2) * 5}
                  cy={175 + Math.floor(i / 13) * 12}
                  r={5}
                  fill={i % 3 ? "#fffaf4" : "#e9dfd6"}
                  stroke="#d1c2b7"
                />
              ))}
            </g>
          )}
          {wick && (
            <path
              d="M220 162L220 126"
              stroke="#46352d"
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}
          {lit && (
            <g className="flame">
              <path
                d="M220 83C250 114 238 133 220 133C200 133 198 112 220 83"
                fill="#d77a20"
              />
              <path
                d="M221 101Q237 128 220 129Q210 120 221 101"
                fill="#ffe9a0"
              />
            </g>
          )}
        </svg>
        <span className="scene-tag">Illustration only · not to scale</span>
        <p className="small">
          Use only vessels confirmed suitable for candles.
        </p>
      </div>
      <div
        className="demo-controls"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            change(step + (e.key === "ArrowRight" ? 1 : -1));
          }
        }}
      >
        <ol className="step-tabs" aria-label="Pour steps">
          {steps.map((name, i) => (
            <li key={name} aria-current={step === i ? "step" : undefined}>
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>{" "}
              {name}
            </li>
          ))}
        </ol>
        <div className="demo-step-copy">
          <h3>
            {
              [
                "A home for your glow.",
                "Small grains. Easy pour.",
                "Give it a centre.",
                "And a little light.",
              ][step]
            }
          </h3>
          <p>{instructions[step]}</p>
        </div>
        <div className="demo-navigation">
          <button
            className="btn outline"
            disabled={step === 0}
            onClick={() => change(step - 1)}
          >
            ← Back
          </button>
          <button
            className="btn"
            disabled={step === steps.length - 1}
            onClick={() => change(step + 1)}
          >
            Next →
          </button>
        </div>
        <p role="status" className="small">
          Step {step + 1} of {steps.length}: {steps[step]}
        </p>
      </div>
    </div>
  );
}
const ritual = [
  [
    "Choose your corner.",
    "Make a little room for yourself. Clear a stable surface and keep it away from drafts and anything flammable.",
  ],
  [
    "Make it personal.",
    "Choose a scent, a candle-safe vessel and a moment that feels like yours.",
  ],
  [
    "Pour a little pause.",
    "Prepare the pearls and wick using the instructions on your pack. Take your time.",
  ],
  [
    "Stay for the glow.",
    "Keep a burning candle in sight, in a ventilated space, away from children and pets.",
  ],
  [
    "Keep the ritual.",
    "Extinguish the candle. Let wax and vessel cool completely before handling or refreshing.",
  ],
];
export function Ritual({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState(0);
  return (
    <div className={"ritual-experience " + (compact ? "compact" : "")}>
      <div className="ritual-orbit" aria-hidden="true">
        <span className="orbit-inner">0{step + 1}</span>
        <span className="orbit-spark">✳</span>
        <small>THE RITUAL OF ABUNDANCE</small>
      </div>
      <div>
        <div
          className="ritual-dots"
          aria-label="Ritual steps"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              setStep(Math.min(4, step + 1));
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              setStep(Math.max(0, step - 1));
            }
          }}
        >
          {ritual.map(([t], i) => (
            <button
              key={t}
              aria-label={"Step " + (i + 1) + ": " + t}
              aria-current={i === step ? "step" : undefined}
              onClick={() => setStep(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="ritual-copy" aria-live="polite">
          <h3>{ritual[step][0]}</h3>
          <p>{ritual[step][1]}</p>
        </div>
        <div className="split">
          <button
            className="text-btn"
            disabled={!step}
            onClick={() => setStep(step - 1)}
          >
            ← Previous
          </button>
          <button
            className="text-btn"
            disabled={step === 4}
            onClick={() => setStep(step + 1)}
          >
            Next →
          </button>
        </div>
        {compact && (
          <Link href="/ritual/" className="text-link">
            Make time for the whole ritual ↗
          </Link>
        )}
      </div>
      <noscript>
        <ol>
          {ritual.map(([t, d]) => (
            <li key={t}>
              {t} {d}
            </li>
          ))}
        </ol>
      </noscript>
    </div>
  );
}
export function Safety() {
  return (
    <aside className="safety">
      <strong>A little care goes a long way.</strong>
      <p>
        Use a stable, heat-safe vessel confirmed suitable for candles. Follow
        the pack’s fill, wick and spacing instructions. Keep flames attended,
        ventilated and away from drafts, flammable items, children and pets.
        Extinguish and cool fully before handling. Illustrations are not
        measurements.
      </p>
    </aside>
  );
}
