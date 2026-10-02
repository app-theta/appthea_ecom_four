import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import AccountShell from "../components/AccountShell.jsx";
import ChatPanel from "../components/chat/ChatPanel.jsx";
import { useChat } from "../context/ChatContext.jsx";

/** The account's chat page - the same conversation as the floating window, with more room. */
export default function AccountChat() {
  const { enabled, setOnPage } = useChat();

  useEffect(() => {
    setOnPage(true);
    return () => setOnPage(false);
  }, [setOnPage]);

  if (!enabled) return <Navigate to="/account" replace />;

  return (
    <AccountShell>
      <ChatPanel variant="page" />
    </AccountShell>
  );
}
