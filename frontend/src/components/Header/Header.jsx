import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        🤖 AI Avatar
      </div>

      <div className="header-status">
        <div className="status-card">🎤 Mic OFF</div>
        <div className="status-card">😴 Idle</div>
        <div className="status-card">😊 Neutral</div>
      </div>
    </header>
  );
}