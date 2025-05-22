/*require("dotenv").config();
const axios = require("axios");

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendsms(to) {
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
    Authorization:
      "Basic " +
      Buffer.from(
        `${process.env.COOLSMS_API_KEY}:${process.env.COOLSMS_API_SECRET}`
      ).toString("base64"),
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(
      "https://api.coolsms.co.kr/messages/v4/send",
      payload,
      { headers }
    );

    console.log("✅ 문자 전송 성공:", response.data);
    return code;
  } catch (error) {
    console.error("❌ 문자 전송 실패:", error.response?.data || error.message);
    return null;
  }
}

module.exports = sendsms;*/