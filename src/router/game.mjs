import express from "express";
import * as gameController from "../controller/game.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

// POST /game/point - 포인트 획득
router.post("/point", isAuth, gameController.claimGamePoint);

// GET /game/point - 포인트 조회
router.get("/point", isAuth, gameController.getPoint);

export default router;
