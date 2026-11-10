import { SITE_URL, absolute } from "@/lib/seo.jsx";

export default function robots() {
  return {
    rules: [{
      userAgent: "*",
      allow: "/",
      disallow: ["/account","/cart","/checkout","/order/","/wishlist","/login","/register","/forgot-password","/reset-password","/api/"],
    }],
    sitemap: absolute("/sitemap.xml"),
    host: SITE_URL,
  };
}
