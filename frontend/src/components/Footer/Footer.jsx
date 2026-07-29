import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-left">

        <div className="status-ready">

          🟢 Ready

        </div>

        <div className="emotion-list">

          😊 Neutral

          😊 Happy

          🤔 Think

          😢 Sad

          🗣 Speak

        </div>

      </div>

      <div className="footer-right">

        <input
          type="text"
          placeholder="Type message..."
        />

        <button>

          ➤

        </button>

        <button>

          🎤

        </button>

      </div>

    </footer>
  );
}