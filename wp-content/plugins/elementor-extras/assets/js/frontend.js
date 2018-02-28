var isAdminBar		= false,
	isEditMode		= false;

( function( $ ) {

	var getGlobalSettings = function( section ) {
		
		if ( section in elementorFrontendConfig.settings ) {
			return elementorFrontendConfig.settings[section];
		}

		return false;
	}

	var getElementSettings = function( $element ) {
		var elementSettings = {},
			modelCID 		= $element.data( 'model-cid' );

		if ( isEditMode && modelCID ) {
			var settings 		= elementorFrontend.config.elements.data[ modelCID ],
				settingsKeys 	= elementorFrontend.config.elements.keys[ settings.attributes.widgetType || settings.attributes.elType ];

			jQuery.each( settings.getActiveControls(), function( controlKey ) {
				if ( -1 !== settingsKeys.indexOf( controlKey ) ) {
					elementSettings[ controlKey ] = settings.attributes[ controlKey ];
				}
			} );
		} else {
			elementSettings = $element.data('settings') || {};
		}

		return elementSettings;
	};

	var InlineSvgFrontEndHandler = function( $scope, $ ) {

		// Setup vars
		var elementSettings = getElementSettings( $scope ),
			$wrapper = $scope.find( '.ee-inline-svg' );

		// Initially we have no value so lets ignore this case
		if ( ! elementSettings.svg.url )
			return;

		// Check the extension means we're expecting an svg file type or quit
		if ( elementSettings.svg.url.split('.').pop().toLowerCase() !== 'svg' ) {
			alert( "Please select a SVG file format." );
			return;
		}

		// Get the file
		jQuery.get( elementSettings.svg.url, function( data ) {

			// And append the the first node to our wrapper
			$wrapper.html( $(data).find('svg') );

			var $svg = $wrapper.find( 'svg' ),
			
				svgTitle 		= $svg.find( 'title' ),
				svgDesc 		= $svg.find( 'desc' ),
				svgFills 		= $svg.find( '*[fill]' ),
				svgShapes 		= $svg.find( 'circle, ellipse, polygon, rect, path, line, polyline' ),
				svgNonFills 	= $svg.find( 'circle, ellipse, polygon, rect, path' ).filter(':not([fill])'),
				svgStrokes 		= $svg.find( '*[stroke]' ),
				svgNonStrokes 	= $svg.find( 'line, polyline' ).filter(':not([fill])');

			// Remove unnecessary tags
			svgTitle.remove();
			svgDesc.remove();

			// Remove inline CSS
			if ( 'yes' === elementSettings.remove_inline_css ) {
				// Convert css styles to attributes
				svgShapes.each( function() {
					stroke = $(this).css( 'stroke' );
					strokeWidth = $(this).css( 'stroke-width' );
					strokeLinecap = $(this).css( 'stroke-linecap' );
					strokeDasharray = $(this).css( 'stroke-dasharray' );
					strokeMiterlimit = $(this).css( 'stroke-miterlimit' );
					fill = $(this).css( 'fill' );

					$(this).attr( 'stroke', stroke );
					$(this).attr( 'stroke-width', strokeWidth );
					$(this).attr( 'stroke-linecap', strokeLinecap );
					$(this).attr( 'stroke-dasharray', strokeDasharray );
					$(this).attr( 'stroke-miterlimit', strokeMiterlimit );
					$(this).attr( 'fill', fill );

				});

				$svg.find( 'style' ).remove();
			}

			// Color override
			if ( 'yes' === elementSettings.override_colors ) {
				svgShapes.filter('[fill]:not([fill="none"])').attr( 'fill', 'currentColor' );
				svgShapes.filter('[stroke]:not([stroke="none"])').attr( 'stroke', 'currentColor' );

				// Remove comments from markup
				// $svg.contents().each( function() {
				//     if ( this.nodeType === Node.COMMENT_NODE ) { $(this).remove(); }
				// });
			}

			if ( 'yes' !== elementSettings.maintain_ratio ) {
				$svg[0].setAttribute( 'preserveAspectRatio', 'none' );
			}

			if ( 'yes' === elementSettings.sizing ) {
				$svg.removeAttr( 'width' );
				$svg.removeAttr( 'height' );
			}
		} );

	};

	var PostsClassicFrontEndHandler = function( $scope, $ ) {

		if ( isEditMode )
			return;

		var elementSettings = getElementSettings( $scope ),
			$scope_id 		= $scope.data('id'),
			$loop 			= $scope.find( '.ee-loop' ),

			element_class 	= '.elementor-element-' + $scope_id,
			is_layout 		= 'default' !== elementSettings.classic_layout && 1 < elementSettings.columns,
			is_infinite 	= 'yes' === elementSettings.classic_infinite_scroll,
			is_filtered 	= 'yes' === elementSettings.classic_filters,
			has_history 	= 'yes' === elementSettings.classic_infinite_scroll_history ? 'replace' : false,

			$filters 		= $scope.find('.ee-filters'),
			$triggers 		= $filters.find( '[data-filter]' ),

			isotopeInstance = null;

		var infiniteScrollArgs = {
				history 	: has_history,
				path 		: element_class + ' .ee-pagination__next',
				append 		: element_class + ' .ee-loop__item',
				hideNav 	: element_class + ' .ee-pagination',
				status 		: element_class + ' .ee-load-status',
			},

			isotopeArgs = {
				itemSelector	: element_class + ' .ee-loop__item',
				layoutMode 		: is_layout ? elementSettings.classic_layout : 'masonry',
				masonry			: is_layout ? { columnWidth: element_class + ' .ee-grid__item--sizer' } : '',
  				percentPosition : true,
  				hiddenStyle 	: {
  					opacity 	: 0,
  				},
			},

			filteryArgs = {
				filterables : '.ee-loop__item',
				activeFilterClass : 'ee--active',
			};

		if ( is_infinite && 'yes' === elementSettings.classic_infinite_scroll_button ) {

			infiniteScrollArgs.loadOnScroll = false;
			infiniteScrollArgs.scrollThreshold = false;
			infiniteScrollArgs.button = '.ee-load-button__trigger';

			$loop.on( 'request.infiniteScroll', function( event, path ) {
				$scope.find( '.ee-load-button' ).hide();
			});

			$loop.on( 'load.infiniteScroll', function( event, response, path ) {
				$scope.find( '.ee-load-button' ).show();
			});

		}

		if ( is_infinite && ! is_layout ) {

			$loop.infiniteScroll( infiniteScrollArgs );

		} else if ( is_layout ) {

			$loop.imagesLoaded( function() {

				var $isotope = $loop.isotope( isotopeArgs );
					isotopeInstance = $loop.data( 'isotope' );

				if ( is_infinite ) {

					var $filters 	= $scope.find('.ee-filters');

					if ( ! is_filtered || ! $triggers.length ) {
						infiniteScrollArgs.outlayer = isotopeInstance;
					}

					$isotope.infiniteScroll( infiniteScrollArgs );
				}

			});

		}

		if ( is_filtered ) {

			if ( $triggers.length ) {

				if ( is_layout ) {

					if ( is_infinite ) {

						$loop.on( 'load.infiniteScroll', function( event, response, path ) {
							var $items = $( response ).find('.ee-loop__item');
							
							$items.imagesLoaded( function() {
								$loop.append( $items );

								if ( isotopeInstance ) {
									$loop.isotope( 'insert', $items );
								}
							});
						});

					}

					// Filter by default
					var $default_trigger = $triggers.filter('.ee--active');

					if ( $default_trigger.length ) {
						default_filter = $default_trigger.data('filter');
						$loop.isotope({ filter: default_filter });
					}

					// Filter by click
					$triggers.on( 'click', function() {
						var _filter = $(this).data('filter');
						$loop.isotope({ filter: _filter });

						$triggers.removeClass('ee--active');
						$(this).addClass('ee--active');
					});

				} else {

					$filters.filtery( filteryArgs );

					var filteryInstance = $filters.data( 'filtery' );

					if ( is_infinite ) {
						$loop.on( 'load.infiniteScroll', function( event, response, path ) {
							var $items = $( response ).find('.ee-loop__item');
							
							$items.imagesLoaded( function() {
								$loop.append( $items );
								filteryInstance.update();
							});
						});
					}

				}

			}

		}

	};

	var PostsCarouselFrontEndHandler = function( $scope, $ ) {

		var elementSettings = getElementSettings( $scope ),
			$swiper_id 		= $scope.data('id'),
			$swiper 		= $scope.find( '.ee-swiper__container' ),

			pagination_pos 	= ( 'outside' === elementSettings.carousel_pagination_position ) ? 'outside' : 'inside',

			breakpoints 	= {
				tablet : 1024,
				mobile : 767,
			};

		if( $swiper.data( 'swiper' ) ) {
			swiperInstance = $swiper.data( 'swiper' );
			swiperInstance.destroy( true, true );
			return;
		}

		var swiperArgs = {
			slidesPerView 			: 3,
			autoplay 				: 0,
			slidesPerColumn 		: 1,
			autoHeight				: elementSettings.carousel_autoheight,
			spaceBetween 			: 0,
			pagination 				: {},
			navigation 				: {},
			grabCursor 				: true,
			effect 					: elementSettings.carousel_effect,
			// observer 				: true,
			// observeParents			: true,
			breakpoints: {
				1024 : {
					slidesPerView 	: 2,
					spaceBetween 	: 12,
					slidesPerColumn : 1,
				},
				767 : {
					slidesPerView 	: 1,
					spaceBetween 	: 12,
					slidesPerColumn : 1,
				},
			}
		};

		// Number of columns

		if ( elementSettings.columns ) {
			swiperArgs.slidesPerView = elementSettings.columns;
		}

		if ( elementSettings.columns_tablet ) {
			swiperArgs.breakpoints[ breakpoints.tablet ].slidesPerView = elementSettings.columns_tablet;
		}

		if ( elementSettings.columns_mobile ) {
			swiperArgs.breakpoints[ breakpoints.mobile ].slidesPerView = elementSettings.columns_mobile;
		}

		// Rows

		if ( elementSettings.carousel_slides_per_column ) {
			swiperArgs.slidesPerColumn = elementSettings.carousel_slides_per_column;
		}

		if ( elementSettings.carousel_slides_per_column_tablet ) {
			swiperArgs.breakpoints[ breakpoints.tablet ].slidesPerColumn = elementSettings.carousel_slides_per_column_tablet;
		}

		if ( elementSettings.carousel_slides_per_column_mobile ) {
			swiperArgs.breakpoints[ breakpoints.mobile ].slidesPerColumn = elementSettings.carousel_slides_per_column_mobile;
		}

		// Column spacing

		if ( elementSettings.carousel_grid_columns_spacing.size && 1 < elementSettings.columns ) {
			swiperArgs.spaceBetween = elementSettings.carousel_grid_columns_spacing.size;
		}

		if ( elementSettings.carousel_grid_columns_spacing_tablet.size && 1 < elementSettings.columns_tablet ) {
			swiperArgs.breakpoints[ breakpoints.tablet ].spaceBetween = elementSettings.carousel_grid_columns_spacing_tablet.size;
		}

		if ( elementSettings.carousel_grid_columns_spacing_mobile.size && 1 < elementSettings.columns_mobile ) {
			swiperArgs.breakpoints[ breakpoints.mobile ].spaceBetween = elementSettings.carousel_grid_columns_spacing_mobile.size;
		}

		// Arrows and pagination

		if ( 'on' === elementSettings.carousel_arrows ) {
			swiperArgs.buttonDisabledClass = 'ee-swiper__button--disabled';
			swiperArgs.prevButton = '.ee-swiper__button--prev-' + $swiper_id;
			swiperArgs.nextButton = '.ee-swiper__button--next-' + $swiper_id;
		}

		if ( 'on' === elementSettings.carousel_pagination ) {

			swiperArgs.pagination = '.ee-swiper__pagination-' + $swiper_id + '.ee-swiper__pagination--' + pagination_pos;
			
			swiperArgs.paginationType = elementSettings.carousel_pagination_type;

			if ( 'yes' === elementSettings.carousel_pagination_clickable ) {
				swiperArgs.paginationClickable = true;
			}
		}

		// Loop

		if ( 'yes' === elementSettings.carousel_loop ) {
			swiperArgs.loop = true;
		}

		// Autoplay

		if ( false === isEditMode && 'yes' === elementSettings.carousel_autoplay ) {
			swiperArgs.autoplay = elementSettings.carousel_autoplay_speed;
			swiperArgs.autoplayDisableOnInteraction = !! elementSettings.carousel_pause_on_interaction;
		}

		// Speed 

		if ( elementSettings.carousel_speed.size ) {
			swiperArgs.speed = elementSettings.carousel_speed.size;
		}

		// Resistance 

		if ( elementSettings.carousel_resistance_ratio.size ) {
			swiperArgs.resistanceRatio = 1 - elementSettings.carousel_resistance_ratio.size;
		}

		if ( 'yes' === elementSettings.carousel_free_mode ) {
			swiperArgs.freeMode = true;
			swiperArgs.freeModeMomentum = false;
			swiperArgs.freeModeSticky = false;

			if ( 'yes' === elementSettings.carousel_free_mode_momentum ) {
				swiperArgs.freeModeMomentum = true;
			}

			if ( 'yes' === elementSettings.carousel_free_mode_sticky ) {
				swiperArgs.freeModeSticky = true;
			}
		}

		var swiperInstance = new Swiper( $swiper, swiperArgs );

		$swiper.find('.ee-grid__item').resize( function() {
			swiperInstance.onResize();
		});

	};

	var StickyFrontEndHandler = function( $scope, $ ) {

		var elementSettings = getElementSettings( $scope ),
			customParent 	= false,
			stickParent 	= $scope.parent();

		// Detach every time
		if ( $scope.data('sticky_kit') ) $scope.trigger("sticky_kit:detach");

		// Exit if sticky not enabled
		if ( 'yes' !== elementSettings.sticky_enable )
			return;

		var _window 	= isEditMode ? elementor.$previewContents : $(window),
			stickyArgs 	= {
				offset_top 		: ( isAdminBar ) ? 32 : 0,
				sticky_class 	: 'elementor-extras-sticky--stuck',
			};

		// Editor mode
		if ( isEditMode ) {
			stickyArgs.win = elementor.$previewContents;
		}

		// Determine parent
		if ( '' !== elementSettings.sticky_parent ) {
			if ( 'body' == elementSettings.sticky_parent ) {
				stickParent = $( elementSettings.sticky_parent );
			} else if ( '' !== elementSettings.sticky_parent_selector && $scope.closest( elementSettings.sticky_parent_selector ).length > 0 ) {
				customParent = true;
				stickParent = $( elementSettings.sticky_parent_selector );
			}
		}

		stickParent.addClass( 'elementor-extras-sticky-parent' );
		stickyArgs.parent = stickParent;

		// Determine offset
		if ( elementSettings.sticky_offset.size ) {
			stickyArgs.offset_top = stickyArgs.offset_top + elementSettings.sticky_offset.size;
		}

		var _sticky_kit = function() {
			$scope.stick_in_parent( stickyArgs );

			$scope.on("sticky_kit:bottom", function(e) {

				$scope.addClass('elementor-extras-sticky--stuck-bottom');

				if ( customParent ) {
					stickParent.addClass( 'elementor-extras-sticky-parent--stuck' );
					$scope.css( 'position', 'fixed' );
				}

			}).on("sticky_kit:unbottom", function(e) {

				if ( customParent ) {
					stickParent.removeClass( 'elementor-extras-sticky-parent--stuck' );
				}

				$scope.removeClass('elementor-extras-sticky--stuck-bottom');

			});
		}

		// Responsive sticking
		if ( 'none' !== elementSettings.sticky_unstick_on ) {

			var breakpoint  	= elementSettings.sticky_unstick_on,
				_breakpoint 	= ( breakpoint === 'tablet' ) ? 1024 : 768,
				_timeout 		= null,
				_sticky_update 	= function() {

					if ( _window.width() < _breakpoint ) {
						$scope.trigger( "sticky_kit:detach" );
					} else {
						_sticky_kit();
					}
				};

			_sticky_update();

			$(window).on( 'resize', function () {
				clearTimeout( _timeout );
				_timeout = setTimeout( _sticky_update, 500 );
			});

		} else {

			_sticky_kit();
			
		}

		if ( isEditMode ) {
			$scope.trigger("sticky_kit:recalc");
		}
	};

	var TableFrontEndHandler = function( $scope, $ ) {

		var elementSettings = getElementSettings( $scope ),
			$table 			= $scope.find('table.ee-table'),
			$instance 		= $table.data('tablesorter');

		if ( 'yes' == elementSettings.sortable ) {
			$scope.find('table.ee-table').tablesorter({
				cssHeader 	: 'ee-table__sort',
				cssAsc 		: 'ee-table__sort--up',
				cssDesc 	: 'ee-table__sort--down',
			});
		} else {
			$scope.find('table.ee-table').removeData('tablesorter');
		}
	};

	var ParallaxBackgroundFrontEndHandler = function( $scope, $ ) {

		if ( 'section' !== $scope.data('element_type') )
			return;

		var elementSettings = getElementSettings( $scope );

		// Reinit parallax background if found
		if ( $scope.data( 'parallaxBackground' ) ) $scope.data( 'parallaxBackground' ).destroy();

		// Targetting sections with active parallax on background overlay
		if ( undefined === typeof elementSettings.background_image || 'yes' !== elementSettings.parallax_background_enable ) {

			// Resolve AE Pro conflict
			// AE Pro adds background image using inline styling, so
			// we need to not remove inline styling if that happens
			// We also check to make sure we are only removing our 'none' value
			if ( ! $scope.data( 'ae-bg' ) && $scope.css( 'background-image' ) === 'none' ) {
				$scope.css( 'background-image', "" );
			}

			return;
		}

		var parallaxBackgroundArgs = {
			parallaxBgImage 	: elementSettings.background_image['url'],
			parallaxResizeWatch : $scope.find('.elementor-container'),
		};

		if ( elementSettings.parallax_background_speed ) {
			parallaxBackgroundArgs.parallaxSpeed = elementSettings.parallax_background_speed.size;
		}

		if ( elementSettings.parallax_background_direction ) {
			parallaxBackgroundArgs.parallaxDirection = elementSettings.parallax_background_direction;
		}

		// Editor mode
		if ( isEditMode ) {
			parallaxBackgroundArgs.win = elementor.$previewContents;
		}

		$scope.parallaxBackground( parallaxBackgroundArgs );
	};

	var UnfoldFrontEndHandler = function( $scope, $ ) {

		var elementSettings = getElementSettings( $scope ),
			$unfold 		= $scope.find('.ee-unfold'),
			$unfold_text 	= $unfold.find('.ee-button-text');

		// Detach every time
		if ( $unfold.data('unfold') ) $unfold.data("unfold").destroy();

		var unfoldArgs = {
			
		};

		if ( elementSettings.animation_unfold ) {
			unfoldArgs.animation_unfold  = elementSettings.animation_unfold;
		}

		if ( elementSettings.animation_fold ) {
			unfoldArgs.animation_fold  = elementSettings.animation_fold;
		}

		if ( elementSettings.easing_unfold ) {
			unfoldArgs.easing_unfold  = elementSettings.easing_unfold;
		}

		if ( elementSettings.easing_fold ) {
			unfoldArgs.easing_fold  = elementSettings.easing_fold;
		}

		if ( elementSettings.steps_unfold ) {
			unfoldArgs.steps_unfold  = elementSettings.steps_unfold.size;
		}

		if ( elementSettings.steps_fold ) {
			unfoldArgs.steps_fold  = elementSettings.steps_fold.size;
		}

		if ( elementSettings.slow_unfold ) {
			unfoldArgs.slow_unfold  = elementSettings.slow_unfold.size;
		}

		if ( elementSettings.slow_fold ) {
			unfoldArgs.slow_fold  = elementSettings.slow_fold.size;
		}

		if ( elementSettings.duration_unfold ) {
			unfoldArgs.duration_unfold  = elementSettings.duration_unfold.size;
		}

		if ( elementSettings.duration_fold ) {
			unfoldArgs.duration_fold  = elementSettings.duration_fold.size;
		}

		if ( 'lines' === elementSettings.visible_type ) {
			unfoldArgs.visible_lines  = elementSettings.visible_lines.size;
		}

		if ( elementSettings.visible_percentage ) {
			unfoldArgs.visible_percentage  = elementSettings.visible_percentage.size;
		}

		if ( '' !== $unfold_text.data('open-label') ) {
			unfoldArgs.text_closed  = $unfold_text.data('open-label');
		}

		if ( '' !== $unfold_text.data('close-label') ) {
			unfoldArgs.text_open  = $unfold_text.data('close-label');
		}

		$unfold.unfold( unfoldArgs );

		if ( isEditMode ) {
			
		}
	};

	var PortfolioFrontEndHandler = function( $scope, $ ) {

		var elementSettings = getElementSettings( $scope );

		if ( 'yes' !== elementSettings.parallax_enable )
			return;

		var parallaxGalleryArgs = {
			transformItem 	: 'a.elementor-post__thumbnail__link',
			columns 		: elementSettings.columns,
		};

		if ( 'none' !== elementSettings.parallax_disable_on ) {
			parallaxGalleryArgs.disableOn = elementSettings.parallax_disable_on;
		}

		if ( elementSettings.columns_tablet ) {
			parallaxGalleryArgs.columnsTablet = elementSettings.columns_tablet;
		}

		if ( elementSettings.columns_mobile ) {
			parallaxGalleryArgs.columnsMobile = elementSettings.columns_mobile;
		}

		if ( elementSettings.parallax_speed_tablet.size ) {
			parallaxGalleryArgs.speedTablet = elementSettings.parallax_speed_tablet.size;
		}

		if ( elementSettings.parallax_speed_mobile.size ) {
			parallaxGalleryArgs.speedMobile = elementSettings.parallax_speed_mobile.size;
		}

		if ( elementSettings.parallax_speed.size ) {
			parallaxGalleryArgs.speed = elementSettings.parallax_speed.size;
		}

		if ( isEditMode ) {
			parallaxGalleryArgs.scope = elementor.$previewContents;
		}

		$scope.find('.elementor-portfolio').parallaxGallery( parallaxGalleryArgs );
	};

	var GalleryExtraFrontEndHandler = function( $scope, $ ) {


		var elementSettings = getElementSettings( $scope ),
			$gallery = $scope.find( '.ee-gallery' );

		if ( 'yes' === elementSettings.parallax_enable ) {
			
			var parallaxGalleryArgs = {
				columns : elementSettings.columns
			};

			if ( 'none' !== elementSettings.parallax_disable_on ) {
				parallaxGalleryArgs.disableOn = elementSettings.parallax_disable_on;
			}

			if ( elementSettings.columns_tablet ) {
				parallaxGalleryArgs.columnsTablet = elementSettings.columns_tablet;
			}

			if ( elementSettings.columns_mobile ) {
				parallaxGalleryArgs.columnsMobile = elementSettings.columns_mobile;
			}

			if ( elementSettings.parallax_speed.size ) {
				parallaxGalleryArgs.speed = elementSettings.parallax_speed.size;
			}

			if ( elementSettings.parallax_speed_tablet.size ) {
				parallaxGalleryArgs.speedTablet = elementSettings.parallax_speed_tablet.size;
			}

			if ( elementSettings.parallax_speed_mobile.size ) {
				parallaxGalleryArgs.speedMobile = elementSettings.parallax_speed_mobile.size;
			}

			if ( isEditMode ) {
				parallaxGalleryArgs.scope = elementor.$previewContents;
			}

			$gallery.parallaxGallery( parallaxGalleryArgs );

		} else {

			if ( 'yes' === elementSettings.masonry_enable && ! isEditMode ) {
				var isotopeArgs = {
						itemSelector	: '.ee-gallery__item',
		  				percentPosition : true,
		  				hiddenStyle 	: {
		  					opacity 	: 0,
		  				},
		  				layoutMode: 'packery',
					};

				$gallery.imagesLoaded( function() {
					var $isotope = $gallery.isotope( isotopeArgs ),
						isotopeInstance = $gallery.data( 'isotope' );
				});
			}

		}

		if ( 'yes' === elementSettings.tilt_enable ) {
			$gallery.find( '.ee-gallery__tilt' ).tilt({
				maxTilt 		: elementSettings.tilt_amount.size,
				scale 			: elementSettings.tilt_scale.size,
				speed 			: elementSettings.tilt_speed.size,
				axis 			: elementSettings.tilt_axis,
				perspective 	: 1000,
			});
		}
	};

	var ParallaxFrontEndHandler = function( $scope, $ ) {

		var elementSettings = getElementSettings( $scope ),
			$element = $scope;

		if ( 'column' === $scope.data('element_type') ) $element = $scope.find( '.elementor-column-wrap' );
		if ( 'widget'=== $scope.data('element_type') ) $element = $scope.find( '.elementor-widget-container' );

		if ( $element.data('parallaxElement') ) $element.data('parallaxElement').destroy();

		if ( 'yes' !== elementSettings.parallax_element_enable )
			return;

		var parallaxElementArgs = {
			relative : elementSettings.parallax_element_relative
		};

		if ( 'none' !== elementSettings.parallax_element_disable_on ) {
			parallaxElementArgs.disableOn = elementSettings.parallax_element_disable_on;
		}

		if ( elementSettings.parallax_element_speed.size ) {
			parallaxElementArgs.speed = elementSettings.parallax_element_speed.size;
		}

		if ( elementSettings.parallax_element_speed_tablet.size ) {
			parallaxElementArgs.speedTablet = elementSettings.parallax_element_speed_tablet.size;
		}

		if ( elementSettings.parallax_element_speed_mobile.size ) {
			parallaxElementArgs.speedMobile = elementSettings.parallax_element_speed_mobile.size;
		}

		if ( isEditMode ) {
			parallaxElementArgs.scope = elementor.$previewContents;
		}

		$element.parallaxElement( parallaxElementArgs );
	};

	var GallerySliderFrontEndHandler = function( $scope, $ ) {

		var $carousel 		= $scope.find('.ee-gallery-slider__carousel'),
			$preview 		= $scope.find('.ee-gallery-slider__preview'),
			$thumbs 		= $scope.find('.ee-gallery .ee-gallery__item'),
			elementSettings = getElementSettings( $scope );

		var slickArgs = {
				slidesToShow 	: 1,
				slidesToScroll	: 1,
				adaptiveHeight 	: 'yes' === elementSettings.adaptive_height,
				autoplay 		: 'yes' === elementSettings.autoplay,
				autoplaySpeed 	: elementSettings.autoplay_speed,
				infinite		: 'yes' === elementSettings.infinite,
				pauseOnHover 	: 'yes' === elementSettings.pause_on_hover,
				speed 			: elementSettings.speed,
				arrows 			: false,
				dots 			: false,
				rtl 			: 'rtl' === elementSettings.direction,
				fade			: 'fade' === elementSettings.effect,
			};

		$carousel.slick( slickArgs );

		$thumbs.removeClass('is--active');
		$thumbs.eq(0).addClass('is--active');

		$carousel.slick( 'setPosition' );

		$carousel.on('beforeChange', function ( event, slick, currentSlide, nextSlide ) {
			var currentSlide = nextSlide;
			$thumbs.removeClass('is--active');
			$thumbs.eq( currentSlide ).addClass('is--active');
		});

		$thumbs.each( function( currentSlide ) {
			$(this).on( 'click', function ( e ) {
				e.preventDefault();
				$carousel.slick( 'slickGoTo', currentSlide );
			});
		});

		if ( isEditMode ) {
			$preview.resize( function() {
				$carousel.slick( 'setPosition' );
			});
		}
	};

	var TimelineFrontEndHandler = function( $scope, $ ) {

		var timelineArgs = {};

		if ( isEditMode ) {
			timelineArgs.scope = elementor.$previewContents;
		}

		$scope.find('.ee-timeline').timeline( timelineArgs );
	};

	var HeadingExtendedFrontEndHandler = function( $scope, $ ) {

		var elementSettings = getElementSettings( $scope );

		if ( 'yes' !== elementSettings.title_long_shadow_enable )
			return;

		var $selector = $scope.find('.elementor-heading-extended-title');
			longShadowArgs = {};

		if ( elementSettings.title_long_shadow_color ) {
			longShadowArgs.colorShadow = elementSettings.title_long_shadow_color;
		}

		if ( elementSettings.title_long_shadow_size ) {
			longShadowArgs.sizeShadow = elementSettings.title_long_shadow_size.size;
		}

		if ( elementSettings.title_long_shadow_direction ) {
			longShadowArgs.directionShadow = elementSettings.title_long_shadow_direction;
		}

		$selector.find('.elementor-heading-extended--long-shadow').longShadow( longShadowArgs );
	};

	var ImageComparisonFrontEndHandler = function( $scope, $ ) {

		var imageComparisonArgs = {};

		if ( isEditMode ) {
			imageComparisonArgs.scope = elementor.$previewContents;
		}

		$scope.find('.ee-image-comparison').imageComparison( imageComparisonArgs );
	};

	var DevicesFrontEndHandler = function( $scope, $ ) {

		var elementSettings = getElementSettings( $scope );

		// Setup vars
		var $wrapper 		= $scope.find( '.elementor-device-wrapper' ),
			$device 		= $scope.find( '.elementor-device' ),
			$shape 			= $device.find( '.elementor-device-shape' ),
			url 			= null,
			svg 			= null;

			// Fallback to phone when no switcher option is selected
			if ( ! elementSettings.device_type ) {
				elementSettings.device_type = 'phone';
			}

		// Set SVG URL
		url = elementorExtrasFrontendConfig.urls.assets + 'shapes/' + elementSettings.device_type + '.svg';

		// Get the file
		jQuery.get( url, function( data ) {

			// And append the the first node to our wrapper
			$shape.html( data.childNodes[0] );

			svg = $shape.find( "svg.devices-elementor-svg" ).get(0);

		});

		if ( elementSettings.device_orientation_control ) {
			$scope.find('.elementor-device-orientation').on( 'click', function() {
				$scope.toggleClass( 'elementor-device-orientation-landscape' );
			} );
		}

		var $video_wrapper = $scope.find( '.elementor-extras-html5-video' );

		if ( $video_wrapper.length > 0 ) {

			$video_wrapper.videoPlayer({
				playOnViewport	: elementSettings.video_play_viewport,
				stopOffViewport	: elementSettings.video_stop_viewport,
				restartOnPause	: 'yes' === elementSettings.video_restart_on_pause,
				volume			: elementSettings.video_volume.size,
				cover 			: $scope.find( '.elementor-extras-html5-video__cover' ),
				controls 		: $scope.find( '.elementor-extras-html5-video__controls' ),
				overlays 		: $scope.find( '.video__overlay' ),
			});

		}
		
	};

	var HTML5VideoFrontEndHandler = function( $scope, $ ) {

		var elementSettings = getElementSettings( $scope );

		var $video_wrapper = $scope.find( '.elementor-extras-html5-video' );

		$video_wrapper.videoPlayer({
			playOnViewport	: 'yes' === elementSettings.video_play_viewport,
			stopOffViewport	: 'yes' === elementSettings.video_stop_viewport,
			endAtLastFrame 	: 'yes' === elementSettings.video_end_at_last_frame,
			restartOnPause	: 'yes' === elementSettings.video_restart_on_pause,
			volume			: elementSettings.video_volume.size,
			cover 			: $scope.find( '.elementor-extras-html5-video__cover' ),
			controls 		: $scope.find( '.elementor-extras-html5-video__controls' ),
			overlays 		: $scope.find( '.video__overlay' ),
		});
		
	};

	var TooltipsFrontEndHandler = function( $scope, $ ) {

		var elementSettings 	= getElementSettings( $scope ),
			globalSettings 		= getGlobalSettings( 'extras' ),
			$hotspots			= $scope.find( '.hotip' ),
			hotipsArgs = {
				position 	: elementSettings.position || globalSettings.ee_tooltips_position,
			};

		if ( elementSettings.trigger ) {
			hotipsArgs.trigger = elementSettings.trigger;
		}

		if ( elementSettings.delay_in.size ) {
			hotipsArgs.delayIn = elementSettings.delay_in.size;
		} else if ( globalSettings.ee_tooltips_delay_in.size ) {
			hotipsArgs.delayIn = globalSettings.ee_tooltips_delay_in.size;
		}

		if ( elementSettings.delay_out.size ) {
			hotipsArgs.delayOut = elementSettings.delay_out.size;
		} else if ( globalSettings.ee_tooltips_delay_out.size ) {
			hotipsArgs.delayOut = globalSettings.ee_tooltips_delay_out.size;
		}

		if ( elementSettings.duration.size ) {
			hotipsArgs.speed = elementSettings.duration.size;
		} else if ( globalSettings.ee_tooltips_duration.size ) {
			hotipsArgs.speed = globalSettings.ee_tooltips_duration.size;
		}

		if ( isEditMode ) {
			hotipsArgs.scope = elementor.$previewContents;
			$hotspots.attr( 'data-hotips-class', 'ee-global ee-tooltip ee-tooltip-' + $scope.data('id') );
		}

		$hotspots.hotips( hotipsArgs );
	};

	var GlobalTooltipFrontEndHandler = function( $scope, $ ) {

		var elementSettings 	= getElementSettings( $scope ),
			globalSettings 		= getGlobalSettings( 'extras' ),
			$target 			= $scope.find( '> .elementor-widget-container' );

		if ( $target.data( 'hotips' ) ) {
			$target.data( 'hotips' ).destroy();
		}

		if ( 'yes' !== elementSettings.tooltip_enable )
			return;

		var hotipsArgs = {
				position 	: elementSettings.tooltip_position || globalSettings.ee_tooltips_position,
				content 	: elementSettings.tooltip_content,
			};

		if ( 'custom' === elementSettings.tooltip_target ) {
			if ( '' !== elementSettings.tooltip_selector ) {
				$_target = $scope.find( elementSettings.tooltip_selector );

				if ( $_target.length ) {
					$target = $_target;
				}
			}
		}

		if ( elementSettings.tooltip_trigger ) {
			hotipsArgs.trigger = elementSettings.tooltip_trigger;
		}

		if ( elementSettings.tooltip_delay_in.size ) {
			hotipsArgs.delayIn = elementSettings.tooltip_delay_in.size;
		} else if ( globalSettings.ee_tooltips_delay_in.size ) {
			hotipsArgs.delayIn = globalSettings.ee_tooltips_delay_in.size;
		}

		if ( elementSettings.tooltip_delay_out.size ) {
			hotipsArgs.delayOut = elementSettings.tooltip_delay_out.size;
		} else if ( globalSettings.ee_tooltips_delay_out.size ) {
			hotipsArgs.delayOut = globalSettings.ee_tooltips_delay_out.size;
		}

		if ( elementSettings.tooltip_duration.size ) {
			hotipsArgs.speed = elementSettings.tooltip_duration.size;
		} else if ( globalSettings.ee_tooltips_duration.size ) {
			hotipsArgs.speed = globalSettings.ee_tooltips_duration.size;
		}

		if ( isEditMode ) {
			hotipsArgs.scope = elementor.$previewContents;
		}

		$target.attr( 'data-hotips-class', 'ee-global ee-tooltip ee-tooltip-' + $scope.data('id') );

		$target.hotips( hotipsArgs );

	};

	var CircleProgressFrontEndHandler = function( $scope, $ ) {

		var elementSettings = getElementSettings( $scope ),
			$circle 		= $scope.find( '.elementor-circle-progress' ),
			$value 			= $scope.find( '.elementor-circle-progress-value .value' ),
			$suffix 		= $scope.find( '.elementor-circle-progress-value .suffix' ),

			cpArgs 			= {
				value 		: 0.75,
				reverse 	: 'yes' === elementSettings.reverse,
				lineCap		: elementSettings.lineCap,
				startAngle 	: -Math.PI,
				animation 	: {
					easing 		: elementSettings.easing,
				},
			};

		if ( elementSettings.value.size ) {
			cpArgs.value = elementSettings.value.size;
		}

		if ( elementSettings.size.size ) {
			cpArgs.size = elementSettings.size.size;
		}

		if ( elementSettings.thickness.size ) {

			// Prevent thickness from going over the radius value of the circle
			if ( elementSettings.thickness.size > ( elementSettings.size.size / 2 ) ) {
				cpArgs.thickness = elementSettings.size.size / 2;
			} else {
				cpArgs.thickness = elementSettings.thickness.size;
			}
		}

		if ( elementSettings.angle.size ) {
			cpArgs.startAngle = cpArgs.startAngle + elementSettings.angle.size;
		}

		if ( elementSettings.emptyFill ) {
			cpArgs.emptyFill = elementSettings.emptyFill;
		}

		if ( elementSettings.duration.size ) {
			cpArgs.animation.duration = elementSettings.duration.size;
		}

		$circle.circleProgress( cpArgs ).on( 'circle-animation-progress', function( event, progress, stepValue ) {

			var	value 			= stepValue * 100;

		    $value.text( value.toFixed( 0 ) );
		});

		if ( ! isEditMode ) {
			var canvas = $( $circle.circleProgress( 'widget' ) );
				canvas.stop();

			$circle._appear({
				force_process: true,
			});

			$circle.on('_appear', function() {
				if ( ! $circle.data('animated') ) {
					$circle.circleProgress( 'value', cpArgs.value );
					$circle.data('animated', true);
				}
			});
		}
	};

	$(window).on( 'elementor/frontend/init', function() {

		if ( elementorFrontend.isEditMode() ) {
			isEditMode = true;
		}

		if ( $('body').is('.admin-bar') ) {
			isAdminBar = true;
		}

		elementorFrontend.hooks.addAction( 'frontend/element_ready/image-comparison.default', 		ImageComparisonFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/devices-extended.default', 		DevicesFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/hotspots.default', 				TooltipsFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/button-group.default', 			TooltipsFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/circle-progress.default', 		CircleProgressFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/heading-extended.default', 		HeadingExtendedFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/gallery-extra.default', 			GalleryExtraFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/gallery-slider.default', 		GallerySliderFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/timeline.default', 				TimelineFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/unfold.default', 				UnfoldFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/html5-video.default', 			HTML5VideoFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/table.default', 					TableFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/posts-extra.classic', 			PostsClassicFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/posts-extra.carousel', 			PostsCarouselFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/ee-inline-svg.default', 			InlineSvgFrontEndHandler );
		
		elementorFrontend.hooks.addAction( 'frontend/element_ready/portfolio.default', 				PortfolioFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/global', 						StickyFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/global', 						GlobalTooltipFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/global', 						ParallaxFrontEndHandler );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/section', 						ParallaxBackgroundFrontEndHandler );
	});
} )( jQuery );