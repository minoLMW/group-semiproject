import * as cartRepository from "../data/cart.mjs";
import * as userRepository from "../data/auth.mjs"
// console.log("[DEBUG] cartRepository keys:", Object.keys(cartRepository));
import { ObjectId } from "mongodb";
import { getIcecreams } from "../db/database.mjs";

// 장바구니 전체 조회
export async function getCart(req, res) {
  try {
    const items = await cartRepository.findAllByUser(req.user.id);
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "장바구니 조회 실패", error: err.message });
  }
}

// 장바구니 항목 추가 또는 수량 누적 (메뉴에서 사용)
export async function addToCart(req, res) {
	const { iceidx, quantity, name } = req.body;
	console.log("🔻 요청 바디:", req.body);
	try {
		const item = await cartRepository.addOrIncrease(
			req.user,
			iceidx,
			quantity,
			req.user.name
		);
		res.status(200).json({ message: "장바구니 반영 완료", item });
	} catch (err) {
		console.error("❌ 장바구니 추가 실패:", err);
		res.status(400).json({ message: "장바구니 추가 실패", error: err.message });
	}
}
  

// 장바구니 수량 수정 (장바구니 페이지에서 사용)
export async function updateCart(req, res) {
  const { iceidx } = req.params;
  const { quantity } = req.body;
  try {
    await cartRepository.updateQuantity(
      req.user.id,
      iceidx,
      quantity
    );
    res.status(200).json({ message: "수정 완료" });
  } catch (err) {
    res.status(500).json({ message: "수정 실패", error: err.message });
  }
}

// 장바구니 항목 삭제
export async function deleteCart(req, res) {
  const { iceidx } = req.params;
  try {
    await cartRepository.deleteByUserAndIce(req.user.id, iceidx);
    res.status(200).json({ message: "삭제 완료" });
  } catch (err) {
    res.status(500).json({ message: "삭제 실패", error: err.message });
  }
}

// 장바구니 선택 구매
export async function purchaseCart(req, res) {
	try {
		const userId = req.user.id;
		const { items } = req.body;

		if (!items || !Array.isArray(items) || items.length === 0) {
			return res.status(400).json({ message: "선택된 항목이 없습니다." });
		}

		const user = await userRepository.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "사용자 정보를 찾을 수 없습니다." });
		}

		let total = 0;
		for (const item of items) {
			const cartItem = await cartRepository.findOne(userId, item.iceidx);
			if (!cartItem || !cartItem.totalPrice || !cartItem.quantity) {
				console.warn("❗️누락된 항목:", item);
				continue;
			}
			const unitPrice = cartItem.totalPrice / cartItem.quantity;
			total += unitPrice * item.quantity;
		}

		if (user.point < total) {
			return res.status(400).json({ message: "포인트가 부족합니다.\n게임을 통해 포인트를 획득하세요!" });
		}

		await userRepository.updatePoint(userId, user.point - total);
		for (const item of items) {
			await cartRepository.deleteByUserAndIce(userId, item.iceidx);
		}

		res.status(200).json({
			message: "구매 완료",
			used: total,
			remaining: user.point - total
		});
	} catch (err) {
		console.error("❌ 서버 오류:", err);
		res.status(500).json({ message: "구매 실패", error: err.message });
	}
}
  
// 장바구니 개별 구매
export async function buyOneItem(req, res) {
	const { quantity } = req.body;
	const userId = req.user.id;

	try {
		const qty = parseInt(quantity);
		if (!qty || qty <= 0) {
			return res.status(400).json({ message: "수량이 유효하지 않습니다." });
		}

		const user = await userRepository.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "사용자 정보를 찾을 수 없습니다." });
		}

		const pricePerItem = 4500;
		const total = pricePerItem * qty;

		if (user.point < total) {
			return res.status(400).json({ message: "포인트가 부족합니다." });
		}

		await userRepository.updatePoint(userId, user.point - total);

		res.status(200).json({
			message: "바로구매 완료",
			used: total,
			remaining: user.point - total
		});
	} catch (err) {
		res.status(500).json({ message: "바로구매 실패", error: err.message });
	}
}