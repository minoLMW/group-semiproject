// controller/sendsms.mjs
import { sendSMS } from "../data/sendsms.mjs";
import crypto from "crypto";

// 인증 코드 저장소 (실제 프로덕션에서는 Redis나 DB를 사용하는 것이 좋습니다)
const verificationCodes = new Map();

function getSignature(apiKey, apiSecret, timestamp) {
  const space = " ";
  const newLine = "\n";
  const method = "POST";
  const url = "/messages/v4/send";
  const message = method + space + url + newLine + timestamp + newLine + apiKey;
  return crypto.createHmac("sha256", apiSecret).update(message).digest("base64");
}

export async function requestCode(req, res) {
  try {
    const { phone } = req.body;

    if (!phone || !/^010\d{8}$/.test(phone)) {
      return res.status(400).json({ error: "유효하지 않은 전화번호 형식입니다." });
    }

    const apiKey = process.env.COOLSMS_API_KEY;
    const apiSecret = process.env.COOLSMS_API_SECRET;
    const timestamp = Date.now().toString();

    const signature = getSignature(apiKey, apiSecret, timestamp);

    const headers = {
      Authorization: "Basic " + Buffer.from(`${process.env.COOLSMS_API_KEY}:${process.env.COOLSMS_API_SECRET}`).toString("base64"),
      "Content-Type": "application/json",
    };

    const result = await sendSMS(phone);
    
    if (result.success) {
      // 인증 코드 저장 (3분 유효)
      verificationCodes.set(phone, {
        code: result.code,
        expires: Date.now() + 180000 // 3분
      });
      
      return res.json({ message: "인증번호가 발송되었습니다." });
    } else {
      return res.status(500).json({ error: "인증번호 발송에 실패했습니다." });
    }
  } catch (error) {
    console.error("SMS 인증 요청 오류:", error);
    return res.status(500).json({ error: "인증번호 발송 중 오류가 발생했습니다." });
  }
}

export async function verifyCode(req, res) {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ error: "전화번호와 인증번호를 모두 입력해주세요." });
    }

    const verification = verificationCodes.get(phone);

    if (!verification) {
      return res.status(400).json({ error: "인증번호를 먼저 요청해주세요." });
    }

    if (Date.now() > verification.expires) {
      verificationCodes.delete(phone);
      return res.status(400).json({ error: "인증번호가 만료되었습니다. 다시 요청해주세요." });
    }

    if (verification.code !== code) {
      return res.status(400).json({ error: "인증번호가 일치하지 않습니다." });
    }

    // 인증 성공 시 저장된 코드 삭제
    verificationCodes.delete(phone);
    
    return res.json({ success: true, message: "인증이 완료되었습니다." });
  } catch (error) {
    console.error("SMS 인증 확인 오류:", error);
    return res.status(500).json({ error: "인증 확인 중 오류가 발생했습니다." });
  }
}
