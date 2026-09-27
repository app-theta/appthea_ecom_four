import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useBusiness } from "../context/BusinessContext.jsx";
import { initials } from "../utils/format.js";

export default function AccountShell({ children }) {
  const { pathname } = useLocation();
  const { customer, logout } = useAuth();
  const { features } = useBusiness();
  const navigate = useNavigate();

  const name = customer ? [customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.name || "Account" : "Account";
  const phone = customer?.phone || customer?.email || "";

  const menu = [
    ["Dashboard", "/account"],
    ["Orders", "/account/orders"],
    ["Returns", "/account/returns"],
    ...(features.user_wishlist ? [["Wishlist", "/wishlist"]] : []),
    ["Address", "/account/address"],
    ["Profile", "/account/profile"],
  ];

  const doLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/login");
  };

  return (
    <section className="section">
      <div className="container-x">
        <nav className="breadcrumb-x"><Link to="/">Home</Link> <span>/</span> <span>My Account</span></nav>
        <div className="page-head">
          <div className="eyebrow">Customer area</div>
          <h1 className="page-title">My Account</h1>
          <p className="text-mute">Manage your profile and review your orders.</p>
        </div>

        <div className="row g-4 mt-2">
          <div className="col-lg-3">
            <div className="acc-side">
              <div className="acc-user">
                <span className="avatar">{initials(name)}</span>
                <div><div className="nm">{name}</div><div className="ph">{phone}</div></div>
              </div>
              <ul className="acc-menu">
                {menu.map(([label, to]) => (
                  <li key={to} className={pathname === to ? "active" : ""}>
                    <NavLink to={to} end>{label}</NavLink>
                  </li>
                ))}
                <li>
                  <a href="/login" onClick={doLogout}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-9">{children}</div>
        </div>
      </div>
    </section>
  );
}
