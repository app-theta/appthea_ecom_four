import Shop from "@/views/Shop.jsx";
import { api } from "@/lib/api-server.js";
import { pageMetadata, siteInfo } from "@/lib/seo.jsx";

const keywordOf = (sp) => (typeof sp?.keyword === "string" ? sp.keyword.trim() : "");

export async function generateMetadata({ searchParams }) {
  const keyword = keywordOf(await searchParams);
  const { name } = await siteInfo();
  return pageMetadata({
    title: keyword ? `Search: ${keyword}` : "Shop",
    description: `Browse all products at ${name} - order online with delivery across Bangladesh.`,
    path: "/shop",
    // search results are endless near-duplicates; the plain shop page is the one to index
    noindex: Boolean(keyword),
  });
}

export default async function ShopPage({ searchParams }) {
  const keyword = keywordOf(await searchParams);
  // the same first query the view starts with, so it shows this without asking again
  const initial = await api.products({ keyword: keyword || undefined, sort: "latest", per_page: 12, page: 1 });
  return <Shop initial={initial} />;
}
