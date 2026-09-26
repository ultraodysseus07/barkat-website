"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { products, type Product } from "@/lib/catalog";
import { ProductCard, Price, ProductImage } from "./Products";
import { Dialog, AddButton } from "./Shop";
const chipTypes = [
  ["All", "all"],
  ["Pearl wax shades", "wax"],
  ["Vessels", "vessel"],
  ["Scents", "scent"],
];
export function CatalogSlider() {
  const [type, setType] = useState("all"),
    [position, setPosition] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const featured = ["wax-ivory", "vase-1", "marigold", "vase-4"];
  const ordered = [...products].sort(
    (a, b) =>
      (featured.indexOf(a.id) < 0 ? 99 : featured.indexOf(a.id)) -
      (featured.indexOf(b.id) < 0 ? 99 : featured.indexOf(b.id)),
  );
  const list = ordered.filter(
    (p) => p.type !== "hamper" && (type === "all" || p.type === type),
  );
  const syncScroll = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const stride =
      (el.firstElementChild?.getBoundingClientRect().width || 300) +
      (parseFloat(getComputedStyle(el).columnGap) || 0);
    setPosition(
      Math.min(
        list.length - 1,
        Math.max(0, Math.round(el.scrollLeft / stride)),
      ),
    );
    setCanPrevious(el.scrollLeft > 3);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 3);
  }, [list.length]);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    syncScroll();
    const observer = new ResizeObserver(syncScroll);
    observer.observe(el);
    return () => observer.disconnect();
  }, [syncScroll]);
  const move = (direction: number) => {
    const el = track.current;
    if (el)
      el.scrollBy({
        left:
          direction *
          ((el.firstElementChild?.getBoundingClientRect().width || 300) +
            (parseFloat(getComputedStyle(el).columnGap) || 0)),
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  };
  return (
    <section className="section wrap" id="catalogue">
      <div className="section-heading">
        <div>
          <p className="eyebrow">A HOME, A LITTLE MORE YOU</p>
          <h2>
            Good things,
            <br />
            <em>within reach.</em>
          </h2>
        </div>
      </div>
      <div className="chips" aria-label="Catalog categories">
        {chipTypes.map(([label, id]) => (
          <button
            key={id}
            aria-pressed={type === id}
            onClick={() => {
              setType(id);
              setPosition(0);
              track.current?.scrollTo({ left: 0 });
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="small catalog-note">
        Preview collection · sample shades and discounts are illustrative.
      </p>
      <div className="slider-shell">
        <button
          className="icon-btn slider-arrow previous"
          aria-label="Previous products"
          aria-controls="catalogue-track"
          disabled={!canPrevious}
          onClick={() => move(-1)}
        >
          ←
        </button>
        <button
          className="icon-btn slider-arrow next"
          aria-label="Next products"
          aria-controls="catalogue-track"
          disabled={!canNext}
          onClick={() => move(1)}
        >
          →
        </button>
        <div
          className="slider"
          id="catalogue-track"
          ref={track}
          role="region"
          aria-label="Shop the catalogue"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              move(e.key === "ArrowRight" ? 1 : -1);
            }
          }}
          onScroll={syncScroll}
        >
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        Showing product {position + 1} of {list.length}
      </p>
    </section>
  );
}
export function Catalog({ kind }: { kind: "scent" | "vessel" }) {
  const all = products
      .filter((p) => p.type === kind)
      .sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image))),
    families = [
      "All",
      ...new Set(all.map((p) => p.family || p.material || "Decor")),
    ];
  const [family, setFamily] = useState("All"),
    [q, setQ] = useState(""),
    [sort, setSort] = useState("featured"),
    [hydrated, setHydrated] = useState(false),
    [quick, setQuick] = useState<Product | null>(null);
  useEffect(() => {
    const read = () => {
      const s = new URLSearchParams(location.search);
      setQ(s.get("q") || "");
      setFamily(
        families.includes(s.get("family") || "") ? s.get("family")! : "All",
      );
      setSort(
        ["featured", "name", "price-up", "price-down"].includes(
          s.get("sort") || "",
        )
          ? s.get("sort")!
          : "featured",
      );
    };
    read();
    setHydrated(true);
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []); // Initial URL is read only after hydration.
  useEffect(() => {
    if (!hydrated) return;
    const url = new URL(location.href);
    for (const [k, v] of Object.entries({
      q,
      family: family === "All" ? "" : family,
      sort: sort === "featured" ? "" : sort,
    })) {
      v ? url.searchParams.set(k, v) : url.searchParams.delete(k);
    }
    history.replaceState(null, "", url);
  }, [q, family, sort, hydrated]);
  const list = all
    .filter(
      (p) =>
        (family === "All" || (p.family || p.material) === family) &&
        [p.name, p.notes?.join(" "), p.desc]
          .join(" ")
          .toLowerCase()
          .includes(q.trim().toLowerCase()),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "price-up"
          ? a.price - b.price
          : sort === "price-down"
            ? b.price - a.price
            : 0,
    );
  return (
    <>
      <div className="catalog-toolbar">
        <label>
          Find your {kind === "scent" ? "scent" : "vessel"}
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the collection"
          />
        </label>
        <label>
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="name">Name</option>
            <option value="price-up">Price: low to high</option>
            <option value="price-down">Price: high to low</option>
          </select>
        </label>
      </div>
      <div className="chips">
        {families.map((f) => (
          <button
            key={f}
            aria-pressed={f === family}
            onClick={() => setFamily(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <p className="small result-count" role="status">
        {list.length} {kind === "scent" ? "fragrances" : "vessels"}
      </p>
      <div className="product-grid">
        {list.map((p) => (
          <ProductCard product={p} key={p.id}>
            {kind === "vessel" && (
              <button className="text-btn" onClick={() => setQuick(p)}>
                Quick view ↗
              </button>
            )}
          </ProductCard>
        ))}
      </div>
      {!list.length && (
        <div className="empty">
          <h2>No matches yet.</h2>
          <p>Try another note, name, or finish.</p>
          <button
            className="btn"
            onClick={() => {
              setFamily("All");
              setQ("");
              setSort("featured");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
      <Dialog
        open={!!quick}
        onClose={() => setQuick(null)}
        title={quick?.name || "Vessel details"}
      >
        {quick && (
          <>
            <div className="quick-photo">
              <ProductImage product={quick} />
            </div>
            <p>{quick.desc || quick.line}</p>
            <Price product={quick} />
            <p className="small">
              Decor vessel. Dimensions and candle suitability are not yet
              confirmed. Do not use with a flame without manufacturer guidance.
            </p>
            <AddButton product={quick} />
          </>
        )}
      </Dialog>
    </>
  );
}
