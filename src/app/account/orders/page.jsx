import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import AccountOrders from "@/views/AccountOrders.jsx";
import { privateMetadata } from "@/lib/seo.jsx";

export const metadata = privateMetadata("My Orders");

export default function Page() {
  return <ProtectedRoute><AccountOrders /></ProtectedRoute>;
}
