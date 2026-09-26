import { pageMeta } from "@/lib/metadata";
export const metadata = pageMeta(
  "Contact",
  "Have an idea? Request a custom Barkat shade, vessel, hamper or bulk gift.",
  "/contact/",
);
export default function Page() {
  return (
    <section className="wrap contact-title">
      <p className="eyebrow">SAY HELLO TO SOMETHING PERSONAL</p>
      <h1>
        A home.
        <br />A gift. <em>Your idea.</em>
      </h1>
    </section>
  );
}
