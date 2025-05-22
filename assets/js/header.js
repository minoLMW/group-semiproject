$(document).ready(function () {
  const $body = $('body');
  const $header = $('.main-header-bg');

  // body 클래스가 baskinrobbins-main이 아닐 경우 헤더 항상 active
  if (!$body.hasClass('baskinrobbins-main')) {
    $header.addClass('active');
  }

  // Sub menu
  const $subMenucontainer = $('.sub-menu-container');
  const $lists = $subMenucontainer.find('.sub-menu-list');

  function hideSub(removeActive) {
    $subMenucontainer.stop(true).slideUp(200);
    // removeActive && body 클래스가 main일 때만 active 제거
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
    if (!$(to).closest('.sub-menu-container').length) {
      hideSub(true);
    }
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
    if ($(to).closest('.main-header').length) {
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
    $searchOverlay.slideDown(200);
    $('.h-search-container').css({ opacity: 0 });
  });
  $('.search-close-btn').on('click', function (e) {
    e.preventDefault();
    $searchOverlay.slideUp(200);
    $('.h-search-container').css({ opacity: 1 });
  });

  // User menu
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
    if ($searchOverlay.is(':visible') && !$t.closest('.search-bg-container, .search-btn').length) {
      $searchOverlay.slideUp(200);
      $('.h-search-container').css({ opacity: 1 });
    }
    if ($userCon.is(':visible') && !$t.closest('.user-btn-container, .user-btn').length) {
      $userCon.slideUp(200);
    }
  });
});

// Scroll 시 header active 토글 (baskinrobbins-main 페이지에서만 적용)
$(window).on('scroll', function () {
  const $body = $('body');
  // main 페이지에만 스크롤 토글 적용
  if (!$body.hasClass('baskinrobbins-main')) return;
  if ($(this).scrollTop() > 100) {
    $('.main-header-bg').addClass('active');
  } else {
    $('.main-header-bg').removeClass('active');
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
