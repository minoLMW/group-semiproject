import * as cartRepository from "../data/cart.mjs";
import * as userRepository from "../data/auth.mjs"
// console.log("[DEBUG] cartRepository keys:", Object.keys(cartRepository));
import { ObjectId } from "mongodb";
import { signup } from "./auth.mjs";
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
  const { iceidx, quantity } = req.body;
  try {
    const item = await cartRepository.addOrIncrease(
      req.user,
      iceidx,
      quantity
    );
    res.status(200).json({ message: "장바구니 반영 완료", item });
  } catch (err) {
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

// 장바구니 전체 구매
export async function purchaseCart(req, res) {
	const userId = req.user.id;
  
	try {
	  const cartItems = await cartRepository.findAllByUser(userId);
	  if (!cartItems.length) {
		return res.status(400).json({ message: "장바구니가 비어있습니다." });
	  }
  
	  const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
	  const user = await userRepository.findById(userId);
  
	  if (user.point < total) {
		return res.status(400).json({ message: "포인트가 부족합니다.\n게임을 통해 포인트를 획득하세요!"});
	  }
  
	  await userRepository.updatePoint(userId, user.point - total);
	  await cartRepository.clearCart(userId);
  
	  res.status(200).json({
		message: "구매 완료",
		used: total,
		remaining: user.point - total
	  });
	} catch (err) {
	  res.status(500).json({ message: "구매 실패", error: err.message });
	}
}
  
// 장바구니 개별 구매
export async function buyOneItem(req, res) {
  const { iceidx } = req.params;
  const { quantity } = req.body;

  try {
    const result = await cartRepository.purchaseOneItem(
      req.user,
      iceidx,
      Number(quantity)
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: "개별 구매 실패", error: err.message });
  }
}