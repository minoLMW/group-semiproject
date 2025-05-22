const CART_URL = "http://localhost:8080/carts";
const token = localStorage.getItem("token");

// 공통 API
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

async function fetchUserPoint() {
	const res = await fetch("/auth/me", {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error("사용자 정보 불러오기 실패");
	return res.json();
}

async function purchaseCart(items) {
	const res = await fetch("/carts/purchase", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		},
		body: JSON.stringify({ items })
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.message || "구매 실패");
	return data;
}

document.addEventListener("DOMContentLoaded", async () => {
	const userid = localStorage.getItem("userid");
	const container = document.getElementById("cartItemsContainer");
	const compBtn = document.getElementById("buyBtn");
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
	let mode = "buy";

	try {
		const nutritionRes = await fetch("/src/json/baskin_robbins_nutrition_generated.json");
		if (!nutritionRes.ok) throw new Error("영양정보 불러오기 실패");
		nutritionData = (await nutritionRes.json()).response.body.items.item;
	} catch (err) {
		alert("영양정보를 불러올 수 없습니다.");
		return;
	}

	try {
		cartItems = await fetchCart();
		if (cartItems.length === 0) {
			container.innerHTML = `<p class="cart-items__notresult">장바구니가 비어 있습니다.</p>`;
			return;
		}

		container.innerHTML = cartItems.map((item, index) => {
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
						<a href="/html/product/P-020.html?_idx=${item.iceidx}" class="cart-items__name">${item.icecreamInfo.name}</a>
						<p class="cart-items__description">${item.icecreamInfo.description}</p>
						<p class="cart-items__price">${item.totalPrice.toLocaleString()}원</p>
						<div class="cart-items__controls" data-iceidx="${item.iceidx}" data-price="${item.totalPrice}" data-quantity="${item.quantity}">
							<div class="cart-items__options" style="display: none">
								<button class="cart-items__decrease">-</button>
								<input type="text" value="${item.quantity}" maxlength="2" class="cart-items__input"/>
								<button class="cart-items__increase">+</button>
							</div>
							<button class="cart-items__option">옵션 변경</button>
							<button class="cart-items__remove">삭제</button>
						</div>
					</div>
				</div>
			`;
		}).join("");

		// 삭제 모드 진입
		container.querySelectorAll(".cart-items__remove").forEach(btn => {
			btn.addEventListener("click", () => {
				mode = "delete";
				compBtn.textContent = "삭제 취소하기";
				container.querySelectorAll(".cart-items__item").forEach(item => {
					item.querySelector(".cart-items__controls").style.display = "none";
					item.querySelector(".cart-items__image").classList.add("-delete-anima");
					item.querySelector(".cart-items__check").checked = false;
				});
			});
		});

		// 옵션 변경
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

		// 체크 선택 시 가격 및 버튼 텍스트 갱신
		container.addEventListener("change", () => {
			const checks = container.querySelectorAll(".cart-items__check:checked");
			const total = [...checks].reduce((sum, cb) => {
				const item = cb.closest(".cart-items__item");
				const price = parseInt(item.querySelector(".cart-items__controls").dataset.price);
				return sum + price;
			}, 0);
			const count = checks.length;
			compBtn.textContent = mode === "delete"
				? (count === 0 ? "삭제 취소하기" : `삭제하기 (${count})`)
				: `구매하기 (${count})`;
			productPriceEl.textContent = `${total.toLocaleString()}원`;
			totalPriceEl.textContent = `${total.toLocaleString()}원`;
			discountEl.textContent = `-0원`;
		});

		// 구매 또는 삭제 실행
		compBtn.addEventListener("click", async () => {
			const checked = container.querySelectorAll(".cart-items__check:checked");

			if (mode === "delete") {
				if (compBtn.textContent === "삭제 취소하기") {
					container.querySelectorAll(".cart-items__item").forEach(item => {
						item.querySelector(".cart-items__controls").style.display = "flex";
						item.querySelector(".cart-items__image").classList.remove("-delete-anima");
						item.querySelector(".cart-items__check").checked = false;
					});
					compBtn.textContent = "구매하기 (0)";
					mode = "buy";
					return;
				}

				if (checked.length === 0) return;

				if (confirm("정말 삭제하시겠습니까?")) {
					for (const checkbox of checked) {
						const item = checkbox.closest(".cart-items__item");
						const iceidx = item.querySelector(".cart-items__controls").dataset.iceidx;
						await deleteCart(iceidx);
					}
					location.reload();
				}
				return;
			}

			if (mode === "buy") {
				if (checked.length === 0) return;
			
				const selectedItems = [...checked].map(cb => {
					const item = cb.closest(".cart-items__item");
					const controls = item.querySelector(".cart-items__controls");
					return {
						iceidx: controls.dataset.iceidx,
						quantity: parseInt(controls.dataset.quantity)
					};
				});

				/* 모달 시연용 약 3초 */
				await buyLoadingPopup();
				/* // */
			
				try {
					const result = await purchaseCart(selectedItems);  // ✅ selectedItems 전달
					alert(`✅ 구매 완료!\n사용 포인트: ${result.used.toLocaleString()}P\n남은 포인트: ${result.remaining.toLocaleString()}P`);
					location.reload();
				} catch (err) {
					if (err.message.includes("포인트")) {
						const goGame = confirm("포인트가 부족합니다.\n게임을 통해서 포인트를 획득하세요!");
						if (goGame) location.href = "/html/main/game.html";
					} else {
						alert("구매 중 오류 발생");
					}
				}
			}
		});
	} catch (err) {
		console.error("장바구니 로딩 에러:", err);
		container.innerHTML = `<p>장바구니 정보를 불러오는 데 실패했습니다.</p>`;
	}
});