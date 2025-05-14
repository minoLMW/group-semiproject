





















// 로드 페이지 관리
let basePath = location.port === "8080" ? "" : `http://127.0.0.1:${location.port}`;
// Header/Footer 로드
$(".page .header").load(`${basePath}/html/common/header.html?v=${Date.now()}`);
$(".page .footer").load(`${basePath}/html/common/footer.html?v=${Date.now()}`);