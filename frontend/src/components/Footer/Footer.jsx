import "./Footer.css";

export default function Footer({ setEmotion }) {

  return (
    <footer className="footer">

      <div className="footer-left">

        <div className="status-ready">
          🟢 Ready
        </div>


        <div className="emotion-list">

          <button onClick={() => setEmotion("Waving")}>
            👋 Neutral
          </button>

          <button onClick={() => setEmotion("Happy")}>
            😊 Happy
          </button>

          <button onClick={() => setEmotion("Thinking")}>
            🤔 Think
          </button>

          <button onClick={() => setEmotion("Sad")}>
            😢 Sad
          </button>

          <button onClick={() => setEmotion("Angry")}>
            😡 Angry
          </button>

          <button onClick={() => setEmotion("Speaking")}>
            🗣 Speak
          </button>

        </div>

      </div>

    </footer>
  );
}
