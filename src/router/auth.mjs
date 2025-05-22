import express from "express";
import * as authController from "../controller/auth.mjs";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";
import { isAuth } from "../middleware/auth.mjs";
import coolsms from 'coolsms-node-sdk';
import { config } from "../../config.mjs";

const router = express.Router();

// 인증번호 저장을 위한 Map (전역 변수로 선언)
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

    // 이전 인증번호가 있다면 삭제
    if (verificationCodes.has(phone)) {
      verificationCodes.delete(phone);
    }

    // 인증번호 저장 (3분 유효)
    verificationCodes.set(phone, {
      code: code,
      expires: Date.now() + 3 * 60 * 1000, // 3분
      attempts: 0 // 인증 시도 횟수 추가
    });

    console.log('저장된 인증번호:', verificationCodes.get(phone)); // 디버깅용

    // CoolSMS 메시지 서비스 초기화
    const messageService = new coolsms.default(
      config.coolsms.apiKey,
      config.coolsms.apiSecret
    );

    // 메시지 전송
    const result = await messageService.sendOne({
      to: phone,
      from: config.coolsms.senderNumber,
      text: `[아이스크림 쇼핑몰] 인증번호는 [${code}] 입니다.`
    });

    // 개발 환경에서만 인증번호 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log('개발 환경 - 인증번호:', code);
    }

    res.status(200).json({ 
      message: "인증번호가 발송되었습니다.",
      code: code // 테스트를 위해 인증번호 반환 (실제 운영시에는 제거)
    });
  } catch (error) {
    console.error("인증번호 발송 실패:", error);
    res.status(500).json({ 
      message: "인증번호 발송에 실패했습니다.",
      error: error.message 
    });
  }
});

// 인증번호 확인 엔드포인트
router.post("/verify-code", async (req, res) => {
  try {
    const { phone, code } = req.body;

    console.log('확인 요청:', { phone, code }); // 디버깅용
    console.log('저장된 인증번호:', verificationCodes.get(phone)); // 디버깅용

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

    // 인증 시도 횟수 확인
    if (verificationInfo.attempts >= 5) {
      verificationCodes.delete(phone);
      return res.status(400).json({
        message: "인증 시도 횟수를 초과했습니다. 다시 발송해주세요."
      });
    }

    // 인증번호 확인
    if (verificationInfo.code.toString() !== code.toString()) {
      verificationInfo.attempts += 1;
      return res.status(400).json({
        message: "인증번호가 일치하지 않습니다.",
        received: code,
        expected: verificationInfo.code
      });
    }

    // 인증 성공
    verificationCodes.delete(phone);
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
