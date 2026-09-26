import { Catalog } from "@/components/Catalog";
import { pageMeta } from "@/lib/metadata";
export const metadata = pageMeta(
  "Vessels",
  "Sculptural ceramics, playful shapes and glass accents for a home with character.",
  "/vessels/",
);
export default function Page() {
  return (
    <section className="wrap section">
      <div className="page-intro">
        <p className="eyebrow">A LITTLE CHARACTER FOR YOUR CORNER</p>
        <h1>
          Objects with
          <br />
          <em>personality.</em>
        </h1>
        <p>
          Playful silhouettes. Patterns to get lost in. Find the piece that
          feels like you.
        </p>
        <p className="small">
          Studio-retouched images from our vessel references. Names and prices
          are samples. Candle-use suitability and dimensions await confirmation.
        </p>
      </div>
      <Catalog kind="vessel" />
    </section>
  );
}
