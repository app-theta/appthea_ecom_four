import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/style.css";

import Providers from "./providers.jsx";
import { getBundle } from "@/lib/api-server.js";
import { SITE_URL, siteInfo } from "@/lib/seo.jsx";
import { themeCss } from "@/theme/websiteTheme.js";

export async function generateMetadata() {
  const { name, seo, business, image } = await siteInfo();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: name, template: `%s | ${name}` },
    description: seo.home_description || undefined,
    applicationName: name,
    icons: business?.favicon ? { icon: business.favicon, apple: business.favicon } : undefined,
    openGraph: { type: "website", siteName: name, locale: "bn_BD", images: image ? [image] : [] },
  };
}

export default async function RootLayout({ children }) {
  const initial = await getBundle();
  // the business's own colours, in the HTML so the first paint already has them
  const css = themeCss(initial.bundle?.business?.theme);

  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {css ? <style id="website-theme" dangerouslySetInnerHTML={{ __html: css }} /> : null}
      </head>
      <body>
        <Providers initial={initial}>{children}</Providers>
      </body>
    </html>
  );
}
