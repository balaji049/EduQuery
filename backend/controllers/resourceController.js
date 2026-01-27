const Resource = require("../models/Resource");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

/* =========================
   UPLOAD RESOURCE (SECURE)
========================= */
exports.uploadResource = async (req, res) => {
  try {
    // 🔐 AUTH HARDENING
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let extractedText = "";

    /* -------------------------
       FILE TYPE HANDLING
    -------------------------- */
    if (ext === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text || "";
    } 
    else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value || "";
    } 
    else if (ext === ".txt") {
      extractedText = fs.readFileSync(filePath, "utf-8");
    } 
    else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Unsupported file type" });
    }

    /* -------------------------
       CONTENT VALIDATION
    -------------------------- */
    if (extractedText.trim().length < 200) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message:
          "File contains no readable text (scanned or unsupported document)."
      });
    }

    /* -------------------------
       SAVE TO DATABASE
    -------------------------- */
    const resource = await Resource.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType: ext,
      content: extractedText,
    });

    return res.status(201).json(resource);

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    // 🧹 CLEANUP ON FAILURE
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({ message: "Upload failed" });
  }
};

/* =========================
   GET ALL RESOURCES (SAFE)
========================= */
exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find()
      .select("-content") // 🔒 Do NOT expose raw content
      .sort({ createdAt: -1 });

    return res.json(resources);
  } catch (error) {
    console.error("FETCH ERROR:", error);
    return res.status(500).json({ message: "Fetch failed" });
  }
};

/* =========================
   DELETE RESOURCE (SECURE)
========================= */
exports.deleteResource = async (req, res) => {
  try {
    // 🔐 AUTH HARDENING
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const filePath = path.join("uploads", resource.filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await resource.deleteOne();

    return res.json({ message: "Resource deleted successfully" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return res.status(500).json({ message: "Delete failed" });
  }
};
