// -- Image Comparison
// @license Image Comparison v1.0.0 | MIT | Namogo 2017 | https://www.namogo.com
// --------------------------------
;(
	function( $, window, document, undefined ) {

		$.imageComparison = function(element, options) {

			var defaults = {
				scope 	: $(window),
			};

			var plugin = this;

			plugin.opts = {};

			var $window			= null,
				$viewport		= $(window),
				$element		= $(element),

				dragging 		= false,
				scrolling 		= false,
				resizing 		= false;


			plugin.init = function() {
				plugin.opts = $.extend({}, defaults, options);
				plugin._construct();
			};

			plugin._construct = function() {

				$window		= plugin.opts.scope;

				plugin.checkPosition();
				plugin.setup();
				plugin.events();

			};

			plugin.checkPosition = function() {
				if( $window.scrollTop() + $window.height() * 0.5 > $element.offset().top) {
					$element.addClass('is--visible');
				}

				scrolling = false;
			};

			plugin.checkLabel = function() {
				plugin.updateLabel( $element.find('.ee-image-comparison__label[data-type="modified"]'), $element.find('.ee-image-comparison__image'), 'left');
				plugin.updateLabel( $element.find('.ee-image-comparison__label[data-type="original"]'), $element.find('.ee-image-comparison__image'), 'right');

				resizing = false;
			};

			plugin.updateLabel = function( label, resizeElement, position ) {
				if ( position == 'left' ) {
					( label.offset().left + label.outerWidth() < resizeElement.offset().left + resizeElement.outerWidth() ) ? label.removeClass('is--hidden') : label.addClass('is--hidden') ;
				} else {
					( label.offset().left > resizeElement.offset().left + resizeElement.outerWidth() ) ? label.removeClass('is--hidden') : label.addClass('is--hidden') ;
				}
			};

			plugin.setup = function() {
				plugin.drags(
					$element.find('.ee-image-comparison__handle'),
					$element.find('.ee-image-comparison__image'),
					$element,
					$element.find('.ee-image-comparison__label[data-type="original"]'),
					$element.find('.ee-image-comparison__label[data-type="modified"]')
				);
			};

			plugin.events = function() {

				$window.on('scroll', function() {
					if( ! scrolling ) {
						scrolling = true;
						( ! window.requestAnimationFrame )
							? setTimeout( function() { plugin.checkPosition(); }, 100 )
							: requestAnimationFrame( function() { plugin.checkPosition(); } );
					}
				});

				$window.on('resize', function(){
					if( ! resizing ) {
						resizing = true;
						( !window.requestAnimationFrame )
							? setTimeout( function() { plugin.checkLabel(); }, 100)
							: requestAnimationFrame( function() { plugin.checkLabel(); });
					}
				});

			};

			plugin.drags = function( dragElement, resizeElement, container, labelContainer, labelResizeElement ) {
				dragElement.on( "mousedown vmousedown", function( e ) {

					dragElement.addClass('draggable');
					resizeElement.addClass('resizable');

					var dragWidth 			= dragElement.outerWidth(),
						xPosition 			= dragElement.offset().left + dragWidth - e.pageX,
						containerOffset 	= container.offset().left,
						containerWidth 		= container.outerWidth(),
						minLeft 			= containerOffset - dragWidth / 2,
						maxLeft 			= containerOffset + containerWidth - dragWidth / 2;
					
					dragElement.parents().on("mousemove vmousemove", function(e) {

						if( ! dragging ) {
							dragging = true;

							( ! window.requestAnimationFrame )
								? setTimeout( function() {
									plugin.animateDraggedHandle( e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement);
								}, 100)
								: requestAnimationFrame( function() {
									plugin.animateDraggedHandle( e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement);
								} );
						}

					}).on("mouseup vmouseup", function( e ) {
						dragElement.removeClass('draggable');
						resizeElement.removeClass('resizable');
					});

					e.preventDefault();

				}).on( "mouseup vmouseup", function( e ) {
					dragElement.removeClass('draggable');
					resizeElement.removeClass('resizable');
				});				
			};

			plugin.animateDraggedHandle = function( e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement ) {

				var leftValue = e.pageX + xPosition - dragWidth;

				if( leftValue < minLeft ) {
					leftValue = minLeft;
				} else if ( leftValue > maxLeft ) {
					leftValue = maxLeft;
				}

				var widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + '%';
				
				$element.find('.draggable').css( 'left', widthValue).on( "mouseup vmouseup", function() {
					$(this).removeClass('draggable');
					resizeElement.removeClass('resizable');
				});

				$element.find('.resizable').css( 'width', widthValue ); 

				plugin.updateLabel( labelResizeElement, resizeElement, 'left');
				plugin.updateLabel( labelContainer, resizeElement, 'right');
				dragging = false;
			};

			plugin.destroy = function() {

				// $window.off( 'scroll', plugin.update );
				$element.removeData( 'imageComparison' );

			};

			plugin.init();

		};

		$.fn.imageComparison = function(options) {

			return this.each(function() {

				$.fn.imageComparison.destroy = function() {
					if( 'underfined' !== typeof( plugin ) ) {
						$(this).data( 'imageComparison' ).destroy();
						$(this).removeData( 'imageComparison' );
					}
				}

				if (undefined === $(this).data('imageComparison')) {
					var plugin = new $.imageComparison(this, options);
					$(this).data('imageComparison', plugin);
				}
			});

		};

	}

)( jQuery, window, document );