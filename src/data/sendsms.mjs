
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendSMS(to) {
  const code = generateCode();

  const payload = {
    messages: [
      {
        to,
        from: process.env.COOLSMS_SENDER,
        text: `[인증번호] ${code}`,
      },
    ],
  };

  const headers = {
    Authorization: "Basic " + Buffer.from(`${process.env.COOLSMS_API_KEY}:${process.env.COOLSMS_API_SECRET}`).toString("base64"),
    "Content-Type": "application/json",
  };

  try {
    const res = await axios.post("https://api.coolsms.co.kr/messages/v4/send", payload, { headers });
    console.log("✅ 문자 전송 성공:", res.data);
    return code;
  } catch (err) {
    console.error("❌ 문자 전송 실패:", err.response?.data || err.message);
    return null;
  }
}
