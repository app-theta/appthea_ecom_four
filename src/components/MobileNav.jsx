import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useUI } from "../context/UIContext.jsx";

export default function MobileNav() {
  const cart = useCart();
  const { setMenuOpen, setCartOpen } = useUI();
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav">
      <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(true); }}>
        <i className="bi bi-list"></i><span>Category</span>
      </a>
      <a href="#" onClick={(e) => e.preventDefault()}>
        <i className="bi bi-chat-square"></i><span>Message</span>
      </a>
      <Link to="/" className={pathname === "/" ? "active" : ""}>
        <i className="bi bi-house-door-fill"></i><span>Home</span>
      </Link>
      <a href="#" onClick={(e) => { e.preventDefault(); setCartOpen(true); }}>
        <i className="bi bi-cart2"></i><span className="badge-count">{cart.count}</span><span>Cart</span>
      </a>
      <Link to="/login"><i className="bi bi-person"></i><span>Login</span></Link>
    </nav>
  );
}
