const CART_URL = "http://localhost:8080/carts";
const token = localStorage.getItem("token");
// 1) 전체 조회
async function fetchCart() {
	const res = await fetch(CART_URL, {
		headers: { "Authorization": `Bearer ${token}` }
	});
	if (!res.ok) throw new Error(res.status);
	return res.json();
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

// ✅ 2. 렌더링 및 이벤트 바인딩
document.addEventListener("DOMContentLoaded", async function () {
	const userid = localStorage.getItem("userid");
	const container = document.getElementById("cartItemsContainer");

	if (!token || !userid) {
		alert("로그인 후 이용해주세요.");
		location.href = "/common/login.html";
		return;
	}

	let nutritionData = [];

	// 1. nutrition JSON 먼저 로딩
	try {
		const nutritionRes = await fetch("/src/json/baskin_robbins_nutrition_generated.json");
		if (!nutritionRes.ok) throw new Error("영양정보 불러오기 실패");
		const nutritionJson = await nutritionRes.json();
		nutritionData = nutritionJson.response.body.items.item;
	} catch (err) {
		console.error("❌ 영양정보 로딩 실패:", err);
		alert("영양정보를 불러올 수 없습니다.");
		return;
	}

	try {
		const cartItems = await fetchCart();

		if (cartItems.length === 0) {
			container.innerHTML = `<p>장바구니가 비어 있습니다.</p>`;
			return;
		}

		container.innerHTML = cartItems.map(item => {
			const matched = nutritionData.find(n => String(n._idx) === String(item.iceidx));
			const bgColor = matched?.bg_color || "#fff";

			return `
				<div class="cart__items--item">
					<img src="${item.icecreamInfo.image_url}" class="cart__items--image" style="background-color: ${bgColor}">
					<div class="cart__items--info">
						<a href="/html/product/P-020.html?_idx=${item.iceidx}" class="cart__items--name">
							${item.icecreamInfo.name}
						</a>
						<p class="cart__items--description">${item.icecreamInfo.description}</p>
						<p class="cart__items--price">${item.totalPrice.toLocaleString()}원</p>
						<div class="cart__items--controls" data-iceidx="${item.iceidx}">
							<button class="cart__items--decrease">-</button>
							<input type="text" value="${item.quantity}" readonly class="cart__items--input"/>
							<button class="cart__items--increase">+</button>
							<button class="cart__items--remove">삭제</button>
						</div>
					</div>
				</div>
			`;
		}).join("");

		// 이후 수량 변경 / 삭제 이벤트 바인딩도 여기에 추가 가능

	} catch (err) {
		console.error("❌ 장바구니 로딩 에러:", err);
		container.innerHTML = `<p>장바구니 정보를 불러오는 데 실패했습니다.</p>`;
	}
});