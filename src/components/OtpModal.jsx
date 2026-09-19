import { useState } from "react";
import { checkout as checkoutApi } from "../api/endpoints.js";
import { parseApiError } from "../api/errors.js";

export default function OtpModal({ open, phone, onClose, onVerified }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const verify = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await checkoutApi.verifyOtp({ phone, otp_code: code });
      onVerified();
    } catch (err) {
      setError(parseApiError(err).message);
    } finally { setBusy(false); }
  };

  const resend = async () => {
    setError("");
    try { await checkoutApi.sendOtp(phone); } catch (err) { setError(parseApiError(err).message); }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1200, background: "rgba(19,26,43,.55)",
        display: "grid", placeItems: "center", padding: 16, overflowY: "auto"
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="auth-card position-relative" style={{ width: "100%", maxWidth: 420 }}>
        <button
          type="button"
          className="pw-toggle"
          aria-label="Close"
          style={{ position: "absolute", top: 18, right: 18 }}
          onClick={onClose}
        >
          <i className="bi bi-x-lg"></i>
        </button>
        <h1 style={{ fontSize: "var(--fs-6xl)" }}>Verify your phone</h1>
        <p className="sub">We sent a verification code to {phone}. Enter it below to confirm your order.</p>
        <form onSubmit={verify}>
          <input
            type="text"
            className="form-control text-center mb-2"
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            autoFocus
            style={{ letterSpacing: "0.5em", fontSize: "var(--fs-2xl)" }}
          />
          {error && <p style={{ color: "var(--danger)", fontSize: "var(--fs-sm)" }}>{error}</p>}
          <button type="submit" className="btn btn-accent w-100" style={{ padding: 12 }} disabled={busy || code.length < 4}>
            {busy ? "Verifying…" : "Verify & Place Order"}
          </button>
        </form>
        <button type="button" className="btn btn-outline-line w-100 mt-2 border-0" onClick={resend}>
          Resend code
        </button>
      </div>
    </div>
  );
}
