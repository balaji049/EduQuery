const Resource = require("../models/Resource");
const Chat = require("../models/Chat");
const User = require("../models/User");

/* ================================
   ADMIN DASHBOARD STATS
================================ */
exports.getAdminStats = async (req, res) => {
  try {
    // 🔐 AUTH CHECK (FIXED)
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 📊 Fetch stats in parallel
    const [totalResources, questionsAsked, totalUsers] = await Promise.all([
      Resource.countDocuments(),
      Chat.countDocuments(),
      User.countDocuments(),
    ]);

    // 📁 Latest uploaded resource
    const latestResource = await Resource.findOne()
      .sort({ createdAt: -1 })
      .select("createdAt originalName");

    res.json({
      totalResources,
      questionsAsked,
      totalUsers,
      lastUpload: latestResource || null,
    });

  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};
