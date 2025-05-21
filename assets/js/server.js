require("dotenv").config();
const express = require("express");
const sendSMS = require("./sendsms");
const Redis = require("ioredis");
const path = require("path");

const app = express();
const redis = new Redis(); // 기본: localhost:6379

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/common/signup.html"));
});

// 전화번호 유효성 검사
function isValidPhone(phone) {
  return /^010\d{8}$/.test(phone);
}

// 인증요청
app.post("/send-code", async (req, res) => {
  const { phone } = req.body;
  if (!phone || !isValidPhone(phone)) {
    return res.status(400).json({ error: "잘못된 전화번호입니다." });
  }

  // 🔒 1분 재요청 제한
  const cooldown = await redis.get(`cooldown:${phone}`);
  if (cooldown) {
    return res.status(429).json({ error: "1분 후에 다시 요청해주세요." });
  }

  // 🔒 하루 10회 이상 요청 제한
  const dayLimitKey = `limit:${phone}`;
  const currentCount = parseInt(await redis.get(dayLimitKey)) || 0;
  if (currentCount >= 10) {
    return res.status(429).json({ error: "하루 최대 요청 횟수를 초과했습니다." });
  }

  // 인증번호 생성 및 전송
  const code = await sendsms(phone);
  if (!code) {
    return res.status(500).json({ error: "문자 전송 실패" });
  }

  // Redis에 저장
  await redis.setex(`code:${phone}`, 180, code);               // 인증번호 3분 유효
  await redis.setex(`cooldown:${phone}`, 60, "1");             // 1분 쿨다운
  await redis.incr(dayLimitKey);                               // 요청 횟수 증가
  await redis.expire(dayLimitKey, 86400);                      // 하루 1회 제한 (24시간)

  // 시도 횟수 초기화
  await redis.set(`attempts:${phone}`, 0, "EX", 180); // 3분 동안 초기화

  res.json({ message: "인증번호가 전송되었습니다." });
});

// 인증확인
app.post("/verify-code", async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: "전화번호와 인증번호가 필요합니다." });
  }

  const saved = await redis.get(`code:${phone}`);
  const attemptsKey = `attempts:${phone}`;
  const attempts = parseInt(await redis.get(attemptsKey)) || 0;

  // 🔒 인증번호 만료됨
  if (!saved) {
    return res.status(410).json({ error: "인증번호가 만료되었거나 존재하지 않습니다." });
  }

  // 🔒 시도 횟수 초과
  if (attempts >= 5) {
    return res.status(429).json({ error: "인증 실패 5회 초과. 다시 요청하세요." });
  }

  // ✅ 인증 성공
  if (saved === code) {
    await redis.del(`code:${phone}`);
    await redis.del(`attempts:${phone}`);
    return res.json({ message: "인증 성공!" });
  }

  // ❌ 인증 실패
  await redis.set(attemptsKey, attempts + 1, "EX", 180);
  return res.status(400).json({
    error: `인증 실패 (${attempts + 1}/5). 다시 시도해주세요.`,
  });
});

app.listen(8080, () => {
  console.log("서버 실행 중 http://localhost:8080");
});
