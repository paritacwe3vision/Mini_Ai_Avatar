import { useState, useEffect, useRef } from "react";
import "./ChatPanel.css";
import axios from "axios";
import HistoryPanel from "./HistoryPanel";
import { useAvatar } from "../../avatar/AvatarContext";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const API_URL = "http://127.0.0.1:8000";
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
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const bottomRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
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
const sendMessage = async (customMessage = null) => {
    if (isThinking) return;
    const userText = customMessage || input.trim();
    if (!userText) return;
  // User message
  const userMessage = {
    sender: "user",
    text: userText,
  };
  // Temporary AI thinking bubble
  const thinkingMessage = {
    sender: "ai",
    text: "Thinking...",
    loading: true,
  };
  const updatedMessages = [
    ...messages,
    userMessage,
    thinkingMessage,
  ];
  setMessages(updatedMessages);
  setInput("");
  setIsThinking(true);
  // Avatar Thinking Animation
  setAnimation("Thinking");
  try {
    const res = await axios.post(
      `${API_URL}/chat`,
      {
        message: userText,
      }
    );
    // Remove thinking bubble
    const finalMessages = [
      ...updatedMessages.slice(0, -1),
      {
        sender: "ai",
        text: res.data.reply,
      },
    ];
    setMessages(finalMessages);
    saveConversation(finalMessages);

    // Emotion returned from backend
    const emotion = res.data.emotion;

    // Play emotion animation
    switch (emotion) {

      case "happy":
        setAnimation("Happy");
        break;

      case "sad":
        setAnimation("Sad");
        break;

      case "angry":
        setAnimation("Angry");
        break;

      case "thinking":
        setAnimation("Thinking");
        break;

      default:
        setAnimation("Idle");
    }

    // Stop thinking state
    setIsThinking(false);

    // After 3 seconds return to idle
    setTimeout(() => {
        setAnimation("Idle");
    }, 3000);



  } catch (err) {
    // Remove thinking bubble
    const finalMessages = [
      ...updatedMessages.slice(0, -1),
      {
        sender: "ai",
        text:
          "⚠️ I couldn't reach the backend ",
      },
    ];
    setMessages(finalMessages);
    saveConversation(finalMessages);
    setAnimation("Idle");
    setIsThinking(false);
    console.error(err);
  }
};
  //------------------------------------------------
  // Speech To Text
  //------------------------------------------------
 const startListening = async () => {
  if (isThinking) return;

  if (isRecording) {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
    },
});
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(
        audioChunksRef.current,
        {
          type: "audio/webm",
        }
      );
      const formData = new FormData();
      formData.append(
        "file",
        audioBlob,
        "speech.webm"
      );
      try {
        // Speech → Text
        const speechResponse = await axios.post(
          `${API_URL}/speech`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const transcript = speechResponse.data.text;
        if (transcript) {
         //setInput(transcript);
         // Send automatically
          sendMessage(transcript);
        }
      } catch (err) {
        console.error(err);
      }
      stream.getTracks().forEach((track) => track.stop());
    };
    mediaRecorder.start(250);
    setIsRecording(true);
  } catch (err) {
    console.error(err);
    alert("Unable to access microphone.");
  }
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
                    className={`message ${msg.sender} ${msg.loading ? "loading" : ""}`}
                  >
                    {msg.loading ? (
                      <div className="thinking-animation">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span className="thinking-text">
                          Thinking...
                        </span>
                      </div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({
                            inline,
                            className,
                            children,
                            ...props
                          }) {
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    )}
                  </div>
                ))}
                <div ref={bottomRef}></div>
              </div>
        <div className="chat-input">
          <button
            disabled={isThinking}
            className={`mic-button ${isRecording ? "recording" : ""}`}
            onClick={startListening}
          >
                {
        isRecording
            ? "⏹ Stop"
            : "🎤 Speak"
    }
          </button>
          <input
            disabled={isThinking}
            type="text"
            placeholder={
                isThinking
                    ? "Thinking..."
                    : "Type your message..."
            }
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
            disabled={isThinking}
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