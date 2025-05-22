
import express from "express";
import { requestCode, verifyCode } from "../controller/sendsms.mjs";

const router = express.Router();

router.post("/send-code", requestCode);
router.post("/verify-code", verifyCode);

export default router;
