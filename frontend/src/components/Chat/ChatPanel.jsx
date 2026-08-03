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
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
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
    
    const emotionMap = {
      happy: "Happy",
      sad: "Sad",
      angry: "Angry",
      thinking: "Thinking",
      neutral: "Idle",
    };
    
    const avatarEmotion =
      emotionMap[res.data.emotion] || "Idle";
    
    // ============================
// Play TTS Audio
// ============================

if (res.data.audio) {

    // Stop previous audio if it's still playing
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }

    // Create new audio object
    audioRef.current = new Audio(
        API_URL + res.data.audio
    );

    // Avatar starts speaking
    audioRef.current.onplay = () => {
        setAnimation("Speaking");
    };

    // Avatar returns to idle
    audioRef.current.onended = () => {
        setAnimation("Idle");
    };

    // Audio error
    audioRef.current.onerror = (e) => {
        console.error("Audio Error:", e);
    };

    // Play only if NOT muted
    if (!isMuted) {

        audioRef.current.play().catch((err) => {
            console.error("Unable to play audio:", err);
        });

    }

}

// Debug
console.log("Backend Emotion:", res.data.emotion);
console.log("Avatar Animation:", avatarEmotion);
    
    // Remove thinking bubble
    const finalMessages = [
      ...updatedMessages.slice(0, -1),
      {
        sender: "ai",
        text: res.data.reply,
        emotion: res.data.emotion,
      },
    ];
    
    setMessages(finalMessages);
    
    saveConversation(finalMessages);
    
    // Play emotion animation
    setAnimation(avatarEmotion);
    console.log("Sending animation:", avatarEmotion);
    
    setIsThinking(false);

/* 
// Emotion duration
const emotionDuration = {
  Happy: 10000,
  Sad: 10000,
  Angry: 30000,
  Thinking: 5000,
  Idle: 0,
};


// If emotion exists
if (avatarEmotion !== "Idle") {

  setAnimation(avatarEmotion);

  setTimeout(() => {

    // After emotion reaction
    setAnimation("Speaking");

      }, emotionDuration[avatarEmotion]);


    } 
    else {

      // No emotion detected
      setAnimation("Speaking");

    }


    // Return to idle after 10 seconds
    setTimeout(() => {

      setAnimation("Idle");

    }, 10000);
 */
    // // Emotion returned from backend
    // const emotion = res.data.emotion;

    // // Play emotion animation
    // switch (emotion) {

    //   case "happy":
    //     setAnimation("Happy");
    //     break;

    //   case "sad":
    //     setAnimation("Sad");
    //     break;

    //   case "angry":
    //     setAnimation("Angry");
    //     break;

    //   case "thinking":
    //     setAnimation("Thinking");
    //     break;

    //   default:
    //     setAnimation("Idle");
    // }

    // // Stop thinking state
    // setIsThinking(false);

    // // After 3 seconds return to idle
    // setTimeout(() => {
    //     setAnimation("Idle");
    // }, 3000);

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

      {/* ================= Header ================= */}

      <div className="chat-header">

        <div className="chat-title">
          <span className="chat-icon">💬</span>

          <div>
            <h2>Nova AI</h2>
            <p>Your intelligent assistant</p>
          </div>
        </div>

        <div className="chat-actions">

          <button
            className="new-chat-btn"
            onClick={startNewChat}
          >
            ＋ New Chat
          </button>

          <button
    className="history-btn"
    onClick={() => {

        const muted = !isMuted;

        setIsMuted(muted);

        console.log("Muted:", muted);

        if (audioRef.current) {

            if (muted) {

                // Pause immediately
                audioRef.current.pause();

            } else {

                // Resume speaking
                audioRef.current.play().catch(err => {
                    console.error(err);
                });

            }

        }

    }}
>
    {isMuted ? "🔇" : "🔊"}
</button>

        </div>

      </div>

      {/* ================= Messages ================= */}

      <div className="chat-messages">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`message-row ${msg.sender}`}
          >
            <div
              className={`message ${msg.sender} ${
                msg.loading ? "loading" : ""
              }`}
            >

              {msg.loading ? (

                <div className="thinking-animation">

                  <span></span>
                  <span></span>
                  <span></span>

                  <span className="thinking-text">
                    Nova is thinking...
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
                      const match = /language-(\w+)/.exec(
                        className || ""
                      );

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
                        <code
                          className={className}
                          {...props}
                        >
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

          </div>

        ))}

        <div ref={bottomRef}></div>

      </div>
  
      {/* ================= Input ================= */}

      <div className="chat-input">

  <div className="chat-input-container">

    {/* Hidden File Input */}
    <input
      id="file-upload"
      type="file"
      hidden
      accept=".pdf,.doc,.docx"
      onChange={(e) => {
        console.log(e.target.files);
      }}
    />

    {/* Upload */}
    <button
      type="button"
      className="upload-button"
      onClick={() =>
        document.getElementById("file-upload").click()
      }
      title="Upload PDF or DOCX"
    >
      📎
    </button>

    {/* Text */}
    <input
      disabled={isThinking}
      type="text"
      placeholder={
        isThinking
          ? "Nova is thinking..."
          : "Ask Nova anything..."
      }
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") sendMessage();
      }}
    />

    {/* Mic */}
    <button
      className={`voice-btn ${isRecording ? "recording" : ""}`}
      onClick={startListening}
      disabled={isThinking}
      title="Speak"
    >
      {isRecording ? "⏹" : "🎤"}
    </button>

    {/* Send */}
    <button
      className="send-btn"
      onClick={sendMessage}
      disabled={isThinking}
      title="Send"
    >
      ➜
    </button>

  </div>

  <div className="upload-hint">
      Supports <b>PDF</b> and <b>DOCX</b> files
  </div>

</div>
</div>
    {/* ================= History ================= */}

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