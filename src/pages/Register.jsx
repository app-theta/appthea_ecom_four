import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { parseApiError } from "../api/errors.js";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState({ a: false, b: false });
  const [form, setForm] = useState({
    first_name: "", last_name: "", phone: "", email: "", password: "", password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErrors({}); setError("");
    try {
      await register(form);
      navigate("/account", { replace: true });
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
          <h1>Create Your Account</h1>
          <p className="sub">Register once for faster checkout and complete order management.</p>
          <form onSubmit={submit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input className="form-control" placeholder="First name" value={form.first_name} onChange={set("first_name")} required />
                {errors.first_name && <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{errors.first_name}</p>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input className="form-control" placeholder="Last name" value={form.last_name} onChange={set("last_name")} required />
                {errors.last_name && <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{errors.last_name}</p>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone Number</label>
                <input className="form-control" type="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={set("phone")} required />
                {errors.phone && <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{errors.phone}</p>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Email Address<span className="opt">Optional</span></label>
                <input type="email" className="form-control" placeholder="name@example.com" value={form.email} onChange={set("email")} />
                {errors.email && <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{errors.email}</p>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Password</label>
                <div className="pw-wrap">
                  <input type={show.a ? "text" : "password"} className="form-control" placeholder="Minimum 4 characters" value={form.password} onChange={set("password")} required />
                  <button type="button" className="pw-toggle" onClick={() => setShow({ ...show, a: !show.a })} aria-label={show.a ? "Hide password" : "Show password"}>
                    <i className={show.a ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </button>
                </div>
                {errors.password && <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{errors.password}</p>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Confirm Password</label>
                <div className="pw-wrap">
                  <input type={show.b ? "text" : "password"} className="form-control" placeholder="Repeat password" value={form.password_confirmation} onChange={set("password_confirmation")} required />
                  <button type="button" className="pw-toggle" onClick={() => setShow({ ...show, b: !show.b })} aria-label={show.b ? "Hide password" : "Show password"}>
                    <i className={show.b ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </button>
                </div>
              </div>
            </div>
            {error && <p className="mt-3 mb-0" style={{ color: "var(--danger)", fontSize: "var(--fs-sm)" }}>{error}</p>}
            <button className="btn btn-accent w-100 mt-4" style={{ padding: 13, fontSize: "var(--fs-lg)" }} disabled={busy}>
              {busy ? "Creating account…" : "Create Account"}
            </button>
          </form>
          <p className="text-center mb-0 mt-3" style={{ fontSize: "var(--fs-sm)" }}>
            Already registered? <Link to="/login" style={{ fontWeight: 700 }}>Login here</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
