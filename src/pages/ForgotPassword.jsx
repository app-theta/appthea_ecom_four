import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { auth as authApi } from "../api/endpoints.js";
import { parseApiError } from "../api/errors.js";

/** Forgot password, and - when the mailed link brings a `token` (plus `email`) - the new-password form. */
export default function ForgotPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [email, setEmail] = useState(params.get("email") || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState({});
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError(""); setFields({});
    try {
      if (token) {
        await authApi.resetPassword({ token, email, password, password_confirmation: confirm });
      } else {
        await authApi.forgotPassword({ email });
      }
      setSent(true);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      setFields(parsed.fields);
    } finally { setBusy(false); }
  };

  const fieldError = (name) => fields[name] && (
    <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{fields[name]}</p>
  );

  return (
    <section className="auth-wrap">
      <div className="container-x d-flex justify-content-center">
        <div className="auth-card">
          <Link className="back-link" to="/login">← Back to login</Link>
          <h1>{token ? "Set a new password" : "Forgot password"}</h1>
          <p className="sub">
            {token
              ? "Choose a new password for your account. The link works once, for one hour."
              : "Enter your account email and we will send you a link to reset your password."}
          </p>

          {sent ? (
            <p className="mb-0">
              {token
                ? <>Your password has been changed. <Link to="/login" style={{ fontWeight: 700 }}>Log in</Link> with the new one.</>
                : <>If an account exists for {email}, a reset link is on its way.</>}
            </p>
          ) : (
            <form onSubmit={submit} noValidate>
              {token ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">New password</label>
                    <input type="password" className="form-control" required minLength={4} maxLength={25} autoComplete="new-password"
                      value={password} onChange={(e) => setPassword(e.target.value)} />
                    {fieldError("password")}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm new password</label>
                    <input type="password" className="form-control" required autoComplete="new-password"
                      value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" placeholder="Enter your email" required
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                  {fieldError("email")}
                </div>
              )}
              {error && <p className="mb-3" style={{ color: "var(--danger)", fontSize: "var(--fs-sm)" }}>{error}</p>}
              <button className="btn btn-accent w-100" style={{ padding: 13, fontSize: "var(--fs-lg)" }} disabled={busy}>
                {busy ? "Please wait…" : token ? "Save new password" : "Send reset link"}
              </button>
              {token && error && (
                <p className="text-center mt-3 mb-0" style={{ fontSize: "var(--fs-sm)" }}><Link to="/forgot-password">Ask for a new link</Link></p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
