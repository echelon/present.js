/**
 * Convert markdown-formatted text into S5 slideshow slides.
 */
function slidemake(text)
{
	var slides = [];
	var html = '';

	slides = split_into_slides(text);

	for(var i = 0; i < slides.length; i++){
		html += slides[i].toHtml(); 
	};
	return html;
};

/* =============== NON-PUBLIC API FOLLOWS ============= */

/**
 * Represents a markdown slide.
 */
function Slide(markdown)
{
	this._markdown = markdown;
	this._html = '';	

	if(typeof Slide.convert == 'undefined') {
		Slide.convert = new Showdown.converter();
	};

	this.getMarkdown = function() { return this._markdown; };

	this.setMarkdown = function(markdown) {
		this._markdown = markdown;
		this._html = '';
	};

	this.toHtml = function() {
		if(!this._html) {
			this._html = '<div class="slide">';
			this._html += Slide.convert.makeHtml(this._markdown);
			this._html += '</div>';
		}
		return this._html;
	};
};

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
	// XXX: REGEX FAILS UNDER LINUX...
	//var regex = /[\n|\r]{3,}(?=[^\n\r]+[\n|\r]{1,2}={4,})/m;
	var regex = /([\n|\r]{3,}|\n{2,})(?=[^\n\r]+[\n|\r]{1,2}={4,})/m;
	var s = text.split(regex);
	var slides = [];
	for(var i=0; i < s.length; i++) {
		slides.push(new Slide(s[i] + "\n\n"));	
	};
	return slides;
};

