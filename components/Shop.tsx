"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type MouseEvent,
} from "react";
import Link from "next/link";
import { nav } from "@/lib/navigation";
import { products, money, type Product } from "@/lib/catalog";
import { sanitizeBag, addItems, type Bag } from "@/lib/bag";
const ids = products.map((p) => p.id),
  key = "barkat-bag-v2";
type Store = {
  bag: Bag;
  ready: boolean;
  add: (items: { id: string; quantity: number }[]) => void;
  setQuantity: (id: string, n: number) => void;
  open: () => void;
  status: string;
};
const Context = createContext<Store | null>(null);
export function useShop() {
  const s = useContext(Context);
  if (!s) throw Error("Missing bag provider");
  return s;
}
export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!open) return;
    const dialog = ref.current!;
    const trigger = document.activeElement as HTMLElement | null;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previous;
      trigger?.focus();
    };
  }, [open]);
  const backdrop = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target !== e.currentTarget) return;
    const r = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      onClose();
  };
  return (
    <dialog ref={ref} aria-label={title} onCancel={onClose} onClick={backdrop}>
      <div className="dialog-head">
        <h2>{title}</h2>
        <button
          className="icon-btn"
          aria-label={"Close " + title}
          onClick={onClose}
        >
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function ShopProvider({ children }: { children: ReactNode }) {
  const [bag, setBag] = useState<Bag>({}),
    [ready, setReady] = useState(false),
    [isOpen, setOpen] = useState(false),
    [status, setStatus] = useState("");
  const latest = useRef<Bag>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    try {
      latest.current = sanitizeBag(
        JSON.parse(localStorage.getItem(key) || "{}"),
        ids,
      );
      setBag(latest.current);
    } catch {}
    setReady(true);
    const sync = (e: StorageEvent) => {
      if (e.key !== key && e.key !== null) return;
      try {
        latest.current = sanitizeBag(JSON.parse(e.newValue || "{}"), ids);
        setBag(latest.current);
      } catch {
        latest.current = {};
        setBag({});
      }
    };
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("storage", sync);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  const commit = useCallback((next: Bag) => {
    latest.current = next;
    setBag(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      setStatus("Bag updated for this visit. Your browser could not save it.");
    }
  }, []);
  const add = useCallback(
    (items: { id: string; quantity: number }[]) => {
      commit(addItems(latest.current, items, ids));
      setStatus("Added ✓ — preview bag updated");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus(""), 3500);
    },
    [commit],
  );
  const setQuantity = (id: string, n: number) => {
    const next = { ...latest.current };
    if (n <= 0) delete next[id];
    else if (ids.includes(id)) next[id] = Math.min(99, Math.floor(n));
    commit(next);
  };
  const total = Object.entries(bag).reduce(
    (sum, [id, n]) => sum + (products.find((p) => p.id === id)?.price || 0) * n,
    0,
  );
  return (
    <Context.Provider
      value={{
        bag,
        ready,
        add,
        setQuantity,
        open: () => setOpen(true),
        status,
      }}
    >
      {children}
      <div className={status ? "toast visible" : "toast"} role="status">
        {status}
      </div>
      <Dialog open={isOpen} onClose={() => setOpen(false)} title="Your bag">
        <p className="small">Preview only. No orders or payments are placed.</p>
        {Object.keys(bag).length ? (
          Object.entries(bag).map(([id, n]) => {
            const p = products.find((p) => p.id === id)!;
            return (
              <article className="bag-item" key={id}>
                <h3>{p.name}</h3>
                <div className="split">
                  <div className="quantity">
                    <button
                      aria-label={"Remove one " + p.name}
                      onClick={() => setQuantity(id, n - 1)}
                    >
                      −
                    </button>
                    <span>{n}</span>
                    <button
                      disabled={n === 99}
                      aria-label={"Add one " + p.name}
                      onClick={() => setQuantity(id, n + 1)}
                    >
                      +
                    </button>
                  </div>
                  <strong>{money(p.price * n)}</strong>
                </div>
                <button className="text-btn" onClick={() => setQuantity(id, 0)}>
                  Remove {p.name}
                </button>
              </article>
            );
          })
        ) : (
          <p className="empty">
            A little space for something lovely. Explore the collection to
            begin.
          </p>
        )}
        <div className="split subtotal">
          <strong>Subtotal</strong>
          <strong>{money(total)}</strong>
        </div>
        <button className="btn full" onClick={() => setOpen(false)}>
          Continue exploring ↗
        </button>
      </Dialog>
    </Context.Provider>
  );
}
export function BagButton() {
  const { bag, open, ready } = useShop();
  return (
    <button
      className="bag-btn"
      disabled={!ready}
      onClick={open}
      aria-haspopup="dialog"
    >
      Bag <span>{Object.values(bag).reduce((a, b) => a + b, 0)}</span>
    </button>
  );
}
export function AddButton({
  product,
  quantity = 1,
}: {
  product: Product;
  quantity?: number;
}) {
  const { add, ready } = useShop();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <button
      className="btn add full"
      disabled={!ready}
      onClick={() => {
        add([{ id: product.id, quantity }]);
        setAdded(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setAdded(false), 2000);
      }}
    >
      {added ? "Added ✓" : "Add to cart"}
      <span aria-hidden="true">{added ? "" : "+"}</span>
    </button>
  );
}
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="icon-btn mobile-toggle"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        ☰
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Explore">
        <nav className="mobile-links">
          {nav.map(([name, url]) => (
            <Link key={name} href={url} onClick={() => setOpen(false)}>
              {name}
            </Link>
          ))}
        </nav>
      </Dialog>
    </>
  );
}
