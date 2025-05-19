import express from "express";
import * as icecreamsController from "../controller/icecream.mjs";

const router = express.Router();

// 모든 아이스크림 가져오기
router.post("/", icecreamsController.createIce);

export default router;
