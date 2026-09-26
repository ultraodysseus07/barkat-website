import Link from "next/link";
export default function NotFound() {
  return (
    <section className="wrap section">
      <p className="eyebrow">A LITTLE DETOUR</p>
      <h1>
        This corner
        <br />
        is still <em>empty.</em>
      </h1>
      <p>Let’s find you something lovely.</p>
      <Link className="btn" href="/">
        Back to Barkat ↗
      </Link>
    </section>
  );
}
