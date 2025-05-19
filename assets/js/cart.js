// 장바구니 추가
fetch("/cart", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ itemId: "ice123", quantity: 2 }),
});

// 장바구니 수량 수정
fetch("/cart/iceidx", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ quantity: 5 }),
});

// 장바구니 삭제
fetch("/cart/iceidx", {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
