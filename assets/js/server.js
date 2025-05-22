import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import smsRouter from "./router/sendsms.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// JSON 파싱
app.use(express.json());

// 문자 인증 API 연결
app.use("/sms", smsRouter);

// 🔥 signup.html 위치 고정: html/common/signup.html
app.get("/common/signup.html", (req, res) => {
  const htmlPath = path.join(__dirname, "html", "common", "signup.html");
  res.sendFile(htmlPath, (err) => {
    if (err) {
      console.error("❌ HTML 응답 실패:", err);
      res.status(err.statusCode || 500).json({ error: "HTML 파일을 불러올 수 없습니다." });
    }
  });
});

// 정적 JS 파일을 위해 public 폴더 서빙 (signup.js 등)
app.use(express.static(path.join(__dirname, "public")));

app.listen(8080, () => {
  console.log("✅ 서버 실행 중: http://localhost:8080/common/signup.html");
});
