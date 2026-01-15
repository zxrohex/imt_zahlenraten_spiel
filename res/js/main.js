$.fn.draggable = function(options) {
	// Default settings
	var settings = $.extend({
		handle: null,       // Selector for the handle (optional)
		cursor: 'grabbing', // Cursor to show during drag
		zIndex: 1000,       // Z-index when dragging
		activeClass: 'is-dragging', // Class added to element while dragging
		containment: 'window' // Simple containment logic (optional implementation detail)
	}, options);

	return this.each(function() {
		var $this = $(this);

		// We need to support both Mouse and Touch events
		// This helper normalizes the coordinates
		function getPosition(e) {
			if (e.originalEvent.touches && e.originalEvent.touches.length) {
				return {
					x: e.originalEvent.touches[0].pageX,
					y: e.originalEvent.touches[0].pageY
				};
			}
			return {
				x: e.pageX,
				y: e.pageY
			};
		}

		// Event Handler for Mouse Down / Touch Start
		function startDrag(e) {
			// 1. Check Handle: If a handle is defined, ensure the target is within it
			if (settings.handle) {
				if (!$(e.target).closest(settings.handle).length) {
					return; // Clicked outside the handle
				}


			}

			if ($(e.target).is('button') || $(e.target).parent().is("button")) {
				return;
			}


			// Prevent default behavior (text selection, etc.) except on inputs
			// Note: e.preventDefault() on touchstart can block scrolling, which is intended here
			if (!$(e.target).is('input, textarea, button, select')) {
				e.preventDefault();
			}

			// 2. Capture Initial State
			var pos = getPosition(e);
			var startX = pos.x;
			var startY = pos.y;

			var initialPosition = $this.position();
			var startLeft = initialPosition.left;
			var startTop = initialPosition.top;

			// Visual Feedback
			var originalZIndex = $this.css('z-index');
			var originalCursor = $this.css('cursor');

			$this.css('z-index', settings.zIndex);
			$('body').css('cursor', settings.cursor);
			$this.addClass(settings.activeClass);

			// 3. Define Move Handler
			function performDrag(e) {
				var currentPos = getPosition(e);
				var dx = currentPos.x - startX;
				var dy = currentPos.y - startY;

				$this.css({
					top: startTop + dy,
					left: startLeft + dx
				});
			}

			// 4. Define Stop Handler
			function stopDrag() {
				// Cleanup events
				$(document).off('mousemove touchmove', performDrag);
				$(document).off('mouseup touchend', stopDrag);

				// Reset Visuals
				$this.css('z-index', originalZIndex);
				$('body').css('cursor', '');
				$this.removeClass(settings.activeClass);
			}

			// Bind document-level events to handle fast movement outside the element
			$(document).on('mousemove touchmove', performDrag);
			$(document).on('mouseup touchend', stopDrag);
		}

		$this.on('mousedown touchstart', startDrag);
	});
};

$(function () {
	$(".window").draggable({
		handle: ".window-titlebar",
		zIndex: 2000
	});

	$(window).on("mousemove", function (e) {

	});

	var clockInterval = setInterval(function () {
		var now = new Date();

		$("#tray-clock").text(now.toLocaleTimeString(["de"], {hour: '2-digit', minute:'2-digit'}));
	}, 1000);
});