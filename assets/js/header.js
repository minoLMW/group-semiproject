$(document).ready(function () {
  // ── 디버그 로그 & 로그인 환영 메시지 세팅 ──
  console.log('🔥 common-ui.js ready fired');
  const userid = localStorage.getItem('userid');
  console.log('🔥 localStorage.userid →', userid);
  const $welcome = $('.welcome-msg');
  console.log('🔥 .welcome-msg element exists? →', $welcome.length);
  if (userid && $welcome.length) {
    $welcome.text(`환영합니다 ${userid}님`);
    console.log('✅ 환영 메시지 렌더링 완료');
  } else {
    console.warn('⚠️ 환영 메시지 렌더링 조건 미충족');
  }
  // ────────────────────────────────────────────────

  // ── 로그인/로그아웃 버튼만 토글 ──
  const $loginBtn  = $('.btn-login');
  const $joinBtn   = $('.btn-join');
  const $logoutBtn = $('.btn-logout');

  if (userid) {
    // 로그인 상태
    $loginBtn.hide();
    $joinBtn.hide();
    $logoutBtn.show();
    $welcome.show();
  } else {
    // 비로그인 상태
    $logoutBtn.hide();
    $loginBtn.show();
    $joinBtn.show();
    $welcome.hide();
  }
  // ────────────────────────────────────────────────

  const $body   = $('body');
  const $header = $('.main-header-bg');

  // body 클래스가 baskinrobbins-main이 아닐 경우 헤더 항상 active
  if (!$body.hasClass('baskinrobbins-main')) {
    $header.addClass('active');
  }

  // Sub menu
  const $subMenucontainer = $('.sub-menu-container');
  const $lists            = $subMenucontainer.find('.sub-menu-list');

  function hideSub(removeActive) {
    $subMenucontainer.stop(true).slideUp(200);
    if (removeActive && $body.hasClass('baskinrobbins-main')) {
      $header.removeClass('active');
      $header.find('.menu-item a').css('color', '');
    }
  }

  // Header hover
  $header.on('mouseenter', () => {
    $header.addClass('active');
    $header.find('.menu-item a').css('color', '');
  }).on('mouseleave', function (e) {
    const to = e.relatedTarget || e.toElement;
    if (!$(to).closest('.sub-menu-container, .welcome-msg').length) {
      hideSub(true);
    }
  });

  // 환영 메시지 호버 시 헤더 유지
  $welcome.on('mouseenter', () => {
    $header.addClass('active');
  });

  // Menu-item hover
  $('.menu-item').on('mouseenter', function () {
    const idx = $(this).data('sub') - 1;
    $lists.hide().eq(idx).css('display', 'flex');
    if (!$subMenucontainer.is(':visible')) {
      $subMenucontainer.stop(true).slideDown(200);
    }
    $header.addClass('active');
    $header.find('.menu-item a').css('color', '#fff');
    $(this).find('a').css('color', 'var(--text-color-1)');
  });

  // Sub-menu container leave
  $subMenucontainer.on('mouseleave', function (e) {
    const to = e.relatedTarget || e.toElement;
    if ($(to).closest('.main-header, .welcome-msg').length) {
      hideSub(false);
    } else {
      hideSub(true);
    }
  });

  // Document leave
  $(document).on('mouseleave', function (e) {
    if (!e.relatedTarget && !e.toElement) {
      hideSub(true);
    }
  });

  // Search overlay
  const $searchOverlay = $('.search-bg-container');
  $('.search-btn').on('click', function (e) {
    e.preventDefault();
    handleSearch();
  });
  $('.search-close-btn').on('click', function (e) {
    e.preventDefault();
    $searchOverlay.slideUp(200);
    $('.h-search-container').css({ opacity: 1 });
  });

  // User menu toggle
  const $userCon = $('.user-btn-container');
  $('.user-btn').on('click', function (e) {
    e.preventDefault();
    if ($userCon.is(':hidden')) {
      $userCon.css('display', 'flex').hide().slideDown(200);
    } else {
      $userCon.slideUp(200);
    }
  });

  // Click outside to close overlays
  $(document).on('click', function (e) {
    const $t = $(e.target);
    if (
      $searchOverlay.is(':visible') &&
      !$t.closest('.search-bg-container, .search-btn, .welcome-msg').length
    ) {
      $searchOverlay.slideUp(200);
      $('.h-search-container').css({ opacity: 1 });
    }
    if (
      $userCon.is(':visible') &&
      !$t.closest('.user-btn-container, .user-btn, .welcome-msg').length
    ) {
      $userCon.slideUp(200);
    }
  });
});

// Scroll 시 header active 토글 (baskinrobbins-main 페이지에서만 적용)
$(window).on('scroll', function () {
  const $body = $('body');
  if (!$body.hasClass('baskinrobbins-main')) return;
  if ($(this).scrollTop() > 100) {
    $('.main-header-bg').addClass('active');
  } else {
    $('.main-header-bg').removeClass('active');
  }
});

// 기타 helper 함수
function handleSearch() {
  const $searchOverlay = $('.search-bg-container');
  const $hSearch       = $('.h-side-bar .h-search-container');
  $searchOverlay.slideDown(200);
  $hSearch.css({ opacity: 0 });
}
function openBasket() {
  location.href = '/html/common/basket.html';
}
function openCSCenter() {
  location.href = '/html/common/cs-center.html';
}

// ── 로그아웃 처리 함수 ──
function handleLogout() {
  // 1) 로컬스토리지에서 userid 제거
  localStorage.removeItem('userid');
  // 2) 로그아웃 성공 메시지
  alert('로그아웃 성공!');
  // 3) 로그인 전 상태로 돌아가도록 새로고침
  location.reload();
}
