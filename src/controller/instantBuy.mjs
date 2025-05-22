import { getIcecreams } from "../db/database.mjs";
import * as userRepo from "../data/auth.mjs";

export async function instantBuy(req, res) {
	const { quantity } = req.body;
	const userId = req.user.id;

	try {
		if (!quantity || quantity <= 0) {
			return res.status(400).json({ message: "수량이 유효하지 않습니다." });
		}

		const price = 4500; // ← 고정 가격
		const total = price * quantity;

		const user = await userRepo.findById(userId);
		if (!user || user.point < total) {
			return res.status(400).json({ message: "포인트가 부족합니다." });
		}

		await userRepo.updatePoint(userId, user.point - total);

		res.status(200).json({
			message: "즉시 구매 완료",
			used: total,
			remaining: user.point - total
		});
	} catch (err) {
		console.error("❌ [instantBuy 에러]", err);
		res.status(500).json({ message: "즉시 구매 실패", error: err.message });
	}
}