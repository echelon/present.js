
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
		// Move out of view
		$('#slideWrap').css({
			'margin-left': '8000px',
			'overflow': 'hidden'
		});

		this.render();

		// Slide animation
		$('#slideWrap').animate({
			marginLeft: '0px'
		}, 400, 'easeOutQuart', function() {
			// prevent animations from queueing up and stalling
			// typically occurs when 'rapidly' paging through slides
			$(this).stop(true); 
		});

	}, 

	render: function()
	{
		var slide = this.collection.current();
		$('#title').html(slide.title);
		$('#currentSlide').html(slide.htmlString);

		var resizeText = function(slide)
		{
			var testDiv, width, height, usedHeight,
				availWidth, availHeight, curWidth, curHeight, dp;
			
			testDiv = $('#test').html(slide.htmlString);
			testDiv.css('font-size', '100%');
			//testDiv.css('list-style-position', 'inside');

			width = $(window).width();
			height = $(window).height();

			usedHeight = 15; // Heuristic, Start w/ '15px' just in case
			usedHeight += $('#footerCts').outerHeight(true);

			$('#header').children().each(function(i) { 
				usedHeight += $(this).outerHeight(true);
			});

			availWidth = width;
			availHeight = height - usedHeight;

			curWidth = testDiv.outerWidth();
			curHeight = testDiv.outerHeight();

			var percent = 100;
			var goodPercent = percent;
			var maxPercent = 800;
			var minPercent = 50;

			// Clean whitespace
			var onlyUsePercent = 0.9;
			availHeight = availHeight * 0.9; // TODO cleanup

			var max = maxPercent;
			var min = minPercent;

			var mid;
			var lastMid;
			var goodValue;
			var i = 0;

			// XXX: Binary search for optimal font-size percent value
			while(min < max) 
			{
				lastMid = mid;
				mid = Math.floor((max + min)/2);

				if(mid == lastMid || i++ > 20) {
					break;
				}

				testDiv.css('font-size', mid + '%');

				curWidth = testDiv.outerWidth();
				curHeight = testDiv.outerHeight();

				if(curWidth > availWidth || curHeight > availHeight) {
					max = mid;	
				}
				else if(curHeight < availHeight) {
					min = mid;
					goodValue = mid;
				}
			}

			return goodValue;
		}

		// Resize text to maximum font. 
		var percent = resizeText(slide);
		$('#currentSlide').css('font-size', percent + '%');

		// Highlight code
		$('pre code').each(function(i, e) { 
			hljs.highlightBlock(e);
		});

		// XXX: TEMPORARY FIX. REmove duplicated youtube video bug
		var iframe = $('iframe');
		if(iframe.length >= 2) {
			iframe.last().remove();
		}

		// Re-render math
		// FIXME: Incorrectly sizes text... Need to hook into async api.
		//MathJax.Hub.Typeset(); // XXX: MathJax temporarily removed.

		// Remove <br>
		$('#currentSlide br').remove();

		// Resize images (TODO)
		$('#currentSlide img').each(function() {
			var that = this;
			var img = new Image;
			img.onload = function() {
				var mw, mh, aw, ah, rw, rh, w, h;
				mw = $(window).width();
				mh = $(window).height();
				aw = this.width;
				ah = this.height;

				//alert('Height: ' + ah + ', Width: ' + aw);
				//alert('MaxHeight: ' + mh + ', MaxWidth: ' + mw);

				if(aw > mw || ah > mh) {
					// Minify
					rw = mw/aw;
					rh = mh/ah;
					if(rw < rh) {
						w = Math.floor(aw * rw);
						h = Math.floor(ah * rw);
					}
					else {
						w = Math.floor(aw * rh);
						h = Math.floor(ah * rh);
					}
					$(that).attr({
						width: w,
						height: h
					});
				}
				else {
					// Magnify
					// TODO
				}
			};
			img.src = $(this).attr('src');
		});
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

		// Mouse click. (May not be desirable.)
		// Disable context menu. Again, maybe not a great idea...
		$(document).bind('click', function() { slides.next(); });
		$(document).bind('contextmenu', function() { return false; });
		$(document).mousedown(function(ev) {
			switch(ev.which) {
				case 1: // Left click
					slides.next();
					break;
				case 2: // Middle click
					break;
				case 3: // Right click
					slides.prev();
					break;
			}
		});

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
	this.css("top", ($(window).height() - this.height()) / 
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

