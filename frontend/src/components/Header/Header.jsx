import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-icon">
          <span className="logo-symbol">✦</span>
        </div>

        <div className="logo-text">
          <h1>Nova AI</h1>
          <p>Your Intelligent Assistant</p>
        </div>
      </div>

      <div className="header-right">
        <div className="status-badge">
          <span className="online-dot"></span>
          <span className="status-text">Online</span>
        </div>
      </div>
    </header>
  );
}