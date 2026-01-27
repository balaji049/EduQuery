const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");

dotenv.config();
connectDB();

const app = express();

/* ================================
   MANUAL CORS (RENDER SAFE)
================================ */
const allowedOrigins = [
  "https://eduquery-frontend.onrender.com",
  "https://eduquery-frontend-hjkb.onrender.com",
  "http://localhost:3000",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

/* ================================
   RATE LIMITER
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

/* ================================
   START SERVER
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
