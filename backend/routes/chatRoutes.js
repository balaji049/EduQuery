const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  askQuestion,
  getChatHistory,
  getConversations,
  getConversationById,
  renameConversation,
  deleteConversation,
  togglePinConversation
} = require("../controllers/chatController");


/* ================================
   CONVERSATIONS
================================ */
router.get("/conversations", auth, getConversations);
router.get("/conversation/:id", auth, getConversationById);

/* ================================
   CHAT
================================ */
router.post("/ask", auth, askQuestion);
router.get("/history", auth, getChatHistory);

router.patch("/conversation/:id", auth, renameConversation);
router.delete("/conversation/:id", auth, deleteConversation);
router.patch("/conversation/:id/pin", auth, togglePinConversation);



module.exports = router;
