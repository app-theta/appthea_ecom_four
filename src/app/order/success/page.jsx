import { Suspense } from "react";
import OrderSuccess from "@/views/OrderSuccess.jsx";
import { privateMetadata } from "@/lib/seo.jsx";

export const metadata = privateMetadata("Order Placed");

export default function Page() {
  return <Suspense><OrderSuccess /></Suspense>;
}
