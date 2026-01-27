const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =========================
   REGISTER
========================= */
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // 🔐 Block admin registration when disabled
  if (
    role === "admin" &&
    process.env.ALLOW_ADMIN_REGISTER !== "true"
  ) {
    return res.status(403).json({
      message: "Admin registration is disabled"
    });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role === "admin" ? "admin" : "user"
  });

  res.json({ message: "Registered successfully" });
};



/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    role: user.role,   // ✅ SEND ROLE
    name: user.name,
    email: user.email
  });
};
