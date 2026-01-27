const axios = require("axios");
const Resource = require("../models/Resource");
const Chat = require("../models/Chat"); // legacy (optional)
const Conversation = require("../models/Conversation");

/* ======================================================
   ASK QUESTION (CHATGPT STYLE – CONVERSATIONS)
====================================================== */
exports.askQuestion = async (req, res) => {
  try {
    /* 🔐 AUTH */
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { question, conversationId } = req.body;
    const userId = req.user.id;

    if (!question || !question.trim()) {
      return res.end("Please ask a question.");
    }

    let fullAnswer = "";

    /* ===============================
       CONVERSATION HANDLING
    =============================== */
    let conversation = null;

    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId,
      });
    }

    if (!conversation) {
      conversation = await Conversation.create({
        userId,
        title: question.slice(0, 50),
        messages: [],
      });
    }

    // ➕ Save USER message
    conversation.messages.push({
      role: "user",
      content: question,
    });

    await conversation.save();

    /* ===============================
       CONTEXT EXTRACTION
    =============================== */
    const keywords = question
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .split(" ")
      .filter(w => w.length > 2);

    const resources = await Resource.find();
    let paragraphs = [];

    resources.forEach(r => {
      if (!r.content || r.content.length < 200) return;
      const chunks = r.content.match(/(.|[\r\n]){1,1000}/g) || [];
      paragraphs.push(...chunks);
    });

    const ranked = paragraphs
      .map(p => ({
        text: p,
        score: keywords.filter(k => p.toLowerCase().includes(k)).length,
      }))
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score);

    const sources = ranked.slice(0, 2).map(r => r.text);
    const context = sources.join("\n\n").slice(0, 3000);

    const confidence =
      sources.length > 0
        ? "High (Based on uploaded documents)"
        : "Low (Limited document match)";

    /* ===============================
       PROMPT
    =============================== */
    const prompt = `
You are an AI assistant.
Answer ONLY using the provided context.
If the answer is not present, say:
"I could not find this information in the uploaded resources."

Context:
${context}

Question:
${question}

Answer clearly and concisely:
`;

    /* ===============================
       STREAM RESPONSE
    =============================== */
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("X-Conversation-Id", conversation._id.toString());

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      { model: "mistral", prompt, stream: true },
      { responseType: "stream" }
    );

    response.data.on("data", chunk => {
      const lines = chunk.toString().split("\n");
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          if (parsed.response) {
            fullAnswer += parsed.response;
            res.write(parsed.response);
          }
        } catch {
          // ignore malformed chunks
        }
      }
    });

    response.data.on("end", async () => {
      conversation.messages.push({
        role: "assistant",
        content: fullAnswer,
        sources,
        confidence,
      });

      conversation.lastMessageAt = new Date();
      await conversation.save();

      // 🧓 Legacy (optional)
      await Chat.create({
        userId,
        question,
        answer: fullAnswer,
        sources,
        confidence,
      });

      res.end(
        `\n\n---\nConfidence: ${confidence}\n\nSources:\n${sources
          .map((s, i) => `[${i + 1}] ${s.slice(0, 300)}...`)
          .join("\n\n")}`
      );
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "AI processing failed" });
    }
  }
};

/* ======================================================
   LIST ALL CONVERSATIONS (SIDEBAR)
====================================================== */
exports.getConversations = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.json([]);

    

    const conversations = await Conversation.find({ userId: req.user.id })
  .sort({ pinned: -1, lastMessageAt: -1 })
  .select("_id title pinned lastMessageAt");


    res.json(conversations);
  } catch {
    res.json([]);
  }
};

/* ======================================================
   GET SINGLE CONVERSATION
====================================================== */
exports.getConversationById = async (req, res) => {
  try {
    const convo = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!convo) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json(convo);
  } catch {
    res.status(404).json({ message: "Conversation not found" });
  }
};




/* ======================================================
   RENAME CONVERSATION
====================================================== */
exports.renameConversation = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title required" });
    }

    const convo = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title: title.trim() },
      { new: true }
    );

    if (!convo) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json(convo);
  } catch (err) {
    res.status(500).json({ message: "Rename failed" });
  }
};

/* ======================================================
   DELETE CONVERSATION
====================================================== */
exports.deleteConversation = async (req, res) => {
  try {
    const deleted = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};


/* ================================
   PIN / UNPIN CONVERSATION
================================ */
exports.togglePinConversation = async (req, res) => {
  try {
    const convo = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!convo) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    convo.pinned = !convo.pinned;
    await convo.save();

    res.json({ pinned: convo.pinned });
  } catch (err) {
    console.error("PIN ERROR:", err);
    res.status(500).json({ message: "Failed to pin conversation" });
  }
};





/* ======================================================
   LEGACY CHAT HISTORY
====================================================== */
exports.getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(chats);
  } catch {
    res.json([]);
  }
};
