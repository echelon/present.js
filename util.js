
// Returns a random integer. Two ways to call:
// 	randInt(5) -- returns an integer in [0, 5]
// 	randInt(1, 6) -- returns an integern in [1, 6]
randInt = function(a, b) {
	if(typeof b == 'undefined') {
		return Math.floor(Math.random()*(a+1));
	}
	return a + Math.floor(Math.random()*(b-a+1));
};

// ==========================================================
// The following is an in-progress adaptation of the Reddit "downtime"
// page 'cloud background animation', which I find really cool and somewhat
// relaxing. I don't think it will distract from the presentation at all. 
//
// TODO: Page change animation is affected by this. I need to lower the 
// CPU load so everything is smooth and minimal.

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}
 
function randomChoice(items) {
	return items[randomInt(0, items.length-1)]
}
 
var PIXEL_SIZE = 25;
 
function makeCloud() {
	var w = 8,
		h = 5,
		maxr = Math.sqrt(w*w + h*h),
		density = .4;
		
	var cloud = document.createElement('div')
	cloud.className = 'cloud'


	for (var x=-w; x<=w; x++) {
		for (var y=-h; y<=h; y++) {

			r = Math.sqrt(x*x + y*y)
			if (r/maxr < Math.pow(Math.random(), density)) {

				var puff = document.createElement('div')
				puff.className = 'puff'
				puff.style.left = (x + w) * PIXEL_SIZE + 'px'
				puff.style.top = (y + h) * PIXEL_SIZE + 'px'

				$(puff).data('left', (x+w)*PIXEL_SIZE);
				$(puff).data('top', (y+h)*PIXEL_SIZE);

				cloud.appendChild(puff)
			}

		}
	}
	return cloud
}
 
clouds = [];
 
function randomPosition(max) {
	return Math.round(randomInt(-400, max)/PIXEL_SIZE)*PIXEL_SIZE
}

// With a probability, make a 'cloud' and give random position. 
function addCloud(randomLeft) 
{
	var cloudiness = 0.9; // Originally 0.3
 
	if (Math.random() < cloudiness) 
	{
		newCloud = {
			x: randomLeft ? 
				randomPosition(document.documentElement.clientWidth) : -400,
			el: makeCloud()
		}
 
		newCloud.el.style.top = randomPosition($(window).height()) + 'px';
		newCloud.el.style.left = newCloud.x + 'px'
		document.body.appendChild(newCloud.el)
		clouds.push(newCloud)
	}
}

// Timer function... 
// Move clouds, make a new cloud (with probability)
// Remove offscreen clouds
function animateClouds() {
	var dx = 25; // TODO: Closure, please.
 
	addCloud()
 
	var newClouds = []

	/* Too CPU intensive... why?
	$(".puff").each(function(i, attr){
		var x = $(this).data('x') || 0;
		//this.style.left = this.
		x += dx;
		$(this).data('x', x);
		$(this).css({
			left: x + 'px',
		});
	});*/

	/*$(".puff").each(function(i, attr){
		var top = $(this).data('top') || 0;
		var left = $(this).data('left') || 0;
		if(top > $(window).height() || left > $(window).width()) {
			$(this).remove();
		}
	});*/


	// Move the clouds!
	for (var i=0; i < clouds.length; i++) 
	{
		var cloud = clouds[i];
		cloud.x += dx;
 
		if (cloud.x >= $(window).width()) {
			document.body.removeChild(cloud.el);
		} else {
			cloud.el.style.left = cloud.x + 'px';
			newClouds.push(cloud);
		}
	}
	
	clouds = newClouds // XXX: external global, bad!
}
 
function start() {
	if (arguments.callee.ran) { return; }
	arguments.callee.ran = true
 
	setInterval(animateClouds, 5*1000)
 
	for (n=0; n<50; n++) {
		addCloud(true)
	}
}
 
