$(document).ready(function () {
  // Sub menu
  // 서브메뉴

  var $header = $(".main-header-bg"),
    $subMenucontainer = $(".sub-menu-container"),
    $lists = $subMenucontainer.find(".sub-menu-list"),
    // 서브메뉴 숨기기
    hideSub = function (removeActive) {
      $subMenucontainer.stop(true).slideUp(200);
      if (removeActive) {
        $header.removeClass("active");
        $header.find(".menu-item a").css("color", "");
      }
    };

  // 헤더 hover 시: 스타일(active)만 적용
  $header.on("mouseenter", function () {
    $header.addClass("active");
    $header.find(".menu-item a").css("color", "");
  });

  // 헤더를 벗어날 때: 서브메뉴가 아닌 곳(서브 container 외부)으로 이동 시 완전 초기화
  $header.on("mouseleave", function (e) {
    var to = e.relatedTarget || e.toElement;
    if (!$(to).closest(".sub-menu-container").length) {
      hideSub(true);
    }
  });

  // 3) 메뉴 아이템 hover 시: 해당 리스트만 표시
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

  // 4) 서브메뉴 container을 벗어날 때
  $subMenucontainer.on("mouseleave", function (e) {
    var to = e.relatedTarget || e.toElement;

    // 헤더 내부로 돌아가면 스타일만 유지, 외부로 나가면 완전 초기화
    if ($(to).closest(".main-header").length) {
      hideSub(false);
    } else {
      hideSub(true);
    }
  });

  // 5) 브라우저 창 자체를 벗어날 때: 완전 초기화
  $(document).on("mouseleave", function (e) {
    if (!e.relatedTarget && !e.toElement) {
      hideSub(true);
    }
  });

  // Search
  // 검색창 버튼

  var $searchOverlay = $(".search-bg-container");

  // 검색 버튼 클릭하면 오버레이 보이기
  $(".search-btn").on("click", function (e) {
    e.preventDefault();
    $searchOverlay.slideDown(200);
    $(".h-search-container").css({
      opacity: 0,
    });
  });

  // 닫기 버튼 클릭하면 오버레이 숨기기
  $(".search-close-btn").on("click", function (e) {
    e.preventDefault();
    $searchOverlay.slideUp(200);
    $(".h-search-container").css({
      opacity: 1,
    });
  });

  // User
  // 유저 버튼

  $userCon = $(".user-btn-container");

  $(".user-btn").on("click", function (e) {
    e.preventDefault();
    if ($userCon.is(":hidden")) {
      $userCon.css("display", "flex").hide().slideDown(200);
    } else {
      $userCon.slideUp(200);
    }
  });

  // searchOverlay와 userCon이 열려있을 때, 다른 곳 클릭 시 닫기
  $(document).on("click", function (e) {
    var $t = $(e.target);

    // 검색 오버레이가 열려 있고, 클릭한 곳이 오버레이나 검색 버튼이 아니면 닫기
    if (
      $searchOverlay.is(":visible") &&
      !$t.closest(".search-bg-container, .search-btn").length
    ) {
      $searchOverlay.slideUp(200);
      $(".h-search-container").css({
        opacity: 1,
      });
    }

    // 유저 컨테이너가 열려 있고, 클릭한 곳이 컨테이너나 유저 버튼이 아니면 닫기
    if (
      $userCon.is(":visible") &&
      !$t.closest(".user-btn-container, .user-btn").length
    ) {
      $userCon.slideUp(200);
    }
  });
});
