require("dotenv").config();

const express = require("express");

const multer = require("multer");

const docxToPDF = require("docx-pdf");

const path = require("path");

const fs = require("fs");

const cors = require("cors");

const helmet = require("helmet");



const app = express();

const PORT = process.env.PORT || 3000;



app.use(cors());

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));



const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, "upload");

const outputDir = process.env.OUTPUT_DIR || path.join(__dirname, "files");



if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);



const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, uploadDir);

    },

    filename: function (req, file, cb) {

        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));

    },

});



const fileFilter = (req, file, cb) => {

    if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {

        cb(null, true);

    } else {

        cb(new Error("Only .docx files are allowed"), false);

    }

};



const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit

});



app.post("/convertFile", upload.single("file"), (req, res) => {

    if (!req.file) {

        return res.status(400).json({ success: false, error: "NoFile", message: "No valid file uploaded" });

    }



    const outputPath = path.join(outputDir, `${path.parse(req.file.filename).name}.pdf`);



    docxToPDF(req.file.path, outputPath, (err) => {

        if (err) {

            console.error("Conversion error:", err);

            return res.status(500).json({ success: false, error: "ConversionFailed", message: "Error converting DOCX to PDF. Please try again later." });

        }



        res.download(outputPath, (downloadErr) => {

            if (downloadErr) {

                console.error("Download error:", downloadErr);

            }

        });



        res.on('finish', () => {

            fs.unlink(req.file.path, err => {

                if (err) console.error("Failed to delete uploaded DOCX:", err);

            });

            fs.unlink(outputPath, err => {

                if (err) console.error("Failed to delete converted PDF:", err);

            });

        });

    });

});



app.get('/health', (req, res) => {

    res.status(200).json({ status: "OK" });

});



app.listen(PORT, () => {

    console.log(`🚀 Server running on port ${PORT}`);

});



process.on("unhandledRejection", (reason) => {

    console.error("Unhandled Rejection:", reason);

});



process.on("uncaughtException", (err) => {

    console.error("Uncaught Exception:", err);

    process.exit(1);

});
