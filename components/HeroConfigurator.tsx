"use client";
import { useState } from "react";
import { products, money } from "@/lib/catalog";
import { useShop } from "./Shop";
export default function HeroConfigurator() {
  const wax = products.find((p) => p.id === "wax-ivory")!,
    vessel = products.find((p) => p.id === "vase-4")!;
  const [choice, setChoice] = useState("both"),
    [added, setAdded] = useState(false);
  const { add, ready } = useShop();
  const total =
    choice === "wax"
      ? wax.price
      : choice === "vessel"
        ? vessel.price
        : wax.price + vessel.price;
  return (
    <div className="hero-config">
      <div className="split">
        <span className="eyebrow">MAKE IT YOURS</span>
        <span className="small">Sample prices</span>
      </div>
      <div className="segments" aria-label="Choose your bundle">
        {[
          ["wax", "Wax only", wax.price],
          ["vessel", "Vessel only", vessel.price],
          ["both", "Both", wax.price + vessel.price],
        ].map(([id, label, price]) => (
          <button
            key={id}
            aria-pressed={choice === id}
            onClick={() => {
              setChoice(String(id));
              setAdded(false);
            }}
          >
            {label}
            <small>{money(Number(price))}</small>
          </button>
        ))}
      </div>
      <p className="small">
        Ivory Pearl Wax + Blush Bow decor vessel. Candle suitability
        unconfirmed.
      </p>
      <button
        className="btn full"
        disabled={!ready}
        onClick={() => {
          add(
            (choice === "wax"
              ? [wax]
              : choice === "vessel"
                ? [vessel]
                : [wax, vessel]
            ).map((p) => ({ id: p.id, quantity: 1 })),
          );
          setAdded(true);
        }}
      >
        {added ? "Added ✓" : "Add to cart"}
        <span>{money(total)} ＋</span>
      </button>
    </div>
  );
}
