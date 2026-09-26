import Image from "next/image";
import Link from "./IntentLink";
import { BagButton, MobileMenu } from "./Shop";
import { nav } from "@/lib/navigation";
import contact from "@/data/contact.json";
export function Header() {
  return (
    <>
      <div className="announcement">
        THE RITUAL OF ABUNDANCE <span>·</span> MAKE ROOM FOR ABUNDANCE.
      </div>
      <header className="header">
        <div className="wrap header-inner">
          <Link href="/" className="logo" aria-label="Barkat home">
            <Image
              src="/assets/logo.webp"
              alt="Barkat"
              width={332}
              height={227}
              priority
            />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map(([name, url]) => (
              <Link key={name} href={url}>
                {name}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <BagButton />
            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <p className="eyebrow">BARKAT / HOME DECOR & GIFTING</p>
            <h2>
              Make room for
              <br />
              <em>something good.</em>
            </h2>
            <p>
              The ritual of abundance. Objects, gifts and little everyday
              rituals for a home that feels like you.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <strong>Explore</strong>
            {[...nav.slice(1), ["Fragrances", "/fragrances/"]].map(([n, u]) => (
              <Link href={u} key={n}>
                {n}
              </Link>
            ))}
            <BagButton />
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Barkat</span>
          <span>
            {contact.verified ? (
              <a href={"mailto:" + contact.email}>{contact.email}</a>
            ) : (
              "Contact details coming soon"
            )}
          </span>
          <span>Preview bag · No checkout or payments</span>
        </div>
      </div>
    </footer>
  );
}
