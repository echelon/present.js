
/**
 * Clock
 * Helps me keep track of presentation runtime.
 */
var ClockView = Backbone.View.extend({
	el: '#time',

	constructor: function() {
		var that = this;
		this.timer = setInterval(function() {that.render()}, 1000 * 10);
		this.startClock = (new Date()).getTime();

		// Timer URL parameter
		// A timer for how long presentation must be... (minutes)
		var time = parseInt($(document).getUrlParam('t')) || 15;
		this.numMinutes = time;
	},

	render: function()
	{
		var that = this;
		var getTime = function() {
			var zf, d; 
			var dsec, dmin, perc, clock, elap;

			// Format time with leading zeros
			zf = function(n) { return (n>9)? n : "0" + n; };

			// Format minutes elapsed (nice rounding)
			minf = function(n) {
				var i, d;
				i = parseInt(n);
				d = n - i;
				if (d > 0.74) {
					i += 0.75;
				}
				else if (n - i > 0.49) {
					i += 0.5;
				}
				else if (n - i > 0.24) {
					i += 0.25;
				}
				return i;
			};

			d = new Date();
			dsec = (d.getTime() - that.startClock) / 1000;
			dmin = dsec / 60;

			perc = parseInt(dmin / that.numMinutes * 100);
			clock = d.getHours() + ':' + zf(d.getMinutes());
			elap = minf(dmin) + ' / ' + that.numMinutes + 'm';

			return elap + ' (' + perc + '%) | ' + clock;
		}

		$(this.el).html(getTime());
	}
});

var SlideView = Backbone.View.extend({

	//tagName: 'div',

	// Animation used.
	// Options are 'slide', and 'fade'.
	// TODO: slide left/right depending on slide nav direction
	animation: 'fade',

	constructor: function(attrs)
	{
		this.collection = ('collection' in attrs)? attrs.collection: null;

		// XXX: Bad spot for this? I have no idea.
		// I don't remember the logical scope here
		//$('#currentSlide').fitText();
	},

	transition: function() 
	{
		switch(this.animation) {
			case 'slide':
				// Move out of view
				$('#table').css({
					'margin-left': '8000px',
					'overflow': 'hidden'
				});

				this.render();

				// Slide animation
				$('#table').animate({
					marginLeft: '0px'
				}, 400, 'easeOutQuart', function() {
					// prevent animations from queueing up and stalling
					// typically occurs when 'rapidly' paging through slides
					$(this).stop(true); 
				});
				break;

			case 'fade':
				this.render();
				$('#table').hide();
				$('#table').fadeIn(100);
				break;

			default:
				this.render();
		}

	}, 

	render: function()
	{
		var slide = this.collection.current();

		var buildTable = function(blocks) {
			var html = '';
			switch(blocks.length) {
				case 1:
					html = '<tr>' + 
						   '<td class="c100-100">' + blocks[0] + '</td>' + 
						   '</tr>';
					break;
				case 2:
					html = '<tr>' + 
						   '<td class="c50-100">' + blocks[0] + '</td>' + 
						   '<td class="c50-100">' + blocks[1] + '</td>' + 
						   '</tr>';
					break;
				case 3:
					html = '<tr>' + 
						   '<td class="c50-100" rowspan="2">' + 
						   		blocks[0] + '</td>' + 
						   '<td class="c50-50">' + blocks[1] + '</td>' + 
						   '</tr>' + 
						   '<tr>' + 
						   '<td class="c50-50">' + blocks[2] + '</td>' + 
						   '</tr>';
					break;
				case 4:
					html = '<tr>' + 
						   '<td class="c50-50">' + blocks[0] + '</td>' + 
						   '<td class="c50-50">' + blocks[1] + '</td>' + 
						   '</tr>' + 
						   '<tr>' + 
						   '<td class="c50-50">' + blocks[2] + '</td>' + 
						   '<td class="c50-50">' + blocks[3] + '</td>' + 
						   '</tr>';
					break;
				default:
					// Anything other than 1-4 blocks is an error!
					break; 
			}
			return html;
		}

		var resizeText = function($td)
		{
			var testDiv, width, height, usedHeight,
				availWidth, availHeight, curWidth, curHeight, dp;
			
			testDiv = $('#test').html($td.html());
			testDiv.css('font-size', '100%');
			//testDiv.css('list-style-position', 'inside');

			width = $td.width();
			height = $td.height();

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

		// Build the table layout
		$('#table').html(buildTable(slide.htmlBlocks));

		// Resize text to maximum font. 
		$('td').each(function() {
			// pass
			var perc = resizeText($(this));
			console.log($(this).html());
			console.log(perc);
			$(this).css('font-size', perc + '%');
		});

		//var percent = resizeText(slide);
		//$('#table').css('font-size', percent + '%');

		// XXX: TEMPORARY FIX. Remove duplicated youtube video bug
		var iframe = $('iframe');
		if(iframe.length >= 2) {
			iframe.last().remove();
		}

		// Resize images
		$('#table td img').each(function() {
			var tdw = $(this).parents('td').width(),
				tdh = $(this).parents('td').height();

			$(this).load(function() {
				var nw = 0, nh = 0, rw = 0, rh = 0,
					iw = $(this).width(),
					ih = $(this).height();

				// Minify or magnify 
				rw = tdw/iw;
				rh = tdh/ih;
				if(rw < rh) {
					nw = Math.floor(iw * rw);
					nh = Math.floor(ih * rw);
				}
				else {
					nw = Math.floor(iw * rh);
					nh = Math.floor(ih * rh);
				}

				$(this).attr({
					width: nw,
					height: nh,
				})
				.css({
					display: 'block',
				})
				.show();

			});
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

		// Window resize. 
		// FIXME: Flickers. Algo must be too slow.
		var that = this;
		$(window).resize(function() { 
			that.slideView.render();
		});

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

