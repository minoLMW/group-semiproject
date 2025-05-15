import express from "express";
import * as icecreamsController from  "../controller/icecream.mjs";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";

const router = express.Router();

const validateIcecreams = [
  body("name").trim().isLength({ min: 5 }).withMessage("최소 5자 이상 입력"),
  body("title").trim().isLength({min:1}).withMessage("제목을 적어주세요"),
  validate,
];

// 모든 게시판 가져오기
router.get("/",icecreamsController.getPosts);

export default router;
