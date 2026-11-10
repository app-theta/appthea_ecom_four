import Link from "next/link";

export const metadata = { title: "Page not found", robots: { index: false } };

/** A real 404 (status and page) for unknown URLs, missing products and posts. */
export default function NotFound() {
  return (
    <section className="section">
      <div className="container-x text-center py-5">
        <i className="bi bi-signpost-split" style={{ fontSize: 44, color: "var(--accent)" }}></i>
        <h1 className="page-title mt-3">Page not found</h1>
        <p className="text-mute">এই পাতাটি খুঁজে পাওয়া যায়নি। হয়তো লিংকটি বদলে গেছে বা পণ্যটি আর নেই।</p>
        <div className="d-flex gap-2 justify-content-center mt-3">
          <Link className="btn btn-accent btn-pill" href="/">Home</Link>
          <Link className="btn btn-outline-line btn-pill" href="/shop">Shop</Link>
        </div>
      </div>
    </section>
  );
}
