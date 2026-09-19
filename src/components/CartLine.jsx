import { money } from "../utils/format.js";
import { useCart } from "../context/CartContext.jsx";
import { useBusiness } from "../context/BusinessContext.jsx";
import Qty from "./Qty.jsx";

export default function CartLine({ item: p }) {
  const cart = useCart();
  const { currencySymbol } = useBusiness();
  return (
    <div className="cart-line">
      <div className="thumb"><img src={p.image} alt={p.name} /></div>
      <div>
        <p className="name">{p.name}</p>
        <Qty value={p.qty} onChange={(v) => cart.setQty(p.id, v)} />
      </div>
      <div className="d-flex flex-column align-items-end justify-content-between gap-2">
        <button className="line-remove" aria-label="Remove item" onClick={() => cart.remove(p.id)}><i className="bi bi-trash3"></i></button>
        <span className="price">{money(p.total_price ?? p.price * p.qty, currencySymbol)}</span>
      </div>
    </div>
  );
}
