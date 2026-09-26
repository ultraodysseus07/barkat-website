import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/lib/catalog";
import { Price, ProductCard } from "@/components/Products";
import { Gallery, ProductPurchase } from "@/components/FragranceTools";
import { pageMeta } from "@/lib/metadata";
export const dynamicParams = false;
export function generateStaticParams() {
  return products.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = products.find((p) => p.slug === slug);
  return p
    ? pageMeta(p.name, p.story || p.name, "/fragrances/" + slug + "/")
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = products.find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <>
      <div className="wrap breadcrumbs">
        <Link href="/fragrances/">Fragrances</Link>
        <span>/</span>
        <span>{p.name}</span>
      </div>
      <section className="wrap detail-grid">
        <Gallery />
        <div className="detail-copy">
          <p className="eyebrow">
            {p.family} / {p.mood}
          </p>
          <h1>{p.name}</h1>
          <p className="detail-notes">{p.notes?.join(" · ")}</p>
          <p>{p.story}</p>
          <Price product={p} />
          <ProductPurchase product={p} />
          <details>
            <summary>A little care</summary>
            <p>
              Follow your pack instructions. Use a confirmed candle-safe vessel,
              keep flames attended and let wax cool fully before touching.
            </p>
          </details>
          <Link className="text-link" href="/how-to-use/">
            Learn the pour ↗
          </Link>
        </div>
      </section>
      <section className="wrap section">
        <h2>
          Another kind of <em>mood.</em>
        </h2>
        <div className="product-grid related">
          {products
            .filter((x) => x.type === "scent" && x.id !== p.id)
            .slice(0, 3)
            .map((x) => (
              <ProductCard key={x.id} product={x} />
            ))}
        </div>
      </section>
    </>
  );
}
