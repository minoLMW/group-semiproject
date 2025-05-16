// 유지할 기능: 메인 히어로 리스트 토글, 프로모션 슬라이더, 신규 상품 슬라이더, 브랜드 혜택 슬라이더

var Dt = P(955);

const Ht = () => {
  // 1. 메인 히어로 리스트 토글
  const initHeroToggle = () => {
    const list = i(".main-hero-list");
    const btn = i(".main-hero-list__button");
    const activeClass = "main-hero-list--active";

    if (!list || !btn) return;

    btn.addEventListener("click", () => {
      list.classList.toggle(activeClass);
    });

    // 초기 자동 토글
    setTimeout(() => {
      list.classList.add("main-hero-list--start");
      btn.click();
    }, 100);
  };

  // 2. 프로모션 슬라이더
  const initPromotionSlider = () => {
    new q.ZP(".main-promotion .swiper", {
      modules: [q.tl, q.pt],
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
  };

  // 3. 신규 상품 슬라이더
  const initNewSlider = () => {
    new q.ZP(".main-new .swiper", {
      modules: [q.tl, q.pt],
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
  };

  // 4. 브랜드 혜택 슬라이더
  const initBenefitSlider = () => {
    new q.ZP(".main-br-benefit .swiper", {
      modules: [q.pt],
      slidesPerView: "auto",
      spaceBetween: 28,
      speed: 1600,
      autoplay: { delay: 3000 },
    });
  };

  // 초기화 실행
  initHeroToggle();
  initPromotionSlider();
  initNewSlider();
  initBenefitSlider();
};

// 필요하다면 Ht() 호출
Ht();
