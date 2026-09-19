import { Link } from "react-router-dom";
import { money } from "../utils/format.js";
import { useCart } from "../context/CartContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useBusiness } from "../context/BusinessContext.jsx";
import CartLine from "./CartLine.jsx";

export default function CartDrawer() {
  const cart = useCart();
  const { cartOpen, setCartOpen } = useUI();
  const { currencySymbol } = useBusiness();

  return (
    <aside className={"drawer" + (cartOpen ? " open" : "")}>
      <div className="drawer-head">
        <div>
          <div className="eyebrow">Your shopping bag</div>
          <h5>Shopping Cart</h5>
        </div>
        <button className="drawer-close" aria-label="Close" onClick={() => setCartOpen(false)}><i className="bi bi-x-lg"></i></button>
      </div>

      <div className="drawer-body">
        {cart.detailed.length ? (
          cart.detailed.map((p) => <CartLine key={p.id} item={p} />)
        ) : (
          <div className="empty-state">
            <div className="ico"><i className="bi bi-cart2"></i></div>
            <h5>Your cart is empty</h5>
            <p>Add products to continue shopping.</p>
            <Link className="btn btn-accent" to="/cart" onClick={() => setCartOpen(false)}>View Cart</Link>
          </div>
        )}
      </div>

      <div className="drawer-foot">
        {cart.detailed.length ? (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span style={{ fontSize: "var(--fs-md)" }}>Subtotal</span>
              <span style={{ fontSize: "var(--fs-3xl)", fontWeight: 800, color: "var(--accent)" }}>
                {money(cart.subtotal, currencySymbol)}
              </span>
            </div>
            <div className="row g-2">
              <div className="col-6">
                <Link className="btn btn-outline-line w-100" to="/cart" onClick={() => setCartOpen(false)}>View Cart</Link>
              </div>
              <div className="col-6">
                <Link className="btn btn-accent w-100" to="/checkout" onClick={() => setCartOpen(false)}>Checkout</Link>
              </div>
            </div>
          </>
        ) : (
          <Link className="btn btn-outline-line w-100" to="/shop" onClick={() => setCartOpen(false)}>Continue Shopping</Link>
        )}
      </div>
    </aside>
  );
}
