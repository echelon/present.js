/**
 * Split a markdown document into slides.
 * Slides are separated by '---'
 * Slides without word characters are removed.
 */
function split_into_slides(text)
{
	var slides = text.split(/^---+\s+?$/m);
	
	for(i = 0; i < slides.length; true) {
		if(slides[i].match(/\w+/)) {
			i++;
			continue;
		}
		slides.splice(i, 1);
	}
	return slides;
};

function loadfile() {
	var file = $(document).getUrlParam('md') || 'slides.md';
	$.ajax({
		url: file,
		dataType: 'text',
		success: function(data) { handleLoad(data); },
	});
};

/**
 * Slide Model
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

			// LaTeX math emulation
			tmp = tmp.replace(/\^{([^(\^{)]*)}/g, function(match, g1, g2) {
				return '<sup>' + g1 + '</sup>';
			});
			tmp = tmp.replace(/\\?_{(.*)}/g, function(match, g1, g2) {
				return '<sub>' + g1 + '</sub>';
			});
			
			// Symbols
			tmp = tmp.replace(/\(deg\)/ig, '&deg;')
			tmp = tmp.replace(/''/g, '&Prime;')

			// Currency
			tmp = tmp.replace(/\(yuan\)/ig, '&#x5143;')

			// Split into blocks
			blocks = tmp.split(/\n{2,}/);

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
	},

	url: function() {
		return '#' + this.id;
	}
});

// TODO: Rename SlideDeck. Hipper.
var SlideList = Backbone.Collection.extend({
	model: Slide,

	initialize: function() {
		this.markdownFull = '';
		this.totalImages = 0;

		// Public, but read-only!
		this.cur = 0; // Current slide
		this.lastSlide = 0; // Last slide
	},

	current: function() {
		return this.at(this.cur);
	},

	next: function() {
		if(this.cur >= this.length - 1) {
			return;
		}
		this.lastSlide = this.cur;
		this.cur += 1;
		this.trigger('slides:change');
	},

	prev: function() {
		if(this.cur <= 0) {
			return;
		}
		this.lastSlide = this.cur;
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
		this.lastSlide = this.cur;
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

	window.app = new AppView(slides);
};

