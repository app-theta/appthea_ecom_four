import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import AccountAddress from "@/views/AccountAddress.jsx";
import { privateMetadata } from "@/lib/seo.jsx";

export const metadata = privateMetadata("Address");

export default function Page() {
  return <ProtectedRoute><AccountAddress /></ProtectedRoute>;
}
