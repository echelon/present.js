
/**
 * Slideshow Global
 */
var SS = null;

function next() {
	SS.next();
	show();
};

function prev() {
	SS.prev();
	show();
};

// TODO: Rename render()
function show() {
	$('.presentation').html(SS.slide().toHtml());

	var h = $('.slide>h1').detach();
	$('#header').html(h);

	// TODO: Move this. 
	$('#footer').html('Slide #' + SS.curSlide() + ' of ' + SS.totalSlides());
	
	$('.presentation').center();	
};

function Header() {
	// TODO	

};
