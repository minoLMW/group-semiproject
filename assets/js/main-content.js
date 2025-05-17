// main.js
document.addEventListener("DOMContentLoaded", function () {
  // 1) 메인 히어로 리스트 토글
  (function initHeroToggle() {
    const list = document.querySelector(".main-hero-list");
    const btn = document.querySelector(".main-hero-list__button");
    if (!list || !btn) return;
    const ACTIVE = "main-hero-list--active";
    btn.addEventListener("click", () => {
      list.classList.toggle(ACTIVE);
    });

    // 초기 자동 토글
    setTimeout(() => {
      list.classList.add("main-hero-list--start");
      btn.click();
    }, 100);
  })();

  // 2) 프로모션 슬라이더
  (function initPromotionSlider() {
    const el = document.querySelector(".main-promotion .swiper");
    if (!el) return;
    new Swiper(el, {
      slidesPerView: 5,
      slidesPerGroup: 5,
      spaceBetween: 52,
      speed: 1600,
      autoplay: { delay: 3000 },
      pagination: {
        el: ".main-promotion .swiper-pagination",
        type: "bullets",
        clickable: true,
      },
    });
  })();

  // 3) 신규 상품 슬라이더
  (function initNewSlider() {
    const el = document.querySelector(".main-new .swiper");
    if (!el) return;
    new Swiper(el, {
      slidesPerView: "auto",
      spaceBetween: 52,
      speed: 1600,
      autoplay: { delay: 3000 },
      pagination: {
        el: ".main-new .swiper-pagination",
        type: "bullets",
        clickable: true,
      },
    });
  })();

  // 4) 브랜드 혜택 슬라이더
  (function initBenefitSlider() {
    const el = document.querySelector(".main-br-benefit .swiper");
    if (!el) return;
    new Swiper(el, {
      slidesPerView: "auto",
      spaceBetween: 28,
      speed: 1600,
      autoplay: { delay: 3000 },
    });
  })();
});
