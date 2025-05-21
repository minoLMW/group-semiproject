$(document).ready(function () {
  // ─────────────────────────────────────────────────────────
  // 0) 항상 active 처리할 페이지 목록 & 플래그
  const alwaysActivePages = [
    '/html/product/P-010.html',
    '/html/main/game.html',
    '/html/common/post.html',
    '/html/history/HI-010.html',
    '/html/main/map.html',
    '/html/common/login.html',
    '/html/common/signup.html',
    'html/common/view.html',
    'html/cart/cart.html',
    'html/product/p-020.html'
  ];
  const path = window.location.pathname;
  const isAlwaysActive = alwaysActivePages.includes(path);

  // 1) 페이지 로드 시, 항상 active 페이지면 바로 클래스 추가
  if (isAlwaysActive) {
    $('.main-header-bg').addClass('active');
  }
  // ─────────────────────────────────────────────────────────

  // Sub menu
  var $header = $(".main-header-bg"),
      $subMenucontainer = $(".sub-menu-container"),
      $lists = $subMenucontainer.find(".sub-menu-list"),

      // 2) hideSub 함수 수정: removeActive && !isAlwaysActive 일 때만 헤더 reset
      hideSub = function (removeActive) {
        $subMenucontainer.stop(true).slideUp(200);
        if (removeActive && !isAlwaysActive) {
          $header.removeClass("active");
          $header.find(".menu-item a").css("color", "");
        }
      };

  // 헤더 hover 시: 스타일(active)만 적용
  $header.on("mouseenter", function () {
    $header.addClass("active");
    $header.find(".menu-item a").css("color", "");
  });

  // 헤더를 벗어날 때: 서브메뉴 아닌 곳으로 이동 시 완전 초기화
  $header.on("mouseleave", function (e) {
    var to = e.relatedTarget || e.toElement;
    if (!$(to).closest(".sub-menu-container").length) {
      hideSub(true);
    }
  });

  // 메뉴 아이템 hover 시: 해당 리스트만 표시
  $(".menu-item").on("mouseenter", function () {
    var i = $(this).data("sub") - 1;
    $lists.hide().eq(i).css("display", "flex");
    if (!$subMenucontainer.is(":visible")) {
      $subMenucontainer.stop(true).slideDown(200);
    }
    $header.addClass("active");
    $header.find(".menu-item a").css("color", "#fff");
    $(this).find("a").css("color", "var(--text-color-1)");
  });

  // 서브메뉴 container 벗어날 때
  $subMenucontainer.on("mouseleave", function (e) {
    var to = e.relatedTarget || e.toElement;
    if ($(to).closest(".main-header").length) {
      hideSub(false);
    } else {
      hideSub(true);
    }
  });

  // 브라우저 창 자체를 벗어날 때: 완전 초기화
  $(document).on("mouseleave", function (e) {
    if (!e.relatedTarget && !e.toElement) {
      hideSub(true);
    }
  });

  // Search
  var $searchOverlay = $(".search-bg-container");

  $(".search-btn").on("click", function (e) {
    e.preventDefault();
    $searchOverlay.slideDown(200);
    $(".h-search-container").css({ opacity: 0 });
  });

  $(".search-close-btn").on("click", function (e) {
    e.preventDefault();
    $searchOverlay.slideUp(200);
    $(".h-search-container").css({ opacity: 1 });
  });

  // User
  var $userCon = $(".user-btn-container");

  $(".user-btn").on("click", function (e) {
    e.preventDefault();
    if ($userCon.is(":hidden")) {
      $userCon.css("display", "flex").hide().slideDown(200);
    } else {
      $userCon.slideUp(200);
    }
  });

  // 외부 클릭 시 searchOverlay, userCon 닫기
  $(document).on("click", function (e) {
    var $t = $(e.target);

    if (
      $searchOverlay.is(":visible") &&
      !$t.closest(".search-bg-container, .search-btn").length
    ) {
      $searchOverlay.slideUp(200);
      $(".h-search-container").css({ opacity: 1 });
    }

    if (
      $userCon.is(":visible") &&
      !$t.closest(".user-btn-container, .user-btn").length
    ) {
      $userCon.slideUp(200);
    }
  });
});

// Scroll 시 header active 토글 (항상 active 페이지는 무시)
$(window).scroll(function () {
  const path = window.location.pathname;
  const alwaysActivePages = [
    '/html/product/P-010.html',
    '/html/main/game.html',
    '/html/common/post.html'
  ];
  if (!alwaysActivePages.includes(path)) {
    if ($(this).scrollTop() > 100) {
      $(".baskinrobbins-main .main-header-bg").addClass("active");
    } else {
      $(".baskinrobbins-main .main-header-bg").removeClass("active");
    }
  }
});

// 기타 helper 함수
function handleSearch() {
  console.log('검색 버튼 클릭');
}
function openBasket() {
  location.href = '/html/common/basket.html';
}
function openCSCenter() {
  location.href = '/html/common/cs-center.html';
}
