/**
 * Convert markdown-formatted text into S5 slideshow slides.
 */
function slidemake(text)
{
	var slides = [];
	var html = '';

	slides = split_into_slides(text);
	markdown_slides(slides);
	make_s5_slides(slides);

	for(var i = 0; i < slides.length; i++){
		html += slides[i]; 
	};
	return html;
};

/* =============== NON-PUBLIC API FOLLOWS ============= */

/**
 * Split a markdown document into slides.
 * Separates the document at each "Title".
 */
function split_into_slides(text)
{
	// Split at two or more line breaks (Linux or Win)
	// Lookahead ensures that this occurs only at a title (as 
	// designated by arbitrary title text followed by at least 
	// four underlining ='s on the following line).
	var regex = /[\n|\r]{3,}(?=[^\n\r]+[\n|\r]{1,2}={4,})/m;
	var slides = text.split(regex);
	for(var i=0; i < slides.length; i++) {
		slides[i] += "\n\n";	
	};
	return slides;
};

/**
 * Convert the markdown-formatted 'slides'. 
 */
function markdown_slides(slides) {
	var c = new Showdown.converter();
	for(var i=0; i < slides.length; i++) {
		slides[i] = c.makeHtml(slides[i]);	
	};
};

/**
 * Wrap each slide in S5 slide markup.
 */
function make_s5_slides(slides) {
	for(var i=0; i < slides.length; i++) {
		slides[i] = '<div class="slide">' + slides[i] + '</div>';
	}
};
