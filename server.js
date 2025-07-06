// ✅ .env 사용 설정
require("dotenv").config();

const express = require("express");
const multer = require("multer");
const { Dropbox } = require("dropbox");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const port = 3000;

// ✅ CORS 허용
app.use(cors());

// ✅ multer 설정 (메모리에 저장)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Dropbox 연결 (env에서 토큰 불러옴)
const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_TOKEN,
  fetch: fetch
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileName = `voice_memos/voice_${new Date().toISOString().replace(/[:.]/g, "-")}.webm`;

    console.log(`Uploading to Dropbox: ${fileName}`);

    await dbx.filesUpload({
      path: `/${fileName}`,
      contents: req.file.buffer,
      mode: { ".tag": "add" }
    });

    console.log("✅ Upload successful!");
    res.status(200).send("Upload complete!");
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send("Upload failed");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server listening at http://localhost:${port}`);
});

const path = require("path");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});

