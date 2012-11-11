// XXX: No UI in this file. Define slideshow.ui.js

/* =============== NON-PUBLIC API FOLLOWS ============= */

/**
 * Split a markdown document into slides.
 * Separates the document at each "Title".
 */
function split_into_slides(text)
{
	var s = text.split(/---/m);
	return s;
};

function loadfile() {
	var file = $(document).getUrlParam('md') || 'example.md';
	$.ajax({
		url: file,
		dataType: 'text',
		success: function(data) { handleLoad(data); },
	});
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
			var tmp = '', blocks = [], i = 0;

			// Custom directives
			tmp = markdown.replace(/--(?=[^-])/g, '&ndash;');

			// Split into blocks
			blocks = tmp.split(/\n{2}/);

			for(i = 0; i < blocks.length; true) {
				if(blocks[i]) {
					i++;
					continue;
				}
				blocks.splice(i, 1);
			}
			
			// FIXME: Quotes mess up html, etc.
			//ret.slide = ret.slide.replace(/(?=\s?)"(?=\S)/g, '&ldquo;');
			//ret.slide = ret.slide.replace(/(?=\S)"(?=\s?)/g, '&rdquo;');
			return blocks;
		}

		// Arguments
		this.id = ('id' in attrs)? attrs.id : -1;
		this.markdown = ('markdown' in attrs)? attrs.markdown : '';

		// Parsed markdown
		blocks = parseSlide(this.markdown);

		this.htmlBlocks = [];
		for(i = 0; i < blocks.length; i++) {
			this.htmlBlocks.push(Slide._convert.makeHtml(blocks[i]));
		}

		this.numImages = 0; // MUCH LATER TODO: Calculate

		/*// Custom directives 
		// #1 - Center 
		h = h.replace(/center:\s+?([^\n]+)/g, "<center>$1</center>");
		h = h.replace(/centerAll:\s+?([^\n\n|\n\r\n]+)/g, 
											"<center>$1</center>");
		////////////////////////*/
	},

	url: function() {
		/*var title = function(t) {
			return t.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^\w-]/g, '');	
		}*/
		return '#' + this.id; // + '-' + title(this.title);
	}
});

// TODO: Rename SlideDeck. Hipper.
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

/**
 * Slideshow Global
 */

// TODO: Rename init()
function handleLoad(data)
{
	var split, slides, i, slide;

	split = split_into_slides(data);

	slides = new SlideList;

	for(i = 0; i < split.length; i++) {
		slide = new Slide({id: i, markdown:split[i]});
		slides.add(slide);
	}

	/*
	slides.bind('all', function() { alert('all'); }, this);
	slides.bind('remove', function() { alert('removed'); }, this);
	slides.bind('test', function() { alert('test'); }, this);
	*/

	//slides.remove(slides.at(1));
	//slides.trigger('test');

	window.app = new AppView(slides);
};


