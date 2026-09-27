import { Link } from "react-router-dom";
import { content } from "../api/endpoints.js";
import { useAsync } from "../hooks/useAsync.js";

export default function Faq() {
  const { data, loading, error } = useAsync((signal) => content.faqs({ signal }), []);
  const faqs = Array.isArray(data) ? data : [];

  return (
    <section className="section">
      <div className="container-x" style={{ maxWidth: 860 }}>
        <nav className="breadcrumb-x"><Link to="/">Home</Link> <span>/</span> <span>FAQ</span></nav>
        <div className="page-head">
          <div className="eyebrow">Help</div>
          <h1 className="page-title">Frequently asked questions</h1>
        </div>

        {loading ? (
          <p className="text-mute">Loading…</p>
        ) : error ? (
          <p style={{ color: "var(--danger)" }}>{error.message}</p>
        ) : faqs.length === 0 ? (
          <div className="dash-empty"><p className="text-mute mb-0">No questions have been added yet.</p></div>
        ) : (
          <div className="panel faq-list">
            {faqs.map((f, i) => (
              <details key={f.id} className="faq-item" open={i === 0}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        )}

        <p className="text-mute mt-4">Still have a question? <Link to="/contact" style={{ fontWeight: 700 }}>Contact us</Link></p>
      </div>
    </section>
  );
}
