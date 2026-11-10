import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import AccountReturns from "@/views/AccountReturns.jsx";
import { privateMetadata } from "@/lib/seo.jsx";

export const metadata = privateMetadata("Returns");

export default function Page() {
  return <ProtectedRoute><AccountReturns /></ProtectedRoute>;
}
