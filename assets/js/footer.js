document.addEventListener("DOMContentLoaded", function () {
	const toggleBtn = document.getElementById("familyToggleBtn");
	const dropdownList = document.getElementById("familySiteList");

	toggleBtn.addEventListener("click", function (e) {
		e.stopPropagation();
		dropdownList.classList.toggle("show");
	});

	
	window.addEventListener("click", function (e) {
		if (!e.target.closest(".family-site-wrapper")) {
			dropdownList.classList.remove("show");
		}
	});
	

});
