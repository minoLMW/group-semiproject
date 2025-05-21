const CART_URL = "http://localhost:8080/carts";
const token = localStorage.getItem("token");

// 공통 API 함수
async function fetchCart() {
	const res = await fetch(CART_URL, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error(res.status);
	return res.json();
}
async function deleteCart(iceidx) {
	const res = await fetch(`${CART_URL}/${iceidx}`, {
		method: "DELETE",
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.json();
}
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

// 사용자 포인트 가져오기
async function fetchUserPoint() {
	const res = await fetch("/auth/me", {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error("사용자 정보 불러오기 실패");
	return res.json();
}

// 구매 API 호출
async function purchaseCartItems(purchaseList) {
	const res = await fetch(`${CART_URL}/purchase`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		},
		body: JSON.stringify({ items: purchaseList })
	});
	if (!res.ok) throw new Error("구매 실패");
	return res.json();
}

// DOMContentLoaded 실행
document.addEventListener("DOMContentLoaded", async function () {
	const userid = localStorage.getItem("userid");
	const container = document.getElementById("cartItemsContainer");
	const buyBtn = document.getElementById("buyBtn");
	const totalPriceEl = document.querySelector(".summary-total span:last-child");
	const productPriceEl = document.querySelector(".summary-item span:last-child");
	const discountEl = document.querySelector(".summary-item .discount");

	if (!token || !userid) {
		alert("로그인 후 이용해주세요.");
		location.href = "/common/login.html";
		return;
	}

	let nutritionData = [];
	let cartItems = [];
	let deleteMode = false;

	try {
		const nutritionRes = await fetch("/src/json/baskin_robbins_nutrition_generated.json");
		if (!nutritionRes.ok) throw new Error("영양정보 불러오기 실패");
		nutritionData = (await nutritionRes.json()).response.body.items.item;
	} catch (err) {
		console.error("❌ 영양정보 로딩 실패:", err);
		alert("영양정보를 불러올 수 없습니다.");
		return;
	}

	try {
		cartItems = await fetchCart();
		if (cartItems.length === 0) {
			container.innerHTML = `<p class="cart-items__notresult">장바구니가 비어 있습니다.</p>`;
			return;
		}

		container.innerHTML = cartItems
			.map((item, index) => {
				const matched = nutritionData.find(n => String(n._idx) === String(item.iceidx));
				const bgColor = matched?.bg_color || "#fff";
				const checkboxId = `cart-check-${index}`;

				return `
					<div class="cart-items__item">
						<div class="cart-items__checkeds">
							<input type="checkbox" id="${checkboxId}" class="cart-items__check hide">
							<label for="${checkboxId}" class="cart-items__checkbox"></label>
						</div>
						<img src="${item.icecreamInfo.image_url}" class="cart-items__image" style="background-color: ${bgColor}">
						<div class="cart-items__info">
							<a href="/html/product/P-020.html?_idx=${item.iceidx}" class="cart-items__name">
								${item.icecreamInfo.name}
							</a>
							<p class="cart-items__description">${item.icecreamInfo.description}</p>
							<p class="cart-items__price">${item.totalPrice.toLocaleString()}원</p>
							<div class="cart-items__controls" data-iceidx="${item.iceidx}" data-price="${item.totalPrice}" data-quantity="${item.quantity}">
								<div class="cart-items__options" style="display: none">
									<button class="cart-items__decrease">-</button>
									<input type="text" value="${item.quantity}" readonly class="cart-items__input"/>
									<button class="cart-items__increase">+</button>
								</div>
								<button class="cart-items__option">옵션 변경</button>
								<button class="cart-items__remove">삭제</button>
							</div>
						</div>
					</div>
				`;
			})
			.join("");

		// 삭제 모드 진입 처리
		container.querySelectorAll(".cart-items__remove").forEach(btn => {
			btn.addEventListener("click", () => {
				deleteMode = true;
				buyBtn.textContent = "삭제 취소하기";

				container.querySelectorAll(".cart-items__item").forEach(item => {
					item.querySelector(".cart-items__controls").style.display = "none";
					item.querySelector(".cart-items__image").classList.add("-delete-anima");
					item.querySelector(".cart-items__check").checked = false;
				});
			});
		});

		// 옵션 변경 이벤트 바인딩
		container.querySelectorAll(".cart-items__option").forEach(btn => {
			btn.addEventListener("click", async () => {
				const item = btn.closest(".cart-items__item");
				const controls = item.querySelector(".cart-items__controls");
				const options = item.querySelector(".cart-items__options");
				const iceidx = controls.dataset.iceidx;
				const input = options.querySelector(".cart-items__input");
				const decreaseBtn = options.querySelector(".cart-items__decrease");
				const increaseBtn = options.querySelector(".cart-items__increase");

				let quantity = parseInt(input.value);
				if (isNaN(quantity)) quantity = 1;

				if (options.style.display === "none") {
					options.style.display = "flex";
					decreaseBtn.onclick = () => {
						if (quantity > 1) quantity--;
						input.value = quantity;
					};
					increaseBtn.onclick = () => {
						quantity++;
						input.value = quantity;
					};
				} else {
					options.style.display = "none";
					await updateCart(iceidx, quantity);
					alert("수량이 변경되었습니다.");
					location.reload();
				}
			});
		});

		container.addEventListener("change", (e) => {
			const checks = container.querySelectorAll(".cart-items__check:checked");
			const total = [...checks].reduce((sum, cb) => {
				const item = cb.closest(".cart-items__item");
				const price = parseInt(item.querySelector(".cart-items__controls").dataset.price);
				return sum + price;
			}, 0);
			const count = checks.length;
			buyBtn.textContent = deleteMode ? (count === 0 ? "삭제 취소하기" : `삭제하기 (${count})`) : `구매하기 (${count})`;
			productPriceEl.textContent = `${total.toLocaleString()}원`;
			totalPriceEl.textContent = `${total.toLocaleString()}원`;
			discountEl.textContent = `-0원`;
		});

		buyBtn.addEventListener("click", async () => {
			const checked = container.querySelectorAll(".cart-items__check:checked");

			if (deleteMode) {
				if (checked.length === 0) {
					container.querySelectorAll(".cart-items__item").forEach(item => {
						item.querySelector(".cart-items__controls").style.display = "flex";
						item.querySelector(".cart-items__image").classList.remove("-delete-anima");
						item.querySelector(".cart-items__check").checked = false;
					});
					buyBtn.textContent = "구매하기 (0)";
					deleteMode = false;
					return;
				}
				if (confirm("정말 삭제하시겠습니까?")) {
					try {
						for (const checkbox of checked) {
							const item = checkbox.closest(".cart-items__item");
							const iceidx = item.querySelector(".cart-items__controls").dataset.iceidx;
							await deleteCart(iceidx);
						}
						alert("선택한 상품이 삭제되었습니다.");
						location.reload();
					} catch (err) {
						console.error("삭제 실패:", err);
						alert("삭제 중 오류 발생");
					}
				}
			} else {
				if (checked.length === 0) return;
				const selectedItems = [...checked].map(cb => {
					const item = cb.closest(".cart-items__item");
					const controls = item.querySelector(".cart-items__controls");
					return {
						iceidx: controls.dataset.iceidx,
						quantity: parseInt(controls.dataset.quantity),
						price: parseInt(controls.dataset.price)
					};
				});

				const totalPrice = selectedItems.reduce((sum, i) => sum + i.price, 0);

				try {
					const user = await fetchUserPoint();
					if (user.point < totalPrice) {
						alert("포인트가 모자랍니다.\n카드게임을 하여 포인트를 획득하세요");
						location.href = "/html/main/game.html";
						return;
					}
					const result = await purchaseCartItems(selectedItems);
					alert("구매가 완료되었습니다.");
					location.reload();

				} catch (err) {
					console.error("구매 실패:", err);
					if (err.message?.includes("포인트")) {
						alert("포인트가 모자랍니다.\n카드게임을 하여 포인트를 획득하세요");
						location.href = "/html/main/game.html";
					} else {
						alert("구매 중 오류 발생");
					}
				}
			}
		});

	} catch (err) {
		console.error("❌ 장바구니 로딩 에러:", err);
		container.innerHTML = `<p>장바구니 정보를 불러오는 데 실패했습니다.</p>`;
	}
});
