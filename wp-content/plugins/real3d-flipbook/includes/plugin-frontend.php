<?php
	function real3dflipbook_shortcode($atts){
		// trace($atts);
		$args = shortcode_atts( 
			array(
				'id'   => '-1',
				'name' => '-1',
				'pdf' => '-1',
				'mode' => '-1',
				'viewmode' => '-1',
				'lightboxopened' => '-1',
				'lightboxfullscreen' => '-1',
				'lightboxtext' => '-1',
				'lightboxcssclass' => '-1',
				'lightboxthumbnailurl' => '-1',
				'hidemenu' => '-1',
				'autoplayonstart' => '-1',
				'autoplayinterval' => '-1',
				'zoom' => '-1',
				'zoomdisabled' => '-1',
				'btndownloadpdfurl' => '-1',


			), 
			$atts
		);
		$id = (int) $args['id'];
		$bookId = $id .'_'.uniqid();
		$name = $args['name'];
		if($name != -1){
			$real3dflipbooks_ids = get_option('real3dflipbooks_ids');
			foreach ($real3dflipbooks_ids as $id) {
				$book = get_option('real3dflipbook_'.$id);
				if($book && $book['name'] == $name){
					$flipbook = $book;
					break;
				}
			}
		}else if($id != -1){
			$flipbook = get_option('real3dflipbook_'.$id);
		}

		foreach ($args as $key => $val) {
			if($val != -1){

				if($key == 'mode') $key = 'mode';
				if($key == 'viewmode') $key = 'viewMode';
				if($key == 'lightboxtext') $key = 'lightboxText';
				if($key == 'lightboxopened') $key = 'lightBoxOpened';
				if($key == 'lightboxfullscreen') $key = 'lightBoxFullscreen';
				if($key == 'lightboxcssclass') $key = 'lightboxCssClass';
				if($key == 'lightboxthumbnailurl') $key = 'lightboxThumbnailUrl';
				if($key == 'pdf') $key = 'pdfUrl';
				if($key == 'hidemenu') $key = 'hideMenu';
				if($key == 'autoplayonstart') $key = 'autoplayOnStart';
				if($key == 'autoplayinterval') $key = 'autoplayInterval';
				if($key == 'zoom') $key = 'zoomLevels';
				if($key == 'zoomisabled') $key = 'zoomDisabled';
				if($key == 'btndownloadpdfurl') $key = 'btnDownloadPdfUrl';

		    	$flipbook[$key] = $val;
			}
		}

		$flipbook['rootFolder'] = plugins_url()."/real3d-flipbook/";
		$output = '<div class="real3dflipbook" id="'.$bookId.'" ></div>';

	     if (!wp_script_is( 'real3d_flipbook', 'enqueued' )) {
	     	wp_enqueue_script("real3d_flipbook", plugins_url()."/real3d-flipbook/js/flipbook.min.js", array('jquery'),REAL3D_FLIPBOOK_VERSION);
	     }

	     if (!wp_script_is( 'real3d_flipbook_book3', 'enqueued' )) {
	     	wp_enqueue_script("real3d_flipbook_book3", plugins_url()."/real3d-flipbook/js/flipbook.book3.min.js", array('real3d_flipbook'),REAL3D_FLIPBOOK_VERSION);
	     }

	     if (!wp_script_is( 'real3d_flipbook_bookswipe', 'enqueued' )) {
	     	wp_enqueue_script("real3d_flipbook_bookswipe", plugins_url()."/real3d-flipbook/js/flipbook.swipe.min.js", array('real3d_flipbook'),REAL3D_FLIPBOOK_VERSION);
	     }

	     if (!wp_script_is( 'iscroll', 'enqueued' )) {
	     	wp_enqueue_script("iscroll", plugins_url()."/real3d-flipbook/js/iscroll.min.js", array('real3d_flipbook'),REAL3D_FLIPBOOK_VERSION);
	     }

	     if($flipbook['viewMode'] == 'webgl'){
		     if (!wp_script_is( 'real3d_flipbook_threejs', 'enqueued' )) {
		     	wp_enqueue_script("real3d_flipbook_threejs", plugins_url()."/real3d-flipbook/js/three.min.js", array(),REAL3D_FLIPBOOK_VERSION);
		     }
		     if (!wp_script_is( 'real3d_flipbook_webgl', 'enqueued' )) {
		     	wp_enqueue_script("real3d_flipbook_webgl", plugins_url()."/real3d-flipbook/js/flipbook.webgl.min.js", array(),REAL3D_FLIPBOOK_VERSION);
		     }
	     }

	     // trace($flipbook['id']);
	     // trace($flipbook['pdfUrl']);
	     // trace($flipbook['lightboxThumbnailUrl']);

	     if($flipbook['pdfUrl'] != -1 || $flipbook['type'] == 'pdf'){

		     if (!wp_script_is( 'real3d_flipbook_pdfjs', 'enqueued' )) {
		     	wp_enqueue_script("real3d_flipbook_pdfjs", plugins_url()."/real3d-flipbook/js/pdf.min.js", array(),REAL3D_FLIPBOOK_VERSION);
		     }

		     if (!wp_script_is( 'real3d_flipbook_pdfservice', 'enqueued' )) {
		     	wp_enqueue_script("real3d_flipbook_pdfservice", plugins_url()."/real3d-flipbook/js/flipbook.pdfservice.min.js", array(),REAL3D_FLIPBOOK_VERSION);
		     }

	     }


	     if (!wp_script_is( 'real3d_flipbook_embed', 'enqueued' )) {
	     	wp_enqueue_script("real3d_flipbook_embed", plugins_url()."/real3d-flipbook/js/embed.js", array('real3d_flipbook'),REAL3D_FLIPBOOK_VERSION);
	     }
	     wp_localize_script( 'real3d_flipbook_embed', 'real3dflipbook_'.$bookId, json_encode($flipbook) );


	     if (!wp_style_is( 'flipbook_style', 'enqueued' )) {
	     	wp_enqueue_style( 'flipbook_style', plugins_url()."/real3d-flipbook/css/flipbook.style.css" , array(),REAL3D_FLIPBOOK_VERSION);
	     }
	     if (!wp_style_is( 'font_awesome', 'enqueued' )) {
	     	wp_enqueue_style( 'font_awesome', plugins_url()."/real3d-flipbook/css/font-awesome.css" , array(),REAL3D_FLIPBOOK_VERSION);
	     }
		return $output;
	}
	add_filter('widget_text', 'do_shortcode');
	add_shortcode('real3dflipbook', 'real3dflipbook_shortcode');