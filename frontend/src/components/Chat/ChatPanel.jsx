import { useState, useEffect, useRef } from "react";
import "./ChatPanel.css";
import axios from "axios";
import HistoryPanel from "./HistoryPanel";
import { useAvatar } from "../../avatar/AvatarContext";

export default function ChatPanel() {

  const {
    setAnimation,
    playThinking,
    playTalking,
    playIdle,
  } = useAvatar();

  //------------------------------------------------
  // Default Chat
  //------------------------------------------------

  const defaultMessages = [
    {
      sender: "ai",
      text: "Hello! I am your AI Avatar. How can I help you today?",
    },
  ];

  //------------------------------------------------
  // States
  //------------------------------------------------

  const [messages, setMessages] = useState(defaultMessages);
  const [input, setInput] = useState("");

  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);

  const bottomRef = useRef(null);

  //------------------------------------------------
  // Load History
  //------------------------------------------------

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("chatHistory")) || [];

    setHistory(savedHistory);
  }, []);

  //------------------------------------------------
  // Auto Scroll
  //------------------------------------------------

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  //------------------------------------------------
  // Save Conversation
  //------------------------------------------------

  const saveConversation = (chatMessages) => {

    if (chatMessages.length <= 1) return;

    let updatedHistory = [...history];

    if (currentChatId === null) {

      const newConversation = {
        id: Date.now(),

        title:
          chatMessages.find((m) => m.sender === "user")?.text.substring(0, 30) ||
          "New Chat",

        date: new Date().toLocaleString(),

        messages: chatMessages,
      };

      updatedHistory.unshift(newConversation);

      setCurrentChatId(newConversation.id);

    } else {

      updatedHistory = updatedHistory.map((chat) => {

        if (chat.id === currentChatId) {

          return {
            ...chat,
            messages: chatMessages,
          };

        }

        return chat;

      });

    }

    setHistory(updatedHistory);

    localStorage.setItem(
      "chatHistory",
      JSON.stringify(updatedHistory)
    );

  };

  //------------------------------------------------
  // Send Message
  //------------------------------------------------

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userText = input;
  
    const updatedMessages = [
      ...messages,
      {
        sender: "user",
        text: userText,
      },
    ];
  
    setMessages(updatedMessages);
    setInput("");
  
    // Avatar starts thinking
    setAnimation("Thinking");
  
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/chat",
        {
          message: userText,
        }
      );
  
      const finalMessages = [
        ...updatedMessages,
        {
          sender: "ai",
          text: res.data.reply,
        },
      ];
  
      setMessages(finalMessages);
  
      saveConversation(finalMessages);
  
      // Back to idle
      setAnimation("Idle");
    } catch (err) {
      const finalMessages = [
        ...updatedMessages,
        {
          sender: "ai",
          text: "Backend is not running.",
        },
      ];
  
      setMessages(finalMessages);
  
      saveConversation(finalMessages);
  
      // Back to idle
      setAnimation("Idle");
  
      console.error(err);
    }
  };

  //------------------------------------------------
  // Speech To Text
  //------------------------------------------------

  const startListening = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert("Speech Recognition is not supported.");

      return;

    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = (event) => {

      const speechText =
        event.results[0][0].transcript;

      setInput(speechText);

    };

    recognition.onerror = (event) => {

      console.log(event.error);

    };

  };

  //------------------------------------------------
  // New Chat
  //------------------------------------------------

  const startNewChat = () => {

    setMessages(defaultMessages);

    setCurrentChatId(null);

    setShowHistory(false);

    setAnimation("Idle");

  };

  //------------------------------------------------
  // Load Conversation
  //------------------------------------------------

  const loadConversation = (chat) => {

    setMessages(chat.messages);

    setCurrentChatId(chat.id);

    setShowHistory(false);

  };

  //------------------------------------------------
  // Delete Conversation
  //------------------------------------------------

  const deleteConversation = (id) => {

    const updated =
      history.filter((chat) => chat.id !== id);

    setHistory(updated);

    localStorage.setItem(
      "chatHistory",
      JSON.stringify(updated)
    );

    if (currentChatId === id) {

      startNewChat();

    }

  };

  //------------------------------------------------
  // UI
  //------------------------------------------------

  return (

    <section className="chat-panel">

      <div className="chat-card">

        <div className="chat-header">

          <div className="chat-title">
            💬 AI Assistant
          </div>

          <button
            className="history-btn"
            onClick={() => setShowHistory(true)}
          >
            History
          </button>

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

          <div ref={bottomRef}></div>

        </div>

        <div className="chat-input">

          <button
            className="mic-button"
            onClick={startListening}
          >
            🎤
          </button>

          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {

                sendMessage();

              }

            }}
          />

          <button
            onClick={sendMessage}
          >
            Send
          </button>

        </div>

      </div>

      <HistoryPanel
        showHistory={showHistory}
        history={history}
        loadConversation={loadConversation}
        startNewChat={startNewChat}
        deleteConversation={deleteConversation}
        closeHistory={() => setShowHistory(false)}
      />

    </section>

  );

}