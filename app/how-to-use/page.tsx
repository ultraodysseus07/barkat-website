import { PourDemo, Safety } from "@/components/Experiences";
import { pageMeta } from "@/lib/metadata";
export const metadata = pageMeta(
  "How to pour",
  "Choose, pour, place and light. An interactive introduction to pearl wax.",
  "/how-to-use/",
);
export default function Page() {
  return (
    <section className="wrap section">
      <div className="page-intro">
        <p className="eyebrow">FOUR SMALL STEPS. YOUR OWN LITTLE RITUAL.</p>
        <h1>
          Let’s make
          <br />
          <em>a little glow.</em>
        </h1>
        <p>
          Try the illustration below, then follow your pack’s instructions when
          preparing a real candle.
        </p>
      </div>
      <PourDemo />
      <Safety />
      <section className="faq" id="faq">
        <h2>
          A little more <em>clarity.</em>
        </h2>
        {[
          [
            "Can I use any bowl?",
            "No. Use only a stable, heat-safe vessel explicitly suitable for candle use. Decorative vessels in this preview are not yet confirmed candle-safe.",
          ],
          [
            "How much wax and wick should I use?",
            "Follow the exact instructions on the product pack. This interactive illustration is not to scale and is not a fill or spacing guide.",
          ],
          [
            "Can I leave my candle burning?",
            "Keep candles attended, ventilated and away from drafts, flammable materials, children and pets. Extinguish before leaving.",
          ],
          [
            "Can I order here?",
            "This is a storefront preview. You can explore and create a preview bag; checkout and payments are not available.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </section>
  );
}
