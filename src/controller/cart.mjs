import * as cartRepository from "../data/cart.mjs";
// console.log("[DEBUG] cartRepository keys:", Object.keys(cartRepository));

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
