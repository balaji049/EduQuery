const Resource = require("../models/Resource");
const Chat = require("../models/Chat");
const Conversation = require("../models/Conversation");
const askCloudflare = require("../services/cloudflareAI");

/* ===============================
   ASK QUESTION
================================ */
exports.askQuestion = async (req, res) => {
  try {
    const { question, conversationId } = req.body;
    const userId = req.user.id;

    if (!question) {
      return res.status(400).json({ message: "Question required" });
    }

    let conversation = null;

    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId });
    }

    if (!conversation) {
      conversation = await Conversation.create({
        userId,
        title: question.slice(0, 50),
        messages: []
      });
    }

    conversation.messages.push({ role: "user", content: question });

    /* ========= Context ========= */
    const resources = await Resource.find();

    let context = resources
      .map(r => r.content)
      .join("\n")
      .slice(0, 3000);

    const prompt = `
Answer ONLY using this context:

${context}

Question: ${question}
`;

    /* ========= AI Call ========= */
    const answer = await askCloudflare(prompt);

    conversation.messages.push({
      role: "assistant",
      content: answer
    });

    await conversation.save();

    await Chat.create({
      userId,
      question,
      answer
    });

    res.json({
      answer,
      conversationId: conversation._id
    });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =============================== */
exports.getConversations = async (req, res) => {
  const list = await Conversation.find({ userId: req.user.id })
    .sort({ updatedAt: -1 });
  res.json(list);
};

exports.getConversationById = async (req, res) => {
  const convo = await Conversation.findById(req.params.id);
  res.json(convo);
};
