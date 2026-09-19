import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [show, setShow] = useState({ a: false, b: false });

  return (
    <section className="auth-wrap">
      <div className="container-x d-flex justify-content-center">
        <div className="auth-card">
          <Link className="back-link" to="/">← Back to store</Link>
          <h1>Create Your Account</h1>
          <p className="sub">Register once for faster checkout and complete order management.</p>
          <form onSubmit={(e) => { e.preventDefault(); navigate("/account"); }}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input className="form-control" placeholder="Your full name" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone Number</label>
                <input className="form-control" placeholder="01XXXXXXXXX" />
              </div>
              <div className="col-12">
                <label className="form-label">Email Address<span className="opt">Optional</span></label>
                <input type="email" className="form-control" placeholder="name@example.com" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Password</label>
                <div className="pw-wrap">
                  <input type={show.a ? "text" : "password"} className="form-control" placeholder="Minimum 8 characters" />
                  <button type="button" className="pw-toggle" onClick={() => setShow({ ...show, a: !show.a })}>
                    <i className={show.a ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </button>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Confirm Password</label>
                <div className="pw-wrap">
                  <input type={show.b ? "text" : "password"} className="form-control" placeholder="Repeat password" />
                  <button type="button" className="pw-toggle" onClick={() => setShow({ ...show, b: !show.b })}>
                    <i className={show.b ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </button>
                </div>
              </div>
            </div>
            <button className="btn btn-accent w-100 mt-4" style={{ padding: 13, fontSize: "var(--fs-lg)" }}>Create Account</button>
          </form>
          <p className="text-center mb-0 mt-3" style={{ fontSize: "var(--fs-sm)" }}>
            Already registered? <Link to="/login" style={{ fontWeight: 700 }}>Login here</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
