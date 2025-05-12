document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("familyToggleBtn");
  const dropdownList = document.getElementById("familySiteList");

  toggleBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdownList.classList.toggle("show");
  });

  // 외부 클릭 시 닫기
  window.addEventListener("click", function (e) {
    if (!e.target.closest(".family-site-wrapper")) {
      dropdownList.classList.remove("show");
    }
  });
});
