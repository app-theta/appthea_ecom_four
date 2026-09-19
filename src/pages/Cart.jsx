import { Link } from "react-router-dom";
import { money } from "../utils/format.js";
import { useCart } from "../context/CartContext.jsx";
import { useBusiness } from "../context/BusinessContext.jsx";
import CartLine from "../components/CartLine.jsx";

export default function Cart() {
  const cart = useCart();
  const { currencySymbol } = useBusiness();

  return (
    <section className="section">
      <div className="container-x">
        <nav className="breadcrumb-x"><Link to="/">Home</Link> <span>/</span> <span>Shopping Cart</span></nav>
        <div className="page-head">
          <div className="eyebrow">Your selection</div>
          <h1 className="page-title">Shopping Cart</h1>
          <p className="text-mute">Review your products and quantities before checkout.</p>
        </div>

        <div className="row g-4 mt-2">
          <div className="col-lg-8">
            <div className="panel">
              <div className="panel-head">
                <h5>Cart Items</h5>
                <span className="text-mute" style={{ fontSize: "var(--fs-sm)" }}>{cart.count} item(s)</span>
              </div>
              <div className="panel-body pt-0">
                {cart.detailed.length ? (
                  cart.detailed.map((p) => <CartLine key={p.id} item={p} />)
                ) : (
                  <div className="empty-state">
                    <div className="ico"><i className="bi bi-cart2"></i></div>
                    <h5>Your cart is empty</h5>
                    <p>Add products to continue shopping.</p>
                    <Link className="btn btn-accent" to="/shop">Start Shopping</Link>
                  </div>
                )}
              </div>
              <div className="panel-body border-top">
                <Link className="btn btn-outline-line" to="/shop">Continue Shopping</Link>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="panel">
              <div className="panel-head"><h5>Order Summary</h5></div>
              <div className="panel-body">
                <div className="sum-row"><span className="label">Subtotal</span><b>{money(cart.subtotal, currencySymbol)}</b></div>
                <div className="sum-row"><span className="label">Shipping</span><span className="text-mute">Calculated at checkout</span></div>
                <div className="sum-total mb-3"><span className="t">Total</span><span className="v">{money(cart.subtotal, currencySymbol)}</span></div>
                <Link className="btn btn-accent w-100 mb-2" to="/checkout" style={{ padding: 13 }}>Proceed to Checkout</Link>
                <button className="btn btn-outline-line w-100 border-0 mb-3" onClick={cart.clear}>Clear cart</button>
                <div className="border-top pt-3">
                  <div className="trust-row"><i className="bi bi-shield-check"></i> Secure checkout and protected information</div>
                  <div className="trust-row"><i className="bi bi-truck"></i> Fast delivery across Bangladesh</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
