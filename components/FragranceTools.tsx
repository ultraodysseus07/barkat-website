"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { products, type Product } from "@/lib/catalog";
import { Dialog, AddButton } from "./Shop";
export function Finder() {
  const [open, setOpen] = useState(false),
    [mood, setMood] = useState(""),
    [family, setFamily] = useState("");
  const matches = products.filter(
    (p) => p.type === "scent" && p.family === family,
  );
  const result = matches.find((p) => p.mood === mood) || matches[0];
  return (
    <>
      <button
        className="btn outline"
        onClick={() => {
          setMood("");
          setFamily("");
          setOpen(true);
        }}
      >
        Find my fragrance ↗
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Find your mood">
        {!mood ? (
          <>
            <p className="eyebrow">1 OF 2 / YOUR MOMENT</p>
            <h3>What kind of pause?</h3>
            <div className="finder-options">
              {["Slow mornings", "A fresh start", "Evening unwind"].map((s) => (
                <button key={s} onClick={() => setMood(s)}>
                  {s} ↗
                </button>
              ))}
            </div>
          </>
        ) : !family ? (
          <>
            <p className="eyebrow">2 OF 2 / YOUR NOTES</p>
            <h3>What draws you in?</h3>
            <div className="finder-options">
              {["Warm", "Fresh", "Floral", "Woody", "Citrus"].map((s) => (
                <button key={s} onClick={() => setFamily(s)}>
                  {s} ↗
                </button>
              ))}
            </div>
            <button className="text-btn" onClick={() => setMood("")}>
              ← Change my moment
            </button>
          </>
        ) : result ? (
          <div aria-live="polite">
            <p className="eyebrow">YOUR STARTING POINT</p>
            <h3>{result.name}</h3>
            <p>{result.notes?.join(" · ")}</p>
            <p>{result.story}</p>
            <p className="small">
              Matched to {family.toLowerCase()} notes
              {result.mood === mood ? " and your preferred moment" : ""}.
            </p>
            <Link
              className="btn"
              href={"/fragrances/" + result.slug + "/"}
              onClick={() => setOpen(false)}
            >
              Explore fragrance ↗
            </Link>
            <button
              className="text-btn"
              onClick={() => {
                setMood("");
                setFamily("");
              }}
            >
              Try another mood
            </button>
          </div>
        ) : null}
      </Dialog>
    </>
  );
}
export function ProductPurchase({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="purchase">
      <div className="quantity">
        <button
          disabled={quantity === 1}
          aria-label="Decrease quantity"
          onClick={() => setQuantity(quantity - 1)}
        >
          −
        </button>
        <output aria-label="Quantity">{quantity}</output>
        <button
          disabled={quantity === 99}
          aria-label="Increase quantity"
          onClick={() => setQuantity(quantity + 1)}
        >
          +
        </button>
      </div>
      <AddButton product={product} quantity={quantity} />
      <p className="small">
        Preview bag only. No orders or payments are placed.
      </p>
    </div>
  );
}
export function Gallery() {
  const [texture, setTexture] = useState(false);
  return (
    <div>
      <div className="detail-photo">
        <Image
          src={texture ? "/assets/real-wax.webp" : "/assets/pearl-wax.webp"}
          alt={
            texture
              ? "Close-up of pearl wax grains"
              : "Barkat pearl-wax packaging and vessels"
          }
          width={900}
          height={1000}
          sizes="(max-width: 700px) 90vw, 50vw"
          priority
        />
      </div>
      <div className="chips gallery-tabs">
        <button aria-pressed={!texture} onClick={() => setTexture(false)}>
          The pack
        </button>
        <button aria-pressed={texture} onClick={() => setTexture(true)}>
          The texture
        </button>
      </div>
    </div>
  );
}
