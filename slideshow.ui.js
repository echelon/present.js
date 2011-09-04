
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

/**
 * TODO DOC
 */
var SlideView = Backbone.View.extend({

	tagName: 'div',

	constructor: function(attrs)
	{
		this.model = ('model' in attrs)? attrs.model : null;
		this.onDisplay = false;
	},

	render: function()
	{
		// FIXME: Better way to remove header. Best if done in model.
		$('#currentSlide').html(this.model.htmlString);
		$('#currentSlide h1').detach(); 
		this.onDisplay = true;
		return this;
	},

	remove: function()
	{
		Backbone.View.prototype.remove.call(this); // call super
		this.onDisplay = false;

		//alert('removed');
		return this;
	}
});

var SlideView2 = Backbone.View.extend({
	tagName: 'div',

	constructor: function(attrs)
	{
		this.collection = ('collection' in attrs)? attrs.collection: null;
	},

	onSwapSlides: function() 
	{

	}, 

	render: function()
	{
		var slide = this.collection.current();

		$('#currentSlide').hide();

		// FIXME: Better way to remove header. Best if done in model.
		$('#currentSlide').html(slide.htmlString);
		$('#currentSlide h1').detach(); 
		
		$('#currentSlide').fadeIn('fast');
		//$('#currentSlide').slideDown('slow');
	
	}

});

/**
 * TODO DOC
 */
var AppView = Backbone.View.extend({

	constructor: function(slides) 
	{
		var that = this;
	
		this.slides = slides;
		this.slideView = new SlideView2({collection: slides});

		// Arrow key keybindings
		$(document).bind('keydown', 'left', function() { slides.prev(); }); 
		$(document).bind('keydown', 'right', function() { slides.next(); }); 

		// Additional keybindings
		$(document).bind('keydown', 'space', function() { slides.next(); });
		$(document).bind('keydown', 'return', function() { slides.next(); });

		// FIXME: Back button goes to previous page, even on non-bubble.
		$(document).bind('keypress', 'backspace', function() { 
			slides.prev(); 
		}); 

		// Vim-like keybindings
		$(document).bind('keypress', 'j', function() { slides.next(); });
		$(document).bind('keypress', 'l', function() { slides.next(); });
		$(document).bind('keypress', 'k', function() { slides.prev(); });
		$(document).bind('keypress', 'h', function() { slides.prev(); });

		// Bind slide change event:
		slides.bind('slides:change', this.render, this);


		//TODO $(window).bind('hashchange', function() { loadHash(); });

		// XXX: What was this? Just a recenter?
		/*// Page Layout
		$(window).resize(function() { $('.presentation').center(); });*/

		// Render first slide.
		this.render();

		this.clock = new ClockView;
		this.clock.render();
	},

	render: function() 
	{
		var progress = (this.slides.cur + 1) + '/' + this.slides.length;
		$('#page').html(progress);

		/*
		var act = _.filter(this.slideViews, function(v) { return v.onDisplay; });
		_.each(act, function(v) { v.remove(); });
		*/

		this.slideView.render();
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
	var file = $(document).getUrlParam('mkd') || 'example.mkd';
	$.ajax({
			url: file,
			dataType: 'text',
			success: function(data) { handleLoad(data); },
	});
};

