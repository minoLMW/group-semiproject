
function buyLoadingPopup(time = 3) {
	return new Promise(resolve => {
		const duration = time * 1000;

		const existing = document.querySelector('.modal');
		if (existing) existing.remove();

		document.body.classList.add('lock');

		const modalHTML = `
			<div class="modal">
				<div class="modal__dim"></div>
				<div class="motion-box">
					<div class="motion-box__dim"></div>
					<div class="motion-box__bill">
						<div class="inner">$</div>
					</div>
					<div class="motion-box__shredder">
						<div class="bar"></div>
					</div>
					<p class="motion-box__text">잠시만 기다려주세요...</p>
				</div>
			</div>
		`;

		const container = document.createElement('div');
		container.innerHTML = modalHTML;
		document.body.appendChild(container.firstElementChild);

		const textBase = '잠시만 기다려주세요';
		const target = document.querySelector('.motion-box__text');
		let dotCount = 0;
		const maxDots = 3;

		const loadingInterval = setInterval(() => {
			dotCount = (dotCount % maxDots) + 1;
			const dots = '.'.repeat(dotCount);
			target.textContent = `${textBase}${dots}`;
		}, 500);

		setTimeout(() => {
			clearInterval(loadingInterval);
			const modal = document.querySelector('.modal');
			if (modal) modal.remove();
			document.body.classList.remove('lock');
			resolve();
		}, duration);
	});
}

document.addEventListener('keypress', function(event) {
	if (event.keyCode === 10) {
		document.body.classList.toggle('dark-mode');
	}
});

// 로드 페이지 관리
let basePath = location.port === "8080" ? "" : `http://127.0.0.1:${location.port}`;
// Header/Footer 로드
$(".page .header").load(`${basePath}/html/common/header.html?v=${Date.now()}`);
$(".page .footer").load(`${basePath}/html/common/footer.html?v=${Date.now()}`);