import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import AccountChat from "@/views/AccountChat.jsx";
import { privateMetadata } from "@/lib/seo.jsx";

export const metadata = privateMetadata("Chat");

export default function Page() {
  return <ProtectedRoute><AccountChat /></ProtectedRoute>;
}
