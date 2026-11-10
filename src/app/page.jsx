import Home from "@/views/Home.jsx";
import { api, getBundle } from "@/lib/api-server.js";
import { JsonLd, organizationLd, pageMetadata, siteInfo } from "@/lib/seo.jsx";

export const revalidate = 120;

// the page heading for search engines and screen readers - the design itself shows none
const srOnly = { position: "absolute", width: 1, height: 1, margin: -1, padding: 0, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 };

export async function generateMetadata() {
  const { seo, name } = await siteInfo();
  return pageMetadata({
    title: seo.og_title || name,
    absoluteTitle: true,
    description: seo.home_description || seo.og_description,
    keywords: seo.home_keywords,
    path: "/",
  });
}

export default async function HomePage() {
  const { bundle } = await getBundle();
  const { name, business } = await siteInfo();
  const features = bundle?.business?.features || {};
  // a section the store switched off is neither fetched nor shown (same rule as the view)
  const [summary, campaigns, hotDeals] = await Promise.all([
    api.homeSummary(),
    features.enable_campaign ? api.campaigns() : null,
    features.enable_hotdeal_product ? api.hotDeals() : null,
  ]);

  return (
    <>
      <JsonLd data={organizationLd(business, name)} />
      <h1 style={srOnly}>{name}</h1>
      <Home initial={{ summary, campaigns, hotDeals }} />
    </>
  );
}
