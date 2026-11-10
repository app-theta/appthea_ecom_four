import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import AccountProfile from "@/views/AccountProfile.jsx";
import { privateMetadata } from "@/lib/seo.jsx";

export const metadata = privateMetadata("Profile");

export default function Page() {
  return <ProtectedRoute><AccountProfile /></ProtectedRoute>;
}
