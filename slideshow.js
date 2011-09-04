// XXX: No UI in this file. Define slideshow.ui.js

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
	// XXX: REGEX FAILS UNDER LINUX/WINDOWS LINE ENDING DISAGREEMENT
	// FIXME/VERIFY: Line ending encoding may fail when switching 
	// platforms during editing a file. It happened to me when I 
	// thought I was prepared! Fix and verify fixed.
	var regex = /[\n|\n\r]{2,}(?=[^\n|\r]+[\n|\r]{1,2}={4,})/m;
	var s = text.split(regex);
	return s;
};

/**
 * TODO: Backbone Port
 */
var Slide = Backbone.Model.extend({

	initialize: function(attrs)
	{
		var parseSlide, slide;

		if(typeof Slide.convert == 'undefined') {
			Slide._convert = new Showdown.converter();
		}

		parseSlide = function(markdown) {
			var regex, matches, ret;
			regex = /([^\n|\r]+)[\n|\r]{1,2}={4,}/m;
			ret = {'title': '', 'slide': ''};
			matches = markdown.match(regex);
			if(!matches) {
				return ret;
			}
			ret.title = matches[1];
			ret.slide = markdown.replace(regex, '');
			return ret;
		}

		// Arguments
		this.id = ('id' in attrs)? attrs.id : -1;
		this.markdown = ('markdown' in attrs)? attrs.markdown : '';

		// Parsed markdown
		slide = parseSlide(this.markdown);
		this.htmlString = Slide._convert.makeHtml(slide.slide);
		this.title = slide.title;
	
		this.numImages = 0; // MUCH LATER TODO: Calculate

		/*// Custom directives 
		// #1 - Center 
		h = h.replace(/center:\s+?([^\n]+)/g, "<center>$1</center>");
		h = h.replace(/centerAll:\s+?([^\n\n|\n\r\n]+)/g, 
											"<center>$1</center>");
		////////////////////////*/
	},

	url: function() {
		var title = function(t) {
			return t.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^\w-]/g, '');	
		}
		return '#' + this.id + '-' + title(this.title);
	}
});

var SlideList = Backbone.Collection.extend({
	model: Slide,

	initialize: function() {
		this.markdownFull = '';
		this.totalImages = 0;

		// Current slide
		this.cur = 0; 
	},

	current: function() {
		return this.at(this.cur);
	},

	next: function() {
		if(this.cur >= this.length - 1) {
			return;
		}
		this.cur += 1;
		this.trigger('slides:change');
	},

	prev: function() {
		if(this.cur <= 0) {
			return;
		}
		this.cur -= 1;
		this.trigger('slides:change');
	},

	view: function(n) {
		if(typeof(n) != "number") {
			return;
		}
		if(n < 0 || n >= this.length) {
			return;
		}
		this.cur = n;
		this.trigger('slides:change');
	}
});

// XXX: SlideList needs events. 
_.extend(SlideList.prototype, Backbone.Events);

