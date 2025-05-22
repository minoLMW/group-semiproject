import express from "express";
import * as gameController from "../controller/game.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

// POST /game/point
router.post("/point", isAuth, gameController.claimGamePoint);

// POST /game/end
router.post("/game/end", isAuth,gameController.resetGame);  // 게임 종료 및 초기화


export default router;
