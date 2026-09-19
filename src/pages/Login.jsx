import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  return (
    <section className="auth-wrap">
      <div className="container-x d-flex justify-content-center">
        <div className="auth-card">
          <Link className="back-link" to="/">← Back to store</Link>
          <h1>Welcome Back</h1>
          <p className="sub">Login to view orders, addresses and account information.</p>
          <form onSubmit={(e) => { e.preventDefault(); navigate("/account"); }}>
            <div className="mb-3">
              <label className="form-label">Email or Phone Number</label>
              <input className="form-control" placeholder="Enter email or phone" style={{ borderColor: "var(--accent)" }} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="pw-wrap">
                <input type={show ? "text" : "password"} className="form-control" placeholder="Enter password" />
                <button type="button" className="pw-toggle" onClick={() => setShow(!show)}>
                  <i className={show ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                </button>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
              <label className="form-check" style={{ fontSize: "var(--fs-sm)" }}>
                <input className="form-check-input" type="checkbox" /> Remember me for 30 days
              </label>
              <a href="#" style={{ fontSize: "var(--fs-sm)", fontWeight: 700 }}>Forgot password?</a>
            </div>
            <button className="btn btn-accent w-100" style={{ padding: 13, fontSize: "var(--fs-lg)" }}>Login to Account</button>
          </form>
          <div className="divider-text"><span>New customer?</span></div>
          <p className="text-center mb-0" style={{ fontSize: "var(--fs-sm)" }}>
            Do not have an account? <Link to="/register" style={{ fontWeight: 700 }}>Create account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
