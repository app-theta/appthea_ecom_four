import { money } from "../data/site.js";
import { useCart } from "../context/CartContext.jsx";
import Qty from "./Qty.jsx";

export default function CartLine({ item: p }) {
  const cart = useCart();
  return (
    <div className="cart-line">
      <div className="thumb"><img src={p.img} alt={p.name} /></div>
      <div>
        <p className="name">{p.name}</p>
        <Qty value={p.qty} onChange={(v) => cart.setQty(p.id, v)} />
      </div>
      <div className="d-flex flex-column align-items-end justify-content-between gap-2">
        <button className="line-remove" onClick={() => cart.remove(p.id)}><i className="bi bi-trash3"></i></button>
        <span className="price">{money(p.price * p.qty)}</span>
      </div>
    </div>
  );
}
