import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import MobileNav from "./MobileNav.jsx";
import CartDrawer from "./CartDrawer.jsx";
import MenuDrawer from "./MenuDrawer.jsx";
import QuickView from "./QuickView.jsx";
import { useUI } from "../context/UIContext.jsx";

export default function Layout() {
  const { cartOpen, menuOpen, closeAll } = useUI();
  const { pathname } = useLocation();

  useEffect(() => { window.scrollTo(0, 0); closeAll(); /* eslint-disable-next-line */ }, [pathname]);

  return (
    <>
      <Header />
      <main><Outlet /></main>
      <Footer />
      <MobileNav />
      <div className={"drawer-backdrop" + (cartOpen || menuOpen ? " open" : "")} onClick={closeAll}></div>
      <CartDrawer />
      <MenuDrawer />
      <QuickView />
    </>
  );
}
