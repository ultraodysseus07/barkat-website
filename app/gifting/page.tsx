import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/catalog";
import { Price } from "@/components/Products";
import { AddButton } from "@/components/Shop";
import { pageMeta } from "@/lib/metadata";
export const metadata = pageMeta(
  "Gift hampers",
  "Thoughtful home decor hampers for new beginnings and favourite people.",
  "/gifting/",
);
export default function Page() {
  return (
    <div className="gifting-page">
      <section className="wrap section">
        <div className="page-intro">
          <p className="eyebrow">GOOD THINGS, GIVEN</p>
          <h1>
            A little light.
            <br />A lot of <em>thought.</em>
          </h1>
          <p>For a new home. A favourite person. Or a just-because moment.</p>
        </div>
        <div className="hamper-list">
          {products
            .filter((p) => p.type === "hamper")
            .map((p, i) => (
              <article key={p.id} className="hamper-card">
                <div className="hamper-art">
                  <Image
                    src={
                      i
                        ? "/assets/vessels/vase-1.webp"
                        : "/assets/vessels/vase-4.webp"
                    }
                    alt="Illustrative vessel for the sample hamper"
                    width={600}
                    height={600}
                  />
                  <div className="hamper-pouch">
                    <Image
                      src="/assets/pearl-wax.webp"
                      alt="Barkat pearl-wax packaging"
                      width={300}
                      height={380}
                    />
                  </div>
                  <span className="scene-tag">
                    Styling placeholder · final hamper photography pending
                  </span>
                </div>
                <div className="hamper-copy">
                  <p className="eyebrow">THE GIFT EDIT / 0{i + 1}</p>
                  <h2>{p.name}</h2>
                  <p>{p.line}</p>
                  <h3>What’s in the hamper</h3>
                  <ul>
                    {p.includes?.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <Price product={p} />
                  <AddButton product={p} />
                  <p className="small">
                    Sample hamper. Final contents and pricing require
                    confirmation. Preview bag only.
                  </p>
                </div>
              </article>
            ))}
        </div>
        <div className="custom-hamper">
          <h2>
            A gift that’s
            <br />
            <em>entirely theirs.</em>
          </h2>
          <Link className="btn" href="/contact/">
            Request a custom hamper ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
