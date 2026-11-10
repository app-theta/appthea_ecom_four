import Policy from "@/views/Policy.jsx";
import { excerpt, pageMetadata, siteInfo } from "@/lib/seo.jsx";

export const revalidate = 300;

export async function generateMetadata() {
  const { seo, business } = await siteInfo();
  return pageMetadata({
    title: "Shipping Policy",
    description: excerpt(business?.shipping_policy) || undefined,
    path: "/shipping-policy",
  });
}

export default function ShippingPolicyPage() {
  return <Policy field="shipping_policy" title="Shipping Policy" />;
}
