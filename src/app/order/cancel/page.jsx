import { Suspense } from "react";
import OrderCancel from "@/views/OrderCancel.jsx";
import { privateMetadata } from "@/lib/seo.jsx";

export const metadata = privateMetadata("Payment Cancelled");

export default function Page() {
  return <Suspense><OrderCancel /></Suspense>;
}
