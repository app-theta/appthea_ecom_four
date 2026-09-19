import { Link, NavLink, useLocation } from "react-router-dom";

const MENU = [
  ["Dashboard", "/account"],
  ["Orders", "/account/orders"],
  ["Address", "/account/address"],
  ["Profile", "/account/profile"],
  ["Logout", "/login"]
];

export default function AccountShell({ children }) {
  const { pathname } = useLocation();
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
                <span className="avatar">T</span>
                <div><div className="nm">Tumi Ami</div><div className="ph">3216457980</div></div>
              </div>
              <ul className="acc-menu">
                {MENU.map(([label, to]) => (
                  <li key={to} className={pathname === to ? "active" : ""}>
                    <NavLink to={to} end>{label}</NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-9">{children}</div>
        </div>
      </div>
    </section>
  );
}
