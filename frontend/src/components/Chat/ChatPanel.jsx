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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile,setUploadedFile]=useState(null);

  //------------------------------------------------
    // Avatar Animation Helpers
    //------------------------------------------------

    const playAvatarAnimation = (emotion) => {

        switch (emotion) {

            case "Happy":
                setAnimation("Happy");
                break;

            case "Sad":
                setAnimation("Sad");
                break;

            case "Angry":
                setAnimation("Angry");
                break;

            case "Thinking":
                setAnimation("Thinking");
                break;

            default:
                setAnimation("Speaking");
                break;
        }

    };

    const stopAvatarAnimation = () => {

        setAnimation("Idle");

    };

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
    file: uploadedFile
        ? {
            name: uploadedFile.name,
            size: uploadedFile.size,
            type: uploadedFile.type
        }
        : null,
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
  setUploadedFile(null);
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
    neutral: "Speaking",
    };

    const avatarEmotion =
        emotionMap[(res.data.emotion || "").toLowerCase()] ||
        "Speaking";
        
  // ============================
// Play TTS Audio
// ============================

if (res.data.audio) {

    if (audioRef.current) {

        audioRef.current.pause();
        audioRef.current.currentTime = 0;

    }

    audioRef.current = new Audio(API_URL + res.data.audio);

   // Mute state only
    audioRef.current.muted = isMuted;

    // Start animation when audio actually starts
    audioRef.current.onplay = () => {

        playAvatarAnimation(avatarEmotion);

    };

    // Stop animation when audio finishes
    audioRef.current.onended = () => {

        stopAvatarAnimation();

    };

    // Audio error
    audioRef.current.onerror = (e) => {

        console.error("Audio Error:", e);

        stopAvatarAnimation();

    };

    // Play audio
    audioRef.current.play().catch((err) => {

        console.error(err);

    });

}
else {

    playAvatarAnimation(avatarEmotion);

    setTimeout(() => {

        stopAvatarAnimation();

    }, 2500);

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
  
    setIsThinking(false);

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
    setUploadedFile(null);
    setInput("");
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


    // ======================================================
    // Upload Document
    // ======================================================

    const uploadDocument = async (event) => {

      const file = event.target.files[0];

      if (!file) return;

      setUploadedFile(file);
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {

        const response = await axios.post(
          `${API_URL}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Show uploaded file as a user attachment
        
          setUploadedFile(file);
        // Don't send any prompt automatically.
        // Let the user type their own question.

        // Optional: focus the text box
        document.querySelector(".chat-input-container input")?.focus();

      } catch (err) {

        console.error(err);

        let errorMessage = "Failed to upload document.";

        if (err.response?.data?.detail) {
          errorMessage = err.response.data.detail;
        }

        setMessages(prev => [
          ...prev,
          {
            sender: "ai",
            text: `❌ ${errorMessage}`
          }
        ]);
        setUploadedFile(null);
      } finally {

        setIsUploading(false);

        event.target.value = "";

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

        <div className="chat-icon">
            ✦
        </div>

        <div className="chat-title-text">
            <h2>Nova AI</h2>
            <p>Your Intelligent Assistant</p>
        </div>

</div>

        <div className="chat-actions">

          <button
            className="new-chat-btn"
            onClick={startNewChat}
          >
            + New Chat
          </button>

          <button
            className="history-btn"
            onClick={() => setShowHistory(true)}
          >
            🕘 History
          </button>

          <button
            className="history-btn"
            title={isMuted ? "Unmute" : "Mute"}
            onClick={() => {

              const muted = !isMuted;

              setIsMuted(muted);

              if (audioRef.current) {
                audioRef.current.muted = muted;
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

      <div className="message-wrapper">

        <div
          className={`message ${msg.sender} ${
            msg.loading ? "loading" : ""
          }`}
        >

          {msg.file && (
            <div className="message-file-card">

              <div className="message-pdf-icon">
                📄
              </div>

              <div className="message-file-info">

                <div className="message-file-name">
                  {msg.file.name}
                </div>

                <div className="message-file-size">
                  {msg.file.type === "application/pdf"
                    ? "PDF"
                    : "FILE"
                  }
                  {" • "}
                  {(msg.file.size / 1024 / 1024).toFixed(2)} MB
                </div>

              </div>

            </div>
          )}

          {msg.loading ? (

            <div className="thinking-animation">

              <div className="thinking-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

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

                  if (!inline && match) {

                    return (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    );

                  }

                  return (
                    <code
                      className={className}
                      {...props}
                    >
                      {children}
                    </code>
                  );

                }
              }}
            >
              {msg.text || ""}
            </ReactMarkdown>

          )}

        </div>

      </div>

    </div>
  ))}

  <div ref={bottomRef}></div>

</div>
    {/* ================= Input ================= */}

    <div className="chat-input">

      {/* Selected File Preview */}

      {uploadedFile && (
        <div className="uploaded-file-card">

          <div className="uploaded-file-left">

            <div className="pdf-icon">📄</div>

            <div>
              <div className="uploaded-file-name">
                {uploadedFile.name}
              </div>

              <div className="uploaded-file-type">
                PDF • {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>

          </div>

          <button
            className="remove-file-btn"
            onClick={() => setUploadedFile(null)}
          >
            ✕
          </button>

        </div>
      )}

      <div className="chat-input-container">

        {/* Hidden Upload */}

        <input
          id="file-upload"
          type="file"
          hidden
          accept=".pdf,.doc,.docx"
          onChange={uploadDocument}
        />

        {/* Upload */}

        <button
          type="button"
          className="upload-button"
          disabled={isUploading}
          onClick={() =>
            document.getElementById("file-upload").click()
          }
          title="Upload PDF / DOCX"
        >
          {isUploading ? (
            <span className="spinner"></span>
        ) : (
            "📎"
        )}
        </button>

        {/* Message */}

        <input
          type="text"
          disabled={isThinking || isUploading}
          placeholder={
            isThinking
              ? "Nova is thinking..."
              : uploadedFile
              ? `Ask anything about "${uploadedFile.name}"`
              : "Message Nova..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        {/* Voice */}

        <button
          className={`voice-btn ${
            isRecording ? "recording" : ""
          }`}
          onClick={startListening}
          disabled={isThinking || isUploading}
          title="Voice"
        >
          {isRecording ? "⏹" : "🎤"}
        </button>

        {/* Send */}

        <button
          type="button"
          className="send-btn"
          onClick={() => {
            console.log("SEND BUTTON CLICKED");
            sendMessage();
          }}
          disabled={isThinking || isUploading}
          title="Send"
        >
          ➤
        </button>

      </div>

      <div className="chat-footer">

        <span>
          {uploadedFile
            ? `📄 Selected: ${uploadedFile.name}`
            : "📄 PDF & DOCX Supported"}
        </span>

        <span>
          Press <b>Enter</b> to send
        </span>

      </div>

    </div> {/* chat-input */}

  </div> {/* chat-card */}

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