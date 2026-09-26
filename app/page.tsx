import Image from "next/image";
import Link from "@/components/IntentLink";
import HeroConfigurator from "@/components/HeroConfigurator";
import { CatalogSlider } from "@/components/Catalog";
import LazyExperience from "@/components/LazyExperience";
import Safety from "@/components/Safety";
import { pageMeta } from "@/lib/metadata";
export const metadata = pageMeta(
  "Home decor & little everyday rituals",
  "Make room for abundance. Thoughtful home decor, pearl wax, expressive vessels and gifts made personal.",
  "/",
);
export default function Home() {
  return (
    <>
      <section className="hero wrap">
        <div className="hero-visual">
          <div className="hero-still">
            <Image
              src="/assets/pearl-wax.avif"
              alt="Barkat pearl-wax packet with purple vessels"
              width={900}
              height={1100}
              priority
              fetchPriority="high"
              sizes="(max-width: 850px) 90vw, 50vw"
            />
            <div className="hero-vessel">
              <Image
                src="/assets/vessels/vase-4.webp"
                alt="Blush Bow ceramic decor bowl"
                width={320}
                height={320}
                priority
              />
            </div>
            <span className="hero-stamp">
              good things
              <br />
              <em>begin at home.</em>
            </span>
            <span className="scene-tag">Styled product composition</span>
          </div>
          <HeroConfigurator />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">
            HOME DECOR. THOUGHTFUL GIFTS. LITTLE RITUALS.
          </p>
          <h1>
            Small grains.
            <br />
            Big <em>mood.</em>
          </h1>
          <p className="hero-desc">
            A little pour. A softer corner.
            <br />
            Meet pearl wax, the beginning of a home
            <br className="desktop-break" /> that feels a little more like you.
          </p>
          <div className="hero-actions">
            <Link className="btn" href="#catalogue">
              Find your little luxury ↗
            </Link>
            <Link className="text-link" href="/how-to-use/">
              Show me how
            </Link>
          </div>
          <div className="tiny-notes">
            <span>Objects to love</span>
            <span>Rituals to keep</span>
            <span>Gifts to give</span>
          </div>
          <div className="hero-footnote">
            <span>01 — THE PEARL WAX EDIT</span>
            <span>Pour a little personality.</span>
          </div>
        </div>
      </section>
      <div className="brand-strip">
        <span>A little character.</span>
        <span aria-hidden="true">✳</span>
        <span>A little colour.</span>
        <span aria-hidden="true">✳</span>
        <span>A lot of you.</span>
      </div>
      <CatalogSlider />
      <section className="pour-section section" id="pour">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A CANDLE, MADE YOUR WAY</p>
              <h2>
                A little pour.
                <br />
                <em>A little pause.</em>
              </h2>
            </div>
            <Link className="text-link" href="/how-to-use/">
              The complete guide ↗
            </Link>
          </div>
          <LazyExperience kind="pour" />
          <Safety />
        </div>
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LESS RUSHING. MORE BEING HERE.</p>
            <h2>
              The everyday,
              <br />
              <em>made meaningful.</em>
            </h2>
          </div>
        </div>
        <LazyExperience kind="ritual" />
      </section>
      <section className="gift-teaser">
        <div className="wrap">
          <p className="eyebrow">GOOD THINGS, GIVEN</p>
          <h2>
            A little thought.
            <br />A lovely <em>lot of feeling.</em>
          </h2>
          <p>For new beginnings, favourite people and just-because moments.</p>
          <Link className="btn" href="/gifting/">
            Explore gift hampers ↗
          </Link>
          <span className="gift-flower" aria-hidden="true">
            ✳
          </span>
        </div>
      </section>
    </>
  );
}
