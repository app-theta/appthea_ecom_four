import Policy from "@/views/Policy.jsx";
import { excerpt, pageMetadata, siteInfo } from "@/lib/seo.jsx";

export const revalidate = 300;

export async function generateMetadata() {
  const { seo, business } = await siteInfo();
  return pageMetadata({
    title: "Refund Policy",
    description: excerpt(business?.refund_policy) || undefined,
    path: "/refund-policy",
  });
}

export default function RefundPolicyPage() {
  return <Policy field="refund_policy" title="Refund Policy" />;
}
