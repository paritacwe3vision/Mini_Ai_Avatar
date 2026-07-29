import "./MainLayout.css";

import AvatarPanel from "../Avatar/AvatarPanel";
import ChatPanel from "../Chat/ChatPanel";

export default function MainLayout() {
  return (
    <main className="main-layout">
      <AvatarPanel />
      <ChatPanel />
    </main>
  );
}