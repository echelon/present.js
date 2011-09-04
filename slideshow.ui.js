
/**
 * Clock
 * Helps me keep track of presentation runtime.
 */
var ClockView = Backbone.View.extend({
	el: '#time',

	constructor: function() {
		var that = this;
		this.timer = setInterval(function() {that.render()}, 1000*10);
	},

	render: function()
	{
		var getTime = function() {
			var zf, d;
			zf = function(n) { return (n>9)? n : "0" + n; };
			d = new Date();
			return d.getHours() + ':' + zf(d.getMinutes());
		}

		$(this.el).html(getTime());
	}
});

var SlideView = Backbone.View.extend({

	//tagName: 'div',

	constructor: function(attrs)
	{
		this.collection = ('collection' in attrs)? attrs.collection: null;
	},

	transition: function() 
	{
		$('#currentSlide').hide();
		$('#title').hide();

		this.render();

		$('#currentSlide').fadeIn('fast');
		$('#title').fadeIn('fast');
	}, 

	render: function()
	{
		var slide = this.collection.current();
		$('#currentSlide').html(slide.htmlString);
		$('#title').html(slide.title);

		// TODO: Sizing. 
	}

});

/**
 * TODO DOC
 */
var AppView = Backbone.View.extend({

	constructor: function(slides) 
	{
		var that, hashtagSlide;
		that = this;

		// Parse hashtag to get first slide number
		hashtagSlide = function() {
			var m; 
			if(!location.hash) {
				return 0;
			}
			m = location.hash.match(/^#?(\d+)-?/);
			if(!m || m.length < 2) {
				return 0;
			}
			return parseInt(m[1]);
		}
	
		this.slides = slides;
		this.slideView = new SlideView({collection: slides});

		// Arrow key keybindings
		$(document).bind('keydown', 'left', function() { slides.prev(); }); 
		$(document).bind('keydown', 'right', function() { slides.next(); }); 

		// Additional keybindings
		$(document).bind('keydown', 'space', function() { slides.next(); });
		$(document).bind('keydown', 'return', function() { slides.next(); });

		// FIXME: Back button goes to previous page, even on non-bubble.
		/*$(document).bind('keypress', 'backspace', function() { 
			slides.prev(); 
		}); */

		// Vim-like keybindings
		$(document).bind('keypress', 'j', function() { slides.next(); });
		$(document).bind('keypress', 'l', function() { slides.next(); });
		$(document).bind('keypress', 'k', function() { slides.prev(); });
		$(document).bind('keypress', 'h', function() { slides.prev(); });

		// Hash change
		$(window).bind('hashchange', function() { 
			if(slides.cur == hashtagSlide()) {
				return;
			}
			slides.view(hashtagSlide());
		});

		// Bind slide change event:
		slides.bind('slides:change', this.render, this);
		slides.bind('slides:change', this.slideView.transition, 
				this.slideView);

		// XXX: What was this? Just a recenter?
		/*// Page Layout
		$(window).resize(function() { $('.presentation').center(); });*/

		// Render first slide.
		//this.render();
		//
		this.slides.view(hashtagSlide());

		this.clock = new ClockView;
		this.clock.render();
	},

	render: function() 
	{
		var progress = (this.slides.cur + 1) + '/' + this.slides.length;

		//alert(this.slides.cur);



		$('#page').html(progress);

		location.hash = this.slides.current().url();

		//this.slideView.render();
	}
});


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



// TODO: Rename render()
function show() {
	$('.presentation').html(SS.slide().toHtml());

	var h = $('.slide>h1').detach();
	$('#header').html(h);

	// TODO: Move this. 
	// Report current slide
	$('#page').html('' + (SS.curSlide()+1) + '/' + SS.totalSlides());
	
	$('.presentation').center();	
};

// From http://stackoverflow.com/questions/210717/what-is-the-best-
// way-to-center-a-div-on-the-screen-using-jquery/210733#210733
jQuery.fn.center = function () {
	this.css("position","absolute");
	this.css("top", 
			($(window).height() - this.height()) / 
			2+$(window).scrollTop() + "px");
	this.css("left", ($(window).width() - this.width()) / 
			2+$(window).scrollLeft() + "px");
	return this;
};

function loadfile() {
	var file = $(document).getUrlParam('md') || 'example.md';
	$.ajax({
			url: file,
			dataType: 'text',
			success: function(data) { handleLoad(data); },
	});
};

