import express from "express";
import { instantBuy } from "../controller/instantBuy.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();
router.post("/:iceidx", isAuth, instantBuy);
export default router;