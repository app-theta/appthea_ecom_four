import { createContext, useContext, useEffect, useState } from "react";

const UIContext = createContext(null);
export const useUI = () => useContext(UIContext);

export function UIProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickView, setQuickView] = useState(null); // product object

  const closeAll = () => { setCartOpen(false); setMenuOpen(false); };

  useEffect(() => {
    const anyOpen = cartOpen || menuOpen || quickView;
    document.body.classList.toggle("no-scroll", !!anyOpen);
    const onKey = (e) => { if (e.key === "Escape") { closeAll(); setQuickView(null); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, menuOpen, quickView]);

  return (
    <UIContext.Provider value={{ cartOpen, setCartOpen, menuOpen, setMenuOpen, quickView, setQuickView, closeAll }}>
      {children}
    </UIContext.Provider>
  );
}
