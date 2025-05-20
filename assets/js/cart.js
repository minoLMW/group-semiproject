const CART_URL = "http://localhost:8080/carts";
const token = localStorage.getItem("token");

// 1) 전체 조회
async function fetchCart() {
  const res = await fetch(CART_URL, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(res.status);
  const items = await res.json();
  console.log(items);
}

// 2) 항목 추가
async function addToCart(iceidx, quantity) {
  const res = await fetch(CART_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ iceidx, quantity })
  });
  return res.json();
}

// 3) 수량 수정
async function updateCart(iceidx, quantity) {
  const res = await fetch(`${CART_URL}/${iceidx}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ quantity })
  });
  return res.json();
}

// 4) 삭제
async function deleteCart(iceidx) {
  const res = await fetch(`${CART_URL}/${iceidx}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
}
