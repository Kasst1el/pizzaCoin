var particleSettings = {
	"particles": {
		"number": {
			"value": 20
		},
		"color": {
			"value": "#ffffff"
		},
		"shape": {
			"type": "circle"
		},
		"opacity": {
			"value": 1,
			"random": false,
			"anim": {
				"enable": false
			}
		},
		"size": {
			"value": 2,
			"random": true,
			"anim": {
				"enable": false
			}
		},
		"line_linked": {
			"distance": 100,
			"color": "#ffffff",
			"opacity": 1,
			"width": 2
		},
		"move": {
			"enable": true,
			"speed": 2,
			"direction": "none"
		},
	},
	"retina_detect": true
}

$.fn.extend({
	inViewport: function() {
		var top_of_element = $(this).offset().top;
	    var bottom_of_element = $(this).offset().top + $(this).outerHeight();
	    var bottom_of_screen = $(window).scrollTop() + $(window).height();
	    var top_of_screen = $(window).scrollTop();

	    if ((bottom_of_screen > top_of_element) && 
	    	(top_of_screen < bottom_of_element)){
	        return true; }
	    return false;
	},

	flyOnScreen: function() {
		
	}
});

function FlyingObject (element) {
	this.element = element;
	this.angle = 0;
	this.lastTime = null;

	this.angleMultiply = {
		x: this.random(0, 50),
		y: this.random(0, 50)
	}

	this.rotateDeg = this.random(0, 45);
	this.scale = this.random(5, 7) / 10;

	requestAnimationFrame(this.animate.bind(this));
}

FlyingObject.prototype.random = function(min, max) {
	return Math.floor((Math.random() * max) + min);
}

FlyingObject.prototype.animate = function(time) {
	if (this.lastTime !== null)
		this.angle += (time - this.lastTime) * .00025;

	this.lastTime = time;

	if ($(this.element).inViewport()){
		var position = {
			x: (Math.sin(this.angle) * this.angleMultiply.x),
			y: (Math.cos(this.angle) * this.angleMultiply.y)
		}

		this.element.css({
			'transform': 'rotate('+ this.rotateDeg * this.angle +'deg) scale('+ this.scale +') translate(' + position.x + 'px, ' + position.y + 'px)'
		});
	}

	requestAnimationFrame(this.animate.bind(this));
}

var headerModule = (function(){
	var element = $('header');

	return {
		darkTheme: function(boolean) {
			if (boolean)
				element.addClass('__colorful')
			else
				element.removeClass('__colorful')
		}
	}
})();

function showBenderOnScroll() {
	$.scrollify.disable();
	$('body').css({'overflow': 'hidden'});

	var locked = true;

	$('body').on('mousewheel DOMMouseScroll', function(e) {
		if (locked) { 
			$('.bender-wrap').addClass('__active');

			setTimeout(function() {
				locked = false;
				$('body').css({'overflow': ''});
				$.scrollify.enable();
			}, 1100);
		}
	});
}

function initFlyingDildo() {
	var waitTime = 5000;

	function showOne(num) {
		// $('.lp-section__first__floating__wrap').removeClass('__active');
		$('.lp-section__first__floating__wrap[data-stack=' + num + ']').addClass('__active');
	}

	setTimeout(function() {
		showOne(1);
		setTimeout(function() {
			showOne(2);
		}, waitTime);	
	}, waitTime);
}

function videoControlRatio(element) {
	function getHeight(width) {
		return width * .5625;
	}

	var width = $(element).width();
	$(element).height(getHeight(width));
	$(element).height();

	$(window).on('resize', function() {
		width = $(element).width();
		$(element).height(getHeight(width));
	});
}

function priceAnimCalc() {
	var element = $('.lp-section__first__price-value');
	var span = element.find('span');
	var fullPrice = Number(element.data('value'));

	var duration = 500;

	var start = new Date();
	var end = start + duration;

	function frame() {
		var time = new Date();
		var progress = (time - start) / duration;
		if (progress > 1) progress = 1;
		
		current = Math.floor(progress * fullPrice).toLocaleString();

		span.html(current);
		if (progress < 1)
			requestAnimationFrame(frame);
	}

	requestAnimationFrame(frame);
}

function checkAnimateElement() {
	$('[data-animate=scroll]').each(function() {
		if ($(this).inViewport()) {
			$(this).removeAttr('data-animate');
			var delay = Number($(this).data('delay'));
			setTimeout(function() {
				$(this).removeClass('--animate');
			}.bind(this), delay)
		}
	});

	requestAnimationFrame(checkAnimateElement.bind(this));
}

$(document).ready(function() {
	$.scrollify({
		section: '.lp-section',
		setHeights: false,
		scrollSpeed: 2000,
		before: function(num) {
			var bool = $('.lp-section').eq(num).hasClass('__colorful');
			headerModule.darkTheme(!bool);
		},
		afterRender: function() {
			if ($.scrollify.current().data('description') === 'first-sect') {
				showBenderOnScroll();
				initFlyingDildo();
			}
		}
	});

	particlesJS('particles-js', particleSettings);
	
	$('.lp-section__first__floating__element').each(function() {
		new FlyingObject($(this));
	});

	$('.youtube-video').each(function() {
		videoControlRatio($(this));
	});

	$('select').each(function() {
		$(this).closest('.form-group').addClass()
	});

	$('input[type=checkbox]:checked').each(function() {
		// if ($(this).prop('checked'))
		$(this).closest('.form-checkbox').addClass('__checked');
	});

	$('input[type=checkbox]').change(function() {
		$(this).closest('.form-checkbox').toggleClass('__checked');
	});

	$('.form-checkbox').click(function() {
		$(this).find('input').click();
	});

	$('.lp-section__eleventh__quest-box').click(function() {
		$(this).addClass('lp-section__eleventh__quest-box__active');
	});

	$('[data-animate=scroll]').each(function() {
		if (!$(this).inViewport())
			$(this).addClass('--animate');
	});

	checkAnimateElement();
});