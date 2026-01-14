$(function () {
	$(window).on("mousemove", function (e) {
		$(":root").css({
			"--mouse-x": e.clientX + "px",
			"--mouse-y": e.clientY + "px"
		});
	});
});