import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import AccountOrderDetail from "@/views/AccountOrderDetail.jsx";
import { privateMetadata } from "@/lib/seo.jsx";

export const metadata = privateMetadata("Order Details");

export default function Page() {
  return <ProtectedRoute><AccountOrderDetail /></ProtectedRoute>;
}
