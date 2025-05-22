import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getSignature(apiKey, apiSecret, timestamp) {
  const space = " ";
  const newLine = "\n";
  const method = "POST";
  const url = "/messages/v4/send";
  const message = method + space + url + newLine + timestamp + newLine + apiKey;
  return crypto.createHmac("sha256", apiSecret).update(message).digest("base64");
}

export async function sendSMS(to) {
  if (!to || typeof to !== 'string' || !to.match(/^01[0-9]{8,9}$/)) {
    throw new Error('유효하지 않은 전화번호 형식입니다.');
  }

  if (!process.env.COOLSMS_API_KEY || !process.env.COOLSMS_API_SECRET || !process.env.COOLSMS_SENDER) {
    throw new Error('SMS 설정이 완료되지 않았습니다.');
  }

  const code = generateCode();

  const apiKey = process.env.COOLSMS_API_KEY;
  const apiSecret = process.env.COOLSMS_API_SECRET;
  const timestamp = Date.now().toString();

  const signature = getSignature(apiKey, apiSecret, timestamp);

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "x-timestamp": timestamp,
    "x-signature": signature,
  };

  const payload = {
    messages: [
      {
        to,
        from: process.env.COOLSMS_SENDER,
        text: `[인증번호] ${code}`,
      },
    ],
  };

  try {
    const res = await axios.post("https://api.coolsms.co.kr/messages/v4/send", payload, { headers });
    console.log("✅ 문자 전송 성공:", res.data);
    return { success: true, code };
  } catch (err) {
    console.error("❌ 문자 전송 실패:", err.response?.data || err.message);
    return { success: false, error: err.response?.data?.message || err.message };
  }
}
