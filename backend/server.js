const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");

dotenv.config();
connectDB();

const app = express();

/* ================================
   CORS CONFIG (RENDER SAFE)
================================ */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://eduquery-frontend-hjkb.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* ================================
   RATE LIMITER (CHAT ONLY)
================================ */
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
});

/* ================================
   ROUTES
================================ */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/chat", limiter, require("./routes/chatRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use("/uploads", express.static("uploads"));

/* ================================
   START SERVER
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
