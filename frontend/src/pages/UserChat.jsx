import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";

export default function UserChat() {
  const token = localStorage.getItem("token");

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [search, setSearch] = useState("");

  const bottomRef = useRef(null);

  /* =========================
     LOAD CONVERSATIONS
  ========================= */
  const loadConversations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/chat/conversations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch {
      setConversations([]);
    }
  };

  /* =========================
     LOAD SINGLE CONVERSATION
  ========================= */
  const loadConversation = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/chat/conversation/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setActiveConversation(data._id);
      setMessages(data.messages || []);
    } catch {
      setMessages([]);
    }
  };

  /* =========================
     RENAME
  ========================= */
  const renameConversation = async (id) => {
    await fetch(`http://localhost:5000/api/chat/conversation/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title: editTitle })
    });

    setEditingId(null);
    loadConversations();
  };

  /* =========================
     DELETE
  ========================= */
  const deleteConversation = async (id) => {
    if (!window.confirm("Delete this conversation?")) return;

    await fetch(`http://localhost:5000/api/chat/conversation/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (activeConversation === id) {
      setActiveConversation(null);
      setMessages([]);
    }

    loadConversations();
  };

  /* =========================
     NEW CHAT
  ========================= */
  const newChat = () => {
    setActiveConversation(null);
    setMessages([]);
    setQuestion("");
  };

  /* =========================
     ASK QUESTION
  ========================= */
  const askQuestion = async () => {
    if (!question.trim() || loading) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: question }]);

    try {
      const response = await fetch("http://localhost:5000/api/chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          question,
          conversationId: activeConversation
        })
      });

      const convoId =
        response.headers.get("X-Conversation-Id") || activeConversation;

      if (!activeConversation && convoId) {
        setActiveConversation(convoId);
        loadConversations();
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value);

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = aiText;
          return updated;
        });
      }

      setQuestion("");
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Failed to fetch answer." }
      ]);
    } finally {
      setLoading(false);
      loadConversations();
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }
    loadConversations();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="h-[calc(100vh-70px)] flex bg-[#F3F4F4] text-[#061E29]">

        {/* SIDEBAR */}
        <aside className="w-80 bg-[#0B2A3B] text-white border-r border-[#1D546D]/40 p-4 overflow-y-auto hidden md:block">

          <button
            onClick={newChat}
            className="w-full mb-3 py-2 rounded-lg bg-[#1D546D] hover:bg-[#163F52] transition"
          >
            + New Chat
          </button>

          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 px-3 py-2 rounded-lg bg-[#F3F4F4] text-[#061E29] text-sm placeholder-[#5F9598] outline-none"
          />

          {filteredConversations.map((c) => (
            <div
              key={c._id}
              onClick={() => loadConversation(c._id)}
              className={`group p-3 mb-2 rounded-lg cursor-pointer transition ${
                activeConversation === c._id
                  ? "bg-[#1D546D]"
                  : "hover:bg-[#1D546D]/40"
              }`}
            >
              {editingId === c._id ? (
                <input
                  value={editTitle}
                  autoFocus
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => renameConversation(c._id)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && renameConversation(c._id)
                  }
                  className="w-full text-sm bg-[#F3F4F4] text-[#061E29] rounded px-2 py-1"
                />
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-sm truncate flex-1">{c.title}</p>

                  <div className="opacity-0 group-hover:opacity-100 flex gap-2 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(c._id);
                        setEditTitle(c.title);
                      }}
                      className="text-xs text-[#5F9598]"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(c._id);
                      }}
                      className="text-xs text-red-400"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* CHAT */}
        <main className="flex-1 flex flex-col p-6">

          <div className="flex-1 bg-[#F8FAFC] border border-black/10 rounded-xl p-6 overflow-y-auto">

            {messages.length === 0 && !loading && (
              <div className="h-full flex items-center justify-center text-[#5F9598] text-sm">
                Ask a question from uploaded resources
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-4 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-4 rounded-lg max-w-[75%] whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#1D546D] text-white"
                      : "bg-[#E6EFF2] text-[#061E29]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-sm text-[#5F9598] animate-pulse">
                AI is thinking...
              </p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="mt-4 flex gap-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askQuestion()}
              className="flex-1 border border-black/10 rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-[#1D546D]"
              placeholder="Ask your question..."
              disabled={loading}
            />

            <button
              onClick={askQuestion}
              disabled={loading}
              className={`px-6 py-3 rounded-lg text-white transition ${
                loading
                  ? "bg-gray-400"
                  : "bg-[#1D546D] hover:bg-[#163F52]"
              }`}
            >
              {loading ? "Thinking..." : "Ask"}
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
