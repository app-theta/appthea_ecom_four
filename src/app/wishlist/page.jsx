import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import Wishlist from "@/views/Wishlist.jsx";
import { privateMetadata } from "@/lib/seo.jsx";

export const metadata = privateMetadata("Wishlist");

export default function Page() {
  return <ProtectedRoute><Wishlist /></ProtectedRoute>;
}
