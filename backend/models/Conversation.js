const mongoose = require("mongoose");

/* ================================
   MESSAGE SCHEMA
================================ */
const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sources: {
    type: [String],
    default: [],
  },
  confidence: {
    type: String,
    default: null,
  },

  // Add inside ConversationSchema fields
pinned: {
  type: Boolean,
  default: false,
  index: true,
},


  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/* ================================
   CONVERSATION SCHEMA
================================ */
const ConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "New Conversation",
    },

    messages: {
      type: [MessageSchema],
      default: [],
    },

    pinned: { type: Boolean, default: false },

    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

/* ================================
   AUTO UPDATE lastMessageAt
   ✅ NO next(), NO async
================================ */
ConversationSchema.pre("save", function () {
  this.lastMessageAt = new Date();
});

module.exports = mongoose.model("Conversation", ConversationSchema);
