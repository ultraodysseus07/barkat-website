"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
const Pour = dynamic(() => import("./Experiences").then((m) => m.PourDemo), {
  ssr: false,
});
const Ritual = dynamic(() => import("./Experiences").then((m) => m.Ritual), {
  ssr: false,
});
export default function LazyExperience({ kind }: { kind: "pour" | "ritual" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={"lazy-experience " + kind}>
      {visible ? (
        kind === "pour" ? (
          <Pour />
        ) : (
          <Ritual compact />
        )
      ) : (
        <div className="experience-summary">
          <h3>
            {kind === "pour"
              ? "Four small steps. Your little glow."
              : "A moment that belongs to you."}
          </h3>
          <ol>
            {(kind === "pour"
              ? [
                  "Choose a stable, confirmed candle-safe vessel.",
                  "Pour according to your pack’s fill instructions.",
                  "Place the recommended wick using the pack guidance.",
                  "Light, stay nearby, then extinguish and cool fully.",
                ]
              : [
                  "Choose your corner.",
                  "Make it personal.",
                  "Pour a little pause.",
                  "Stay for the glow.",
                  "Extinguish, cool, and keep the ritual.",
                ]
            ).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
