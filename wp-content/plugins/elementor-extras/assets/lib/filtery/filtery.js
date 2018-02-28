// -- filtery
// @license filtery v1.0.0 | MIT | Namogo 2017 | https://www.namogo.com
// --------------------------------
;(
    function( $, window, document, undefined ) {

		$.filtery = function(element, options) {

			var defaults = {
				filterables : '.filterable',
				activeFilterClass : 'active',
			};

			var plugin = this;

			plugin.opts = {};

			var $window			= $(window),
				$document		= $(document),
				$element 		= $(element),
				$filters 		= null,
				$filterables 	= null,
				activeFilter 	= null;


			plugin.init = function() {
				plugin.opts = $.extend({}, defaults, options);
				plugin._construct();
			};

			plugin._construct = function() {

				$filters = $element.find('[data-filter]');
				$filterables = $( plugin.opts.filterables );

				plugin.setup();
				plugin.events();

			};

			plugin.setup = function() {

				activeFilter = $filters.filter( '.' + plugin.opts.activeFilterClass ).data('filter');
				plugin.applyFilter( activeFilter );

			};

			plugin.events = function() {
				
				$filters.on( 'click', plugin.onClick );

			};

			plugin.onClick = function( event ) {
				var $filter 	= $(event.target),
					filter 		= $filter.data('filter');

				if ( activeFilter === filter )
					return;

					plugin.applyFilter( filter );
				
					activeFilter = filter;
			}

			plugin.applyFilter = function( filter ) {

				if ( ! filter )
					return;

				$filterables = $( plugin.opts.filterables );

				var $filtered 	= $filterables.filter( filter ),
					$filter 	= $filters.filter( '[data-filter="' + filter + '"]' );
					
				// Hide everything
				$filterables.filter( ':not(' + filter + ')' ).hide();
				$filters.removeClass( plugin.opts.activeFilterClass );

				$filtered.show();
				$filter.addClass( plugin.opts.activeFilterClass );
			}

			plugin.update = function() {
				plugin.applyFilter( activeFilter );
			};

			plugin.destroy = function() {
				$filters.off( 'click', plugin.onClick );
			};

			plugin.init();

		};

		$.fn.filtery = function(options) {

			return this.each(function() {

				$.fn.filtery.destroy = function() {
					if( 'undefined' !== typeof( plugin ) ) {
						$(this).data('filtery').destroy();
						$(this).removeData('filtery');
					}
				}

				$.fn.filtery.update = function() {
					if( 'undefined' !== typeof( plugin ) ) {
						$(this).data('filtery').update();
					}
				}

				if (undefined === $(this).data('filtery')) {
					var plugin = new $.filtery(this, options);
					$(this).data('filtery', plugin);
				}
			});

		};

	}

)( jQuery, window, document );