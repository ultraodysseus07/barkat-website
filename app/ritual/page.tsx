import { Ritual, Safety } from "@/components/Experiences";
import { pageMeta } from "@/lib/metadata";
export const metadata = pageMeta(
  "The ritual",
  "Five little moments for a slower, more thoughtful home.",
  "/ritual/",
);
export default function Page() {
  return (
    <section className="wrap section">
      <div className="page-intro">
        <p className="eyebrow">THE RITUAL OF ABUNDANCE</p>
        <h1>
          Make time for
          <br />
          <em>the small things.</em>
        </h1>
        <p>
          Five little invitations to be right here. Move through them at your
          own pace.
        </p>
      </div>
      <Ritual />
      <Safety />
    </section>
  );
}
