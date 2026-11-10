import Blog from "@/views/Blog.jsx";
import { api } from "@/lib/api-server.js";
import { pageMetadata, siteInfo } from "@/lib/seo.jsx";

export const revalidate = 300;

export async function generateMetadata() {
  const { name } = await siteInfo();
  return pageMetadata({ title: "Blog", description: `News, guides and stories from ${name}.`, path: "/blog" });
}

export default async function BlogPage() {
  return <Blog initial={await api.blogs({ page: 1, per_page: 9 })} />;
}
