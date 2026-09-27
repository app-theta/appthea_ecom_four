import { useEffect, useState } from "react";
import { useBusiness } from "../context/BusinessContext.jsx";
import { useSubscribe } from "../hooks/useSubscribe.js";

const SEEN_KEY = "apptheta_newsletter_seen";

/** Shows a one-time "join our newsletter" modal a few seconds after load,
    gated by the `newsletter_popup` business feature flag. Any dismissal
    marks it seen so it never shows again on this device. */
export default function NewsletterPopup() {
  const { features, info } = useBusiness();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const newsletter = useSubscribe();

  useEffect(() => {
    if (!features.newsletter_popup) return;
    let seen = false;
    try { seen = localStorage.getItem(SEEN_KEY) === "1"; } catch { /* ignore */ }
    if (seen) return;
    const id = window.setTimeout(() => setOpen(true), 6000);
    return () => window.clearTimeout(id);
  }, [features.newsletter_popup]);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
  };

  const subscribe = async (e) => {
    e.preventDefault();
    if (await newsletter.subscribe(email)) {
      try { localStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1200, background: "rgba(19,26,43,.55)",
        display: "grid", placeItems: "center", padding: 16, overflowY: "auto"
      }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="auth-card position-relative" style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
        <button type="button" className="pw-toggle" aria-label="Close" style={{ position: "absolute", top: 18, right: 18 }} onClick={close}>
          <i className="bi bi-x-lg"></i>
        </button>
        <div className="empty-state" style={{ padding: 0 }}>
          <div className="ico"><i className="bi bi-envelope-heart"></i></div>
        </div>
        <h1 style={{ fontSize: "var(--fs-6xl)" }}>Join our newsletter</h1>
        {newsletter.done ? (
          <p className="sub mb-0">Thanks for subscribing!</p>
        ) : (
          <>
            <p className="sub">Get updates on new arrivals, sales and more from {info?.name || "us"}.</p>
            <form onSubmit={subscribe}>
              <input
                type="email"
                className="form-control mb-2"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
              />
              {newsletter.error && <p className="mb-2" style={{ color: "var(--danger)", fontSize: "var(--fs-sm)" }}>{newsletter.error}</p>}
              <button type="submit" className="btn btn-accent w-100" style={{ padding: 12 }} disabled={newsletter.busy}>Subscribe</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
