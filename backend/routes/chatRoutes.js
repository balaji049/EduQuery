const router = require("express").Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/chatController");

router.post("/ask", auth, ctrl.askQuestion);
router.get("/conversations", auth, ctrl.getConversations);
router.get("/conversation/:id", auth, ctrl.getConversationById);

module.exports = router;
