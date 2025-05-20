import express from "express";
import * as gameController from "../controller/game.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

// PATCH /game/point
router.post("/point", isAuth, gameController.claimGamePoint);

export default router;
