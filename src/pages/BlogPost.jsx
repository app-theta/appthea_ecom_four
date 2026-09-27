import { Link, useParams } from "react-router-dom";
import { content } from "../api/endpoints.js";
import { useAsync } from "../hooks/useAsync.js";
import { dateShort } from "../utils/format.js";

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, loading, error } = useAsync((signal) => content.blog(slug, { signal }), [slug]);

  return (
    <section className="section">
      <div className="container-x" style={{ maxWidth: 860 }}>
        <nav className="breadcrumb-x"><Link to="/">Home</Link> <span>/</span> <Link to="/blog">Blog</Link> <span>/</span> <span>{post?.title || "…"}</span></nav>
        {loading ? (
          <p className="text-mute">Loading…</p>
        ) : error ? (
          <div className="dash-empty">
            <p className="mb-2">{error.status === 404 ? "This post could not be found." : error.message}</p>
            <Link to="/blog">Back to the blog</Link>
          </div>
        ) : (
          <article>
            <div className="page-head">
              <div className="eyebrow">{dateShort(post?.published_at)}</div>
              <h1 className="page-title">{post?.title}</h1>
            </div>
            {post?.thumbnail && <img src={post.thumbnail} alt="" className="mb-4" style={{ width: "100%", borderRadius: "var(--radius)" }} />}
            {/* written by the shop in the admin's rich-text editor */}
            <div className="panel"><div className="panel-body p-4 blog-body" dangerouslySetInnerHTML={{ __html: post?.description || "" }} /></div>
            <p className="mt-4"><Link to="/blog" style={{ fontWeight: 700 }}>← Back to the blog</Link></p>
          </article>
        )}
      </div>
    </section>
  );
}
