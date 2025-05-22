import express from "express";
import * as authController from "../controller/auth.mjs";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";
import { isAuth } from "../middleware/auth.mjs";
import coolsms from 'coolsms-node-sdk';
//const { CoolsmsMessageService } = coolsms;
import { config } from "../../config.mjs";

const router = express.Router();

// 인증번호 저장을 위한 임시 저장소 (실제로는 Redis나 DB 사용 권장)
const verificationCodes = new Map();

// 아이디 조건 통과 -> 비밀번호 조건 통과 -> validate로 통과
const validateLogin = [
  body("userid")
    .trim()
    .isLength({ min: 4 })
    .withMessage("최소 4자 이상 입력")
    .matches(/^[a-zA-Z0-9]*$/)
    .withMessage("특수문자는 사용불가"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("최소 8자 이상 입력"),
  validate,
];

const validateSignup = [
  ...validateLogin,
  body("name").trim().notEmpty().withMessage("이름 입력"),
  body("email").trim().isEmail().withMessage("이메일 형식 확인"),
  body("ph").trim().isMobilePhone().withMessage("전화번호 입력"),
  body("birth").trim().isNumeric().withMessage("생년월일 입력"),
  validate,
];

// 회원가입
router.post("/signup", validateSignup, authController.signup);

// 로그인
router.post("/login", validateLogin, authController.login);

// 로그인 유지
router.get("/me", isAuth, authController.me);

// 인증번호 발송 엔드포인트
router.post("/send-verification", async (req, res) => {
  try {
    const { phone, code } = req.body;
    
    // 전화번호 형식 검증
    const phoneRegex = /^01[0|1|6-9]-?\d{3,4}-?\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "유효하지 않은 전화번호 형식입니다."
      });
    }

    // 인증번호 저장 (3분 유효)
    verificationCodes.set(phone, {
      code: code,
      expires: Date.now() + 3 * 60 * 1000 // 3분
    });

    // CoolSMS 메시지 서비스 초기화 - 수정된 부분
    const messageService = new coolsms.default(
      config.coolsms.apiKey,
      config.coolsms.apiSecret
    );

    // 메시지 전송 - 수정된 부분
    const result = await messageService.sendOne({
      to: phone,
      from: config.coolsms.senderNumber,
      text: `[Bskin Minoo's] 인증번호는 [${code}] 입니다.`
    });

    console.log('SMS 전송 결과:', result); // 디버깅용 로그

    res.status(200).json({ 
      message: "인증번호가 발송되었습니다.",
      result: result
    });
  } catch (error) {
    console.error("인증번호 발송 실패:", error);
    res.status(500).json({ 
      message: "인증번호 발송에 실패했습니다.",
      error: error.message 
    });
  }
});

// 인증번호 확인 엔드포인트 추가
router.post("/verify-code", async (req, res) => {
  try {
    const { phone, code } = req.body;

    // 전화번호로 저장된 인증정보 확인
    const verificationInfo = verificationCodes.get(phone);
    
    if (!verificationInfo) {
      return res.status(400).json({
        message: "인증번호를 먼저 발송해주세요."
      });
    }

    // 만료시간 확인
    if (Date.now() > verificationInfo.expires) {
      verificationCodes.delete(phone);
      return res.status(400).json({
        message: "인증번호가 만료되었습니다. 다시 발송해주세요."
      });
    }

    // 인증번호 확인
    if (verificationInfo.code !== code) {
      return res.status(400).json({
        message: "인증번호가 일치하지 않습니다."
      });
    }

    // 인증 성공
    verificationCodes.delete(phone); // 사용된 인증번호 삭제
    res.status(200).json({
      message: "인증번호가 확인되었습니다.",
      verified: true
    });

  } catch (error) {
    console.error("인증번호 확인 실패:", error);
    res.status(500).json({
      message: "인증번호 확인에 실패했습니다.",
      error: error.message
    });
  }
});

export default router;
