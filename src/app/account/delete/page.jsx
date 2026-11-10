import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import AccountDelete from "@/views/AccountDelete.jsx";
import { privateMetadata } from "@/lib/seo.jsx";

export const metadata = privateMetadata("Delete Account");

export default function Page() {
  return <ProtectedRoute><AccountDelete /></ProtectedRoute>;
}
