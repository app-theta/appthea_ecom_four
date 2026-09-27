import { useState } from "react";
import { Link } from "react-router-dom";
import { content } from "../api/endpoints.js";
import { useAsync } from "../hooks/useAsync.js";
import { paginated } from "../utils/product.js";
import { dateShort } from "../utils/format.js";

export default function Blog() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useAsync((signal) => content.blogs({ page, per_page: 9 }, { signal }), [page]);
  const { rows, lastPage } = paginated(data);

  return (
    <section className="section">
      <div className="container-x">
        <nav className="breadcrumb-x"><Link to="/">Home</Link> <span>/</span> <span>Blog</span></nav>
        <div className="page-head">
          <div className="eyebrow">Stories</div>
          <h1 className="page-title">Blog</h1>
          <p className="text-mute">News, guides and stories from the shop.</p>
        </div>

        {loading ? (
          <p className="text-mute">Loading…</p>
        ) : error ? (
          <p style={{ color: "var(--danger)" }}>{error.message}</p>
        ) : rows.length === 0 ? (
          <div className="dash-empty"><p className="text-mute mb-0">No posts yet.</p></div>
        ) : (
          <>
            <div className="row g-4">
              {rows.map((post) => (
                <div className="col-md-6 col-lg-4" key={post.id}>
                  <article className="panel blog-card h-100">
                    <Link to={`/blog/${post.slug}`} className="blog-card-media" tabIndex={-1} aria-hidden="true">
                      {post.thumbnail ? <img src={post.thumbnail} alt="" /> : <span />}
                    </Link>
                    <div className="panel-body">
                      <div className="text-mute" style={{ fontSize: "var(--fs-xs)" }}>{dateShort(post.published_at)}</div>
                      <h2 className="blog-card-title"><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2>
                      {post.excerpt && <p className="text-mute mb-2" style={{ fontSize: "var(--fs-sm)" }}>{post.excerpt}</p>}
                      <Link to={`/blog/${post.slug}`} style={{ fontWeight: 700, fontSize: "var(--fs-sm)" }}>Read more →</Link>
                    </div>
                  </article>
                </div>
              ))}
            </div>
            {lastPage > 1 && (
              <nav className="d-flex justify-content-center gap-2 mt-4">
                {Array.from({ length: lastPage }, (_, i) => (
                  <button key={i} type="button" className={page === i + 1 ? "btn btn-accent" : "btn btn-outline-line"} onClick={() => setPage(i + 1)}>{i + 1}</button>
                ))}
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
}
