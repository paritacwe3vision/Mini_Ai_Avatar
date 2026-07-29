import { useState } from "react";
import "./ChatPanel.css";
import axios from "axios";

export default function ChatPanel() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your AI Avatar. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userText = input;
  
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userText,
      },
    ]);
  
    setInput("");
  
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/chat",
        {
          message: userText,
        }
      );
  
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.data.reply,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Backend is not running.",
        },
      ]);
  
      console.error(err);
    }
  };

  return (
    <section className="chat-panel">
      <div className="chat-card">

        <div className="chat-header">
          💬 AI Assistant
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-input">

          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </div>
    </section>
  );
}