// controller/sendsms.mjs
import Redis from "ioredis";
import { sendSMS } from "../data/sendsms.mjs";

const redis = new Redis();

export async function requestCode(req, res) {
  const { phone } = req.body;

  if (!/^010\d{8}$/.test(phone)) {
    return res.status(400).json({ error: "전화번호 형식이 올바르지 않습니다." });
  }

  const cooldown = await redis.get(`cooldown:${phone}`);
  if (cooldown) {
    return res.status(429).json({ error: "1분 뒤에 다시 시도해주세요." });
  }

  const limitKey = `limit:${phone}`;
  const count = parseInt(await redis.get(limitKey)) || 0;
  if (count >= 10) {
    return res.status(429).json({ error: "하루 요청 횟수를 초과했습니다." });
  }

  const code = await sendSMS(phone);
  if (!code) return res.status(500).json({ error: "문자 전송 실패" });

  await redis.setex(`code:${phone}`, 180, code);
  await redis.setex(`cooldown:${phone}`, 60, "1");
  await redis.incr(limitKey);
  await redis.expire(limitKey, 86400);
  await redis.set(`attempts:${phone}`, 0, "EX", 180);

  res.json({ message: "인증번호가 전송되었습니다." });
}

export async function verifyCode(req, res) {
  const { phone, code } = req.body;

  const saved = await redis.get(`code:${phone}`);
  const attemptsKey = `attempts:${phone}`;
  const attempts = parseInt(await redis.get(attemptsKey)) || 0;

  if (!saved) {
    return res.status(410).json({ error: "인증번호가 만료되었습니다." });
  }

  if (attempts >= 5) {
    return res.status(429).json({ error: "5회 이상 실패. 다시 요청해주세요." });
  }

  if (saved === code) {
    await redis.del(`code:${phone}`);
    await redis.del(`attempts:${phone}`);
    return res.json({ message: "인증 성공!" });
  }

  await redis.set(attemptsKey, attempts + 1, "EX", 180);
  res.status(400).json({ error: `인증 실패 (${attempts + 1}/5)` });
}
