import * as cartRepository from "../data/cart.mjs";

// 장바구니 전체 조회
export async function getCart(req, res) {
  try {
    const items = await cartRepository.findAllByUser(req.user.id); // user.id = useridx
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "장바구니 조회 실패", error: err.message });
  }
}

// 장바구니 항목 추가
export async function addToCart(req, res) {
  const { iceidx, quantity } = req.body;

  try {
    const item = await cartRepository.increaseQuantityOrInsert(
      req.user, // 전체 user 객체 (user.id, user.userid, user.name 포함)
      iceidx,
      quantity
    );
    res.status(200).json({ message: "장바구니 반영 완료", item });
  } catch (err) {
    res.status(500).json({ message: "장바구니 추가 실패", error: err.message });
  }
}

// 수량 수정
export async function updateCart(req, res) {
  const { iceidx } = req.params;
  const { quantity } = req.body;

  try {
    const updated = await cartRepository.updateQuantity(
      req.user.id,
      iceidx,
      quantity
    );

    if (!updated) {
      return res.status(404).json({ message: "해당 항목을 찾을 수 없습니다." });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "수량 수정 실패", error: err.message });
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
