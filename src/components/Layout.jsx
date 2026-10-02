import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import MobileNav from "./MobileNav.jsx";
import CartDrawer from "./CartDrawer.jsx";
import MenuDrawer from "./MenuDrawer.jsx";
import QuickView from "./QuickView.jsx";
import NewsletterPopup from "./NewsletterPopup.jsx";
import ChatWidget from "./chat/ChatWidget.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useBusiness } from "../context/BusinessContext.jsx";

export default function Layout() {
  const { cartOpen, menuOpen, closeAll } = useUI();
  const { closed } = useBusiness();
  const { pathname } = useLocation();

  useEffect(() => { window.scrollTo(0, 0); closeAll(); /* eslint-disable-next-line */ }, [pathname]);

  // the API answered 423 - the shop is switched off or its subscription ended
  if (closed) {
    return (
      <main className="section">
        <div className="container-x text-center py-5">
          <i className="bi bi-shop" style={{ fontSize: 44, color: "var(--accent)" }}></i>
          <h1 className="page-title mt-3">We are closed right now</h1>
          <p className="text-mute">The shop is not taking orders at the moment. Please check back later.</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Header />
      <main><Outlet /></main>
      <Footer />
      <MobileNav />
      <ChatWidget />
      <div className={"drawer-backdrop" + (cartOpen || menuOpen ? " open" : "")} onClick={closeAll}></div>
      <CartDrawer />
      <MenuDrawer />
      <QuickView />
      <NewsletterPopup />
    </>
  );
}
