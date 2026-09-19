import { Link } from "react-router-dom";
import { useBusiness } from "../context/BusinessContext.jsx";

/** Renders one of the business's rich-text legal fields (e.g. `privacy_policy`).
    One page, reused for every policy route via `field`/`title` props. */
export default function Policy({ field, title }) {
  const { info, loading } = useBusiness();
  const html = info?.[field];

  return (
    <section className="section">
      <div className="container-x">
        <nav className="breadcrumb-x"><Link to="/">Home</Link> <span>/</span> <span>{title}</span></nav>
        <div className="page-head">
          <h1 className="page-title">{title}</h1>
        </div>

        <div className="panel">
          <div className="panel-body p-4">
            {loading ? (
              <p className="text-mute mb-0">Loading…</p>
            ) : html ? (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <p className="text-mute mb-0">This policy has not been published yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
