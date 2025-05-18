import express from "express";
import * as postController from "../controller/post.mjs";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

const validatePost = [
  body("text").trim().isLength({ min: 5 }).withMessage("최소 5자 이상 입력"),
  body("title").trim().isLength({min:1}).withMessage("제목을 적어주세요"),
  validate,
];

// 모든 게시판 가져오기
router.get("/",isAuth, postController.getPosts);

// 글번호에 대한 포스트 가져오기
router.get("/:id",isAuth, postController.getPostId);

// 포스트 쓰기
router.post("/",validatePost, isAuth, postController.createPost);

// 포스트 수정하기
router.put("/:id",validatePost, isAuth, postController.updatePost);

// 포스트 삭제하기
router.delete("/:id",isAuth, postController.deletePost);

export default router;
