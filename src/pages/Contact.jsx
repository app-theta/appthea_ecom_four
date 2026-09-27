import { useState } from "react";
import { Link } from "react-router-dom";
import { content } from "../api/endpoints.js";
import { parseApiError } from "../api/errors.js";
import { useBusiness } from "../context/BusinessContext.jsx";

const BLANK = { name: "", email: "", phone: "", subject: "", message: "", website: "" };

export default function Contact() {
  const { info } = useBusiness();
  const [form, setForm] = useState(BLANK);
  const [fields, setFields] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError(""); setFields({});
    try {
      await content.contact(form);
      setSent(true);
      setForm(BLANK);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
      setFields(parsed.fields);
    } finally { setBusy(false); }
  };

  const input = (name, label, props = {}) => (
    <div className="mb-3">
      <label className="form-label" htmlFor={`c-${name}`}>{label}</label>
      <input id={`c-${name}`} className="form-control" name={name} value={form[name]} onChange={set(name)} {...props} />
      {fields[name] && <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{fields[name]}</p>}
    </div>
  );

  return (
    <section className="section">
      <div className="container-x">
        <nav className="breadcrumb-x"><Link to="/">Home</Link> <span>/</span> <span>Contact us</span></nav>
        <div className="page-head">
          <div className="eyebrow">Get in touch</div>
          <h1 className="page-title">Contact us</h1>
          <p className="text-mute">Questions about an order or a product? Send us a message and we will get back to you.</p>
        </div>

        <div className="row g-4">
          <div className="col-lg-7">
            <div className="panel"><div className="panel-body p-4">
              {sent ? (
                <div className="text-center py-4">
                  <i className="bi bi-check2-circle" style={{ fontSize: 40, color: "var(--accent)" }}></i>
                  <h4 className="mt-2">Message sent</h4>
                  <p className="text-mute">Thank you. We will reply as soon as we can.</p>
                  <button type="button" className="btn btn-outline-line" onClick={() => setSent(false)}>Send another message</button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="contact-form">
                  <div className="row">
                    <div className="col-md-6">{input("name", "Your name", { required: true, maxLength: 191, autoComplete: "name" })}</div>
                    <div className="col-md-6">{input("email", "Email", { type: "email", required: true, maxLength: 191, autoComplete: "email" })}</div>
                    <div className="col-md-6">{input("phone", "Phone (optional)", { type: "tel", maxLength: 30, autoComplete: "tel" })}</div>
                    <div className="col-md-6">{input("subject", "Subject (optional)", { maxLength: 191 })}</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="c-message">Message</label>
                    <textarea id="c-message" className="form-control" name="message" rows={6} required maxLength={2000} value={form.message} onChange={set("message")} />
                    {fields.message && <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{fields.message}</p>}
                  </div>
                  {/* honeypot: people never see or fill it, bots do - the API then refuses the message */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set("website")}
                    style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
                  {error && <p className="mb-3" style={{ color: "var(--danger)", fontSize: "var(--fs-sm)" }}>{error}</p>}
                  <button type="submit" className="btn btn-accent" disabled={busy}>{busy ? "Sending…" : "Send message"}</button>
                </form>
              )}
            </div></div>
          </div>
          <div className="col-lg-5">
            <div className="panel"><div className="panel-body p-4">
              <h5>Reach us</h5>
              {info?.address && <p className="mb-2"><i className="bi bi-geo-alt me-2"></i>{[info.address, info.area, info.city].filter(Boolean).join(", ")}</p>}
              {info?.phone && <p className="mb-2"><i className="bi bi-telephone me-2"></i><a href={`tel:${info.phone}`}>{info.phone}</a></p>}
              {info?.email && <p className="mb-0"><i className="bi bi-envelope me-2"></i><a href={`mailto:${info.email}`}>{info.email}</a></p>}
            </div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
