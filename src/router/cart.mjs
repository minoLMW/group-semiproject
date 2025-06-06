import express from "express";
import * as cartController from "../controller/cart.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

// 장바구니 전체 조회
router.get("/", isAuth, cartController.getCart);

// 장바구니 항목 추가
router.post("/", isAuth, cartController.addToCart);

// 장바구니 수량 수정 
router.patch("/:iceidx", isAuth, cartController.updateCart);

// 장바구니 항목 삭제
router.delete("/:iceidx", isAuth, cartController.deleteCart);

// 장바구니 선택 구매
router.post("/purchase", isAuth, cartController.purchaseCart);

// 장바구니 개별 구매 (상세페이지)
router.post("/purchase/:iceidx", isAuth, cartController.buyOneItem);

export default router;
