import { notFound } from "next/navigation";
import Shop from "@/views/Shop.jsx";
import { api, getBundle } from "@/lib/api-server.js";
import { JsonLd, breadcrumbLd, pageMetadata, siteInfo } from "@/lib/seo.jsx";

async function findCategory(params) {
  const { category } = await params;
  const { bundle } = await getBundle();
  const list = Array.isArray(bundle?.categoryLists) ? bundle.categoryLists : bundle?.categoryLists?.data || [];
  return { slug: category, category: list.find((c) => c.slug === category) || null, loaded: Boolean(bundle) };
}

export async function generateMetadata({ params }) {
  const { category } = await findCategory(params);
  if (!category) return { title: "Category not found", robots: { index: false } };
  const { name } = await siteInfo();
  return pageMetadata({
    title: category.name,
    description: `${category.name} - shop ${category.products_count ? `${category.products_count} ` : ""}products online at ${name}.`,
    path: `/shop/${category.slug}`,
    images: [category.banner_image || category.image],
  });
}

export default async function CategoryPage({ params, searchParams }) {
  const { category, loaded } = await findCategory(params);
  // an unknown slug is a 404 - unless the business list itself failed to load
  if (!category && loaded) notFound();
  const sp = await searchParams;
  const keyword = typeof sp?.keyword === "string" ? sp.keyword.trim() : "";
  const initial = category
    ? await api.products({ keyword: keyword || undefined, category_id: category.id, sort: "latest", per_page: 12, page: 1 })
    : null;

  return (
    <>
      {category && <JsonLd data={breadcrumbLd([["Home", "/"], ["Shop", "/shop"], [category.name, `/shop/${category.slug}`]])} />}
      <Shop initial={initial} />
    </>
  );
}
