$(function() {
	
	function sizeClustergram() {
		var pageHeight = $('.footer').offset().top - $('#navbar-wrapper').outerHeight();
		pageHeight -= 10; // Remove a few pixels for the border.
		$('iframe').css({
			height: pageHeight,
			width: '100%',
			border: 'none'
		});
	}
	
	sizeClustergram();
	$(window).on('resize', sizeClustergram);
});