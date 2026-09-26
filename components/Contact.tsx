"use client";
import { useState, type FormEvent } from "react";
import config from "@/data/contact.json";
import { useShop } from "./Shop";
function SocialIcon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      width="23"
      height="23"
      fill="currentColor"
    >
      {name === "Instagram" ? (
        <>
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="12"
            cy="12"
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="17.5" cy="6.5" r="1.2" />
        </>
      ) : name === "YouTube" ? (
        <path d="M22 7s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.4 4 12 4 12 4s-4.4 0-7.2.1c-.4.1-1.2.1-2 .9C2.2 5.6 2 7 2 7s-.2 1.6-.2 3.2v3.6C1.8 15.4 2 17 2 17s.2 1.4.8 2c.8.8 1.9.8 2.4.9C7 20 12 20 12 20s4.4 0 7.2-.1c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-3.6C22.2 8.6 22 7 22 7ZM10 16V8l6 4-6 4Z" />
      ) : name === "X" ? (
        <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.9-9L1.3 2h6.4l4.4 6.6L18.9 2ZM17.8 20h1.7L6.7 3.9H4.8L17.8 20Z" />
      ) : (
        <>
          <path d="M20.5 3.5A11 11 0 0 0 3.1 16.8L1.5 22.5l5.9-1.6A11 11 0 0 0 20.5 3.5ZM12 20a8.9 8.9 0 0 1-4.4-1.2l-.3-.2-3.5.9.9-3.4-.2-.3A9 9 0 1 1 12 20Z" />
          <path d="M8.1 6.9c-.3 0-.7.1-.9.4-.3.4-1 1-1 2.4s1 2.8 1.2 3 2 3.1 4.9 4.2c2.4.9 2.9.7 3.4.6.5-.1 1.6-.7 1.8-1.4.2-.7.2-1.2.2-1.3l-.4-.2-2.2-1c-.3-.1-.5-.2-.7.2l-1 1.1c-.2.2-.4.2-.7.1a8 8 0 0 1-2.3-1.4 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.4c-.2-.5-.5-.5-.7-.5Z" />
        </>
      )}
    </svg>
  );
}
function safeSocial(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" &&
      [
        "instagram.com",
        "www.instagram.com",
        "wa.me",
        "youtube.com",
        "www.youtube.com",
        "x.com",
        "www.x.com",
      ].includes(u.hostname)
      ? u.href
      : null;
  } catch {
    return null;
  }
}
export function Contact() {
  const { ready } = useShop();
  const [status, setStatus] = useState(""),
    [error, setError] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("");
    setError("");
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim(),
      contact = String(data.get("contact") || "").trim(),
      message = String(data.get("message") || "").trim();
    if (!name || !message || !contact) {
      setError("Please add your name, contact details and a short request.");
      return;
    }
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) &&
      !(
        /^[+()\d\s-]{7,22}$/.test(contact) &&
        contact.replace(/\D/g, "").length >= 7 &&
        contact.replace(/\D/g, "").length <= 15
      )
    ) {
      setError("Enter a valid email address or phone number.");
      return;
    }
    if (!config.verified) {
      setError(
        "This is a preview form. Contact details are being confirmed; your request has not been sent.",
      );
      return;
    }
    const text = [
      "Custom Barkat request",
      name,
      contact,
      String(data.get("type")),
      String(data.get("budget") || "Budget not specified"),
      message,
    ].join("\n");
    if (/^\d{8,15}$/.test(config.whatsapp)) {
      window.location.assign(
        "https://wa.me/" +
          config.whatsapp +
          "?text=" +
          encodeURIComponent(text),
      );
    } else if (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email) &&
      !config.email.endsWith(".example")
    ) {
      window.location.assign(
        "mailto:" +
          encodeURIComponent(config.email) +
          "?subject=" +
          encodeURIComponent("Custom Barkat request") +
          "&body=" +
          encodeURIComponent(text),
      );
    } else {
      setError(
        "A contact destination is not available. Your request has not been sent.",
      );
      return;
    }
    setStatus(
      "Your message is ready in your messaging app. Review it there and choose Send. Nothing is sent automatically.",
    );
  }
  return (
    <section className="contact-section" id="contact">
      <div className="wrap contact-grid">
        <div>
          <p className="eyebrow">SOMETHING ONLY YOU COULD IMAGINE</p>
          <h2>
            Let’s make
            <br />
            <em>it personal.</em>
          </h2>
          <p>
            A particular colour. A thoughtful hamper. A little something for
            everyone. Tell us what you have in mind.
          </p>
          <div className="socials">
            {Object.entries(config.socials).map(([name, url]) => {
              const href = config.verified ? safeSocial(url) : null;
              return href ? (
                <a
                  href={href}
                  key={name}
                  aria-label={"Barkat on " + name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon name={name} />
                </a>
              ) : (
                <span
                  key={name}
                  className="social-unavailable"
                  role="img"
                  aria-label={name + " — link coming soon"}
                  title={name + " — link coming soon"}
                >
                  <SocialIcon name={name} />
                </span>
              );
            })}
          </div>
          <p className="small">
            Social links coming soon. Sample email: {config.email}
          </p>
        </div>
        <form onSubmit={submit} className="custom-form">
          <h3>Request a custom piece</h3>
          <p className="small">
            Preview form — no request is sent until brand contact details are
            confirmed.
          </p>
          <div className="form-row">
            <label>
              Your name
              <input name="name" autoComplete="name" required maxLength={80} />
            </label>
            <label>
              Email or phone
              <input
                name="contact"
                autoComplete="email"
                required
                maxLength={120}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Request type
              <select name="type">
                <option>Custom shade</option>
                <option>Custom vessel</option>
                <option>Custom hamper</option>
                <option>Bulk gifting</option>
              </select>
            </label>
            <label>
              Budget in ₹ (optional)
              <input
                name="budget"
                inputMode="numeric"
                type="number"
                min="0"
                max="10000000"
              />
            </label>
          </div>
          <label>
            Your idea
            <textarea
              name="message"
              rows={3}
              required
              minLength={5}
              maxLength={1200}
              placeholder="Colours, occasions, little details…"
            />
          </label>
          <p className="small">
            Your details stay in this form until you choose a messaging handoff.
            We do not save them.
          </p>
          <button className="btn" type="submit" disabled={!ready}>
            Prepare my request ↗
          </button>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          {status && <p role="status">{status}</p>}
        </form>
      </div>
    </section>
  );
}
