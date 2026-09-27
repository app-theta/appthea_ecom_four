import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { parseApiError } from "../api/errors.js";
import SocialLogin from "../components/SocialLogin.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember_me: false });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErrors({}); setError("");
    try {
      await login(form);
      navigate(location.state?.from || "/account", { replace: true });
    } catch (err) {
      const parsed = parseApiError(err);
      setErrors(parsed.fields);
      setError(parsed.message);
    } finally { setBusy(false); }
  };

  return (
    <section className="auth-wrap">
      <div className="container-x d-flex justify-content-center">
        <div className="auth-card">
          <Link className="back-link" to="/">← Back to store</Link>
          <h1>Welcome Back</h1>
          <p className="sub">Login to view orders, addresses and account information.</p>
          <form onSubmit={submit} noValidate>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                style={{ borderColor: "var(--accent)" }}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              {errors.email && <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{errors.email}</p>}
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="pw-wrap">
                <input
                  type={show ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" className="pw-toggle" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>
                  <i className={show ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                </button>
              </div>
              {errors.password && <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{errors.password}</p>}
            </div>
            {error && <p className="mb-3" style={{ color: "var(--danger)", fontSize: "var(--fs-sm)" }}>{error}</p>}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
              <label className="form-check" style={{ fontSize: "var(--fs-sm)" }}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={form.remember_me}
                  onChange={(e) => setForm({ ...form, remember_me: e.target.checked })}
                /> Remember me for 30 days
              </label>
              <Link to="/forgot-password" style={{ fontSize: "var(--fs-sm)", fontWeight: 700 }}>Forgot password?</Link>
            </div>
            <button className="btn btn-accent w-100" style={{ padding: 13, fontSize: "var(--fs-lg)" }} disabled={busy}>
              {busy ? "Signing in…" : "Login to Account"}
            </button>
          </form>
          <SocialLogin onDone={() => navigate(location.state?.from || "/account", { replace: true })} />
          <div className="divider-text"><span>New customer?</span></div>
          <p className="text-center mb-0" style={{ fontSize: "var(--fs-sm)" }}>
            Do not have an account? <Link to="/register" style={{ fontWeight: 700 }}>Create account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
