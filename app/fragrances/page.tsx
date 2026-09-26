import { Catalog } from "@/components/Catalog";
import { Finder } from "@/components/FragranceTools";
import { pageMeta } from "@/lib/metadata";
export const metadata = pageMeta(
  "Fragrances",
  "Six familiar places. Six different moods. Find your Barkat fragrance.",
  "/fragrances/",
);
export default function Page() {
  return (
    <section className="wrap section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE SCENT OF SOMETHING GOOD</p>
          <h1>
            What’s your <em>mood?</em>
          </h1>
          <p>Six fragrances. A little place to call your own.</p>
        </div>
        <Finder />
      </div>
      <Catalog kind="scent" />
    </section>
  );
}
