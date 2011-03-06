
/**
 * Slideshow Global
 */
var SS = null;

// TODO: Rename init()
function handleLoad(data) {
	SS = slidemake3(data);
	show();

	var timer = setInterval(updateClock, 1000*10); // Updates every ten seconds 
	updateClock();

	// Key bindings
	$(document).bind('keydown', 'right', function() { next(); }); 
	$(document).bind('keydown', 'space', function() { next(); });
	$(document).bind('keydown', 'return', function() { next(); });
	$(document).bind('keypress', 'j', function() { next(); }); // Vim-like
	$(document).bind('keypress', 'l', function() { next(); }); // Vim-like

	$(document).bind('keydown', 'left', function() { prev(); }); 
	$(document).bind('keypress', 'backspace', function() { prev(); }); // FIXME
	$(document).bind('keypress', 'k', function() { prev(); }); // Vim-like
	$(document).bind('keypress', 'h', function() { prev(); }); // Vim-like

	// Page Layout
	$(window).resize(function() { $('.presentation').center(); });
};

function next() {
	SS.next();
	show();
	return false;
};

function prev() {
	SS.prev();
	show();
	return false;
};

// TODO: Rename render()
function show() {
	$('.presentation').html(SS.slide().toHtml());

	var h = $('.slide>h1').detach();
	$('#header').html(h);

	// TODO: Move this. 
	$('#page').html('Slide #' + SS.curSlide() + ' of ' + SS.totalSlides());
	
	$('.presentation').center();	
};

function Header() {
	// TODO	

};

function updateClock() {
	var d = new Date();
	function zerofill(n) {
		return (n>9)? n : "0" + n;
	};

	$('#time').html(d.getHours()+':'+zerofill(d.getMinutes()));
};

// From http://stackoverflow.com/questions/210717/what-is-the-best-
// way-to-center-a-div-on-the-screen-using-jquery/210733#210733
jQuery.fn.center = function () {
	this.css("position","absolute");
	this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
	this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
	return this;
};

function loadfile() {
	var file = $(document).getUrlParam('mkd') || 'example.mkd';
	$.ajax({
			url: file,
			dataType: 'text',
			success: function(data) { handleLoad(data); },
	});
};

