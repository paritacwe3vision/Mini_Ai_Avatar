import "./MainLayout.css";

import AvatarPanel from "../Avatar/AvatarPanel";
import ChatPanel from "../Chat/ChatPanel";

export default function MainLayout({ emotion }) {
  return (
    <main className="main-layout">
      <AvatarPanel emotion={emotion} />
      <ChatPanel />
    </main>
  );
}