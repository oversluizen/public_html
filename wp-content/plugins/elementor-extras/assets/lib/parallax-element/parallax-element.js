// -- parallaxElement
// @license parallaxElement v1.0.0 | MIT | Namogo 2017 | https://www.namogo.com
// --------------------------------
;(
    function( $, window, document, undefined ) {

		$.parallaxElement = function(element, options) {

			var defaults = {
				speed 			: 0.15,
				speedTablet		: 0.15,
				speedMobile		: 0.15,
				scale			: 0.15,
				// opacity 		: 0,
				// opacityTablet 	: 0,
				// opacityMobile 	: 0,
				scope 			: $(window),
				transformItem 	: null,
				relative 		: 'middle',
				disableOn		: false,
				breakpoints		: {
					'mobile'	: 768,
					'tablet' 	: 1024,
				}
			};

			var plugin = this;

			plugin.opts = {};

			var $window			= null,
				item			= element,
				$item			= $(item),
				$document		= $(document),

				scrolled		= null,
				speed 			= null,
				// opacity 		= null,
				
				winHeight 		= $(window).height(),
				docHeight 		= $document.height(),
				toWindowBottom 	= null,
				toItemTop 		= null,
				pToItemTop 		= null,
				toItemBottom 	= null,
				pToItemBottom 	= null,
				toTopFromMiddle = null,
				itemHeight		= null,
				itemWidth		= null,

				props 		 	= null,

				latestKnownScrollY  = -1,
				currentScrollY 		= 0,
				ticking 			= false,
				updateAF			= null;


			plugin.init = function() {
				plugin.opts = $.extend({}, defaults, options);

				plugin._construct();
			};

			plugin._construct = function() {

				$window			= plugin.opts.scope;
				speed 			= plugin.opts.speed;
				currentScrollY 	= $window.scrollTop();
				// opacity 	= plugin.opts.opacity;

				plugin.setup();
				plugin.events();
				plugin.requestTick();
			};

			plugin.setup = function() {

				winHeight 		= $(window).height();

				itemHeight		= $item.height();
				itemWidth		= $item.width();

				toItemTop 		= $item.offset().top;
				toItemBottom 	= toItemTop + itemHeight;
				toWindowBottom 	= $window.scrollTop();
				toTopFromMiddle = toItemTop + itemHeight / 2;

				if ( $window.width() < plugin.opts.breakpoints['tablet'] ) {
					if ( $window.width() < plugin.opts.breakpoints['mobile'] ) {
						speed = plugin.opts.speedMobile;
						// opacity = plugin.opts.opacityMobile;
					} else {
						speed = plugin.opts.speedTablet;
						// opacity = plugin.opts.opacityTablet;
					}
				}
				
			};

			plugin.events = function() {
				
				$window.on( 'scroll', plugin.onScroll );

				$window.on( 'resize', function() {
					plugin.setup();
					plugin.requestTick();
				});

			};

			plugin.onScroll = function() {
				currentScrollY = $window.scrollTop();
				plugin.requestTick();
			};

			plugin.requestTick = function() {
				
				if ( ! ticking ) {
					
					updateAF = requestAnimationFrame( plugin.update );
				}
				ticking = true;
			};

			plugin.update = function() {

				ticking = false;

				if ( plugin.opts.disableOn && $window.width() < plugin.opts.breakpoints[plugin.opts.disableOn] ) {
					plugin.clearProps();
					return;
				}

				if ( latestKnownScrollY !== currentScrollY ) {

					latestKnownScrollY = currentScrollY;
						
					var	winHeight 			= $(window).height();
						middleOfScreen 		= currentScrollY + winHeight / 2,
						middleToMiddle 		= middleOfScreen - toTopFromMiddle,
						middleToTop 		= middleOfScreen - toItemTop,
						toWindowBottom 		= currentScrollY + winHeight,
						pToItemTop 			= $item.offset().top,
						pToItemBottom 		= pToItemTop + itemHeight,
						pxSinceVisible 		= currentScrollY - toItemTop + winHeight,
						pPxSinceVisible 	= currentScrollY - pToItemTop + winHeight,
						pRelative 			= null;

						// _opacity 			= 1 - Math.abs( Math.pow( ( middleToMiddle / winHeight ), 3 ) ) * Math.pow( ( 1 + opacity ), 3 );
						// __scale 			= 1 + Math.abs( Math.pow( ( middleToMiddle / winHeight ), 3 ) ) * Math.pow( ( _scale ), 3 ) * 100;
						// pos 				= ( ( winHeight ) / ( Math.pow( winHeight, 3 ) ) ) * Math.pow( pxSinceVisible - ( winHeight / 2 ), 3 ),

					if ( pToItemBottom > currentScrollY && pToItemTop < toWindowBottom ) {

						if ( 'middle' === plugin.opts.relative ) {
							pRelative = middleToMiddle;
						} else if ( 'position' === plugin.opts.relative ) {
							pRelative = currentScrollY;
						}

						props = { y : pRelative * speed };
						plugin.setProps();
					}
				}
			};

			plugin.setProps = function() {
				TweenMax.set( $item, props );
			};

			plugin.clearProps = function() {
				TweenMax.set( $item, { clearProps: "all" } );
			};

			plugin.destroy = function() {

				plugin.clearProps();
				cancelAnimationFrame( updateAF );
				$window.off( 'scroll', plugin.onScroll );
				$item.removeData( 'parallaxElement' );

			};

			plugin.init();

		};

		$.fn.parallaxElement = function(options) {

			return this.each(function() {

				$.fn.parallaxElement.destroy = function() {
					if( 'undefined' !== typeof( plugin ) ) {
						$(this).data( 'parallaxElement' ).destroy();
						$(this).removeData( 'parallaxElement' );
					}
				}

				if (undefined === $(this).data('parallaxElement')) {
					var plugin = new $.parallaxElement(this, options);
					$(this).data('parallaxElement', plugin);
				}
			});

		};

	}

)( jQuery, window, document );