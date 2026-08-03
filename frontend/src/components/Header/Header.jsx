import "./Header.css";

export default function Header() {
  return (
    <header className="header">

      <div className="header-left">
        <div className="logo-icon">
          🤖
        </div>

        <div className="logo-text">
          <h1>Nova AI</h1>
          <p>Your Intelligent Assistant</p>
        </div>
      </div>

      <div className="header-right">
        <span className="online-dot"></span>
        <span>Online</span>
      </div>

    </header>
  );
}