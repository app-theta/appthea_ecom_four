import { Link, Navigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useBusiness } from "../context/BusinessContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Wishlist() {
  const { features } = useBusiness();
  const { rows, loading } = useWishlist();
  const items = rows.map((r) => r.product).filter(Boolean);

  if (!features.user_wishlist) return <Navigate to="/" replace />;

  return (
    <section className="section">
      <div className="container-x">
        <nav className="breadcrumb-x"><Link to="/">Home</Link> <span>/</span> <span>Wishlist</span></nav>
        <div className="page-head">
          <div className="eyebrow">Saved for later</div>
          <h1 className="page-title">My Wishlist</h1>
          <p className="text-mute">{items.length} item(s) saved. We will let you know if the price drops.</p>
        </div>

        {loading ? (
          <div className="grid-products cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} style={{ aspectRatio: "1/1", background: "var(--cat-bg)", borderRadius: "var(--radius)" }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="ico"><i className="bi bi-heart"></i></div>
            <h5>Your wishlist is empty</h5>
            <p>Save products you like to find them here later.</p>
            <Link className="btn btn-accent" to="/shop">Find Products</Link>
          </div>
        ) : (
          <div className="grid-products cols-4">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
