import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import Account from "@/views/Account.jsx";
import { privateMetadata } from "@/lib/seo.jsx";

export const metadata = privateMetadata("My Account");

export default function Page() {
  return <ProtectedRoute><Account /></ProtectedRoute>;
}
