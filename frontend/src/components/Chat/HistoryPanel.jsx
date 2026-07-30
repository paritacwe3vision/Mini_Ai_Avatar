import { useState } from "react";
import "./HistoryPanel.css";

export default function HistoryPanel({
  showHistory,
  history,
  loadConversation,
  startNewChat,
  deleteConversation,
  closeHistory,
}) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  //----------------------------------------------------
  // Rename Chat
  //----------------------------------------------------

  const renameConversation = (id) => {
    const chats =
      JSON.parse(localStorage.getItem("chatHistory")) || [];

    const updated = chats.map((chat) =>
      chat.id === id
        ? {
            ...chat,
            title: newTitle.trim() || chat.title,
          }
        : chat
    );

    localStorage.setItem(
      "chatHistory",
      JSON.stringify(updated)
    );

    window.location.reload();
  };

  //----------------------------------------------------
  // Filter
  //----------------------------------------------------

  const filteredHistory = history.filter((chat) =>
    (chat.title || "New Chat")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      className={`history-sidebar ${
        showHistory ? "show" : ""
      }`}
    >
      {/* Header */}

      <div className="history-header">

        <h2>Chats</h2>

        <button
          className="close-btn"
          onClick={closeHistory}
        >
          ✕
        </button>

      </div>

      {/* Search */}

      <div className="history-search">

        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* New Chat */}

      <button
        className="new-chat-btn"
        onClick={startNewChat}
      >
        ＋ New Chat
      </button>

      {/* Chat List */}

      <div className="history-list">

        {filteredHistory.length === 0 && (
          <div className="empty-history">
            No chats found
          </div>
        )}

        {filteredHistory.map((chat) => (
          <div
            key={chat.id}
            className="history-item"
          >
            <div
              className="history-content"
              onClick={() =>
                loadConversation(chat)
              }
            >
              {editingId === chat.id ? (
                <input
                  autoFocus
                  value={newTitle}
                  onChange={(e) =>
                    setNewTitle(e.target.value)
                  }
                  onBlur={() =>
                    renameConversation(chat.id)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      renameConversation(chat.id);
                    }
                  }}
                />
              ) : (
                <>
                  <div className="history-title">
                    {chat.title}
                  </div>

                  <div className="history-date">
                    {chat.date}
                  </div>
                </>
              )}
            </div>

            <div className="history-actions">
              <button
                title="Rename"
                onClick={() => {
                  setEditingId(chat.id);
                  setNewTitle(chat.title);
                }}
              >
                ✏️
              </button>

              <button
                title="Delete"
                onClick={() =>
                  deleteConversation(chat.id)
                }
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}