# AppTheta Ecom — React (Vite) version

Ei folder ta static HTML project er full React conversion. Design/CSS ekdom same
(`src/styles/style.css` — ekhane :root er sob color, spacing, font-size token ache).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
npm run preview
```

## Structure

```
index.html                     vite entry
src/main.jsx                   React root + bootstrap/swiper/style css import
src/App.jsx                    react-router route list
src/components/
  Layout.jsx                   Header + Outlet + Footer + MobileNav + drawer gula
  Header.jsx Footer.jsx MobileNav.jsx
  CartDrawer.jsx MenuDrawer.jsx QuickView.jsx
  ProductCard.jsx CartLine.jsx Qty.jsx SliderShell.jsx SectionHead.jsx AccountShell.jsx
src/pages/
  Home.jsx Shop.jsx ProductDetails.jsx Cart.jsx Checkout.jsx
  Login.jsx Register.jsx Account.jsx AccountOrders.jsx AccountAddress.jsx
  AccountProfile.jsx OrderSuccess.jsx TrackOrder.jsx
src/context/
  CartContext.jsx              cart state + localStorage (apptheta_cart_v1)
  UIContext.jsx                cart drawer / menu drawer / quick view state
src/data/site.js               SITE, CATEGORIES, PRODUCTS, money(), findProduct()
public/assets/img/*.svg        placeholder image (apnar asol image diye replace korben)
```

## Routes

`/` · `/shop` · `/product/:id` · `/cart` · `/checkout` · `/login` · `/register`
· `/account` · `/account/orders` · `/account/address` · `/account/profile`
· `/order-success` · `/track-order`

## Notes

- Product / category data `src/data/site.js` theke ase — API bosate chaile
  ei file er export gula fetch diye replace korlei hobe.
- Slider: `swiper/react` (Hot Deal, category, hero, product gallery).
- Cart localStorage e save hoy, header + bottom nav badge auto update.
