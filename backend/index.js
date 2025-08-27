require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const libre = require("libreoffice-convert");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Directories
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, "upload");
const outputDir = process.env.OUTPUT_DIR || path.join(__dirname, "files");

// Ensure directories exist
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const fileFilter = (req, file, cb) => {
  const isDocxMime =
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const isDocxExt = path.extname(file.originalname).toLowerCase() === ".docx";

  if (isDocxMime && isDocxExt) return cb(null, true);
  return cb(new Error("Only .docx files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Routes
app.post("/convertFile", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "NoFile",
      message: "No valid file uploaded",
    });
  }

  const inputPath = req.file.path;
  const outputPath = path.join(
    outputDir,
    `${path.parse(req.file.filename).name}.pdf`
  );

  // Convert DOCX → PDF
  let docxBuf;
  try {
    docxBuf = fs.readFileSync(inputPath);
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, error: "ReadError", message: "Failed to read uploaded file" });
  }

  libre.convert(docxBuf, ".pdf", undefined, (err, done) => {
    if (err) {
      console.error("Conversion error:", err);
      // Cleanup uploaded file
      try { fs.unlinkSync(inputPath); } catch {}
      return res.status(500).json({
        success: false,
        error: "ConversionFailed",
        message: "Error converting DOCX to PDF. Please try again later.",
      });
    }

    try {
      fs.writeFileSync(outputPath, done);
    } catch (writeErr) {
      console.error("Write error:", writeErr);
      try { fs.unlinkSync(inputPath); } catch {}
      return res.status(500).json({
        success: false,
        error: "WriteFailed",
        message: "Failed to write converted PDF.",
      });
    }

    // Send the converted file as a download, then cleanup
    res.download(outputPath, "converted.pdf", (downloadErr) => {
      // Cleanup local files after sending (or error)
      try { fs.unlinkSync(inputPath); } catch {}
      try { fs.unlinkSync(outputPath); } catch {}
      if (downloadErr) {
        console.error("Download error:", downloadErr);
        // Can't send another response here because headers are likely sent
      }
    });
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Global error logging
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
