import Image from "next/image";
import Link from "./IntentLink";
import { discount, money, productUrl, type Product } from "@/lib/catalog";
import { AddButton } from "./Shop";
export function Price({ product: p }: { product: Product }) {
  const off = discount(p);
  return (
    <div className="pricing">
      <strong>{money(p.price)}</strong>
      {off > 0 && (
        <>
          <del>{money(p.mrp!)}</del>
          <span className="discount">{off}% off</span>
        </>
      )}
      {p.samplePricing && <small>Sample pricing</small>}
    </div>
  );
}
export function ProductImage({
  product: p,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  if (p.image)
    return (
      <Image
        src={p.image}
        alt={p.name}
        width={800}
        height={800}
        sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw"
        priority={priority}
      />
    );
  if (p.type === "vessel")
    return (
      <div className="photo-pending">
        <span>○</span>
        <small>
          {p.finish}
          <br />
          Photography coming soon
        </small>
      </div>
    );
  return (
    <Image
      src="/assets/pearl-wax.webp"
      alt="Barkat pearl-wax pouch and purple vessels"
      width={800}
      height={1000}
      sizes="(max-width: 600px) 90vw, 30vw"
      priority={priority}
    />
  );
}
export function ProductCard({
  product: p,
  children,
}: {
  product: Product;
  children?: React.ReactNode;
}) {
  return (
    <article className="product-card" id={p.id}>
      <Link
        className="card-photo"
        href={productUrl(p)}
        style={{ background: p.bg || "#eee4d6" }}
      >
        <ProductImage product={p} />
        <span className="photo-label">
          {p.type === "scent"
            ? p.family
            : p.type === "wax"
              ? "Sample shade"
              : p.type === "vessel"
                ? "Vessel"
                : "Gift hamper"}
        </span>
      </Link>
      <div className="card-body">
        <p className="eyebrow">
          {p.mood || p.material || "Little everyday luxuries"}
        </p>
        <h3>
          <Link href={productUrl(p)}>{p.name}</Link>
        </h3>
        <p className="descriptor">{p.line || p.desc || p.notes?.join(" · ")}</p>
        <Price product={p} />
        <AddButton product={p} />
        {children}
      </div>
    </article>
  );
}
