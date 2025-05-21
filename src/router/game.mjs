import express from "express";
import * as gameController from "../controller/game.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

// POST /game/point
router.post("/point", isAuth, gameController.claimGamePoint);

// GET /game/getpoint
router.get("/getpoint", isAuth, gameController.getPoint);

export default router;
