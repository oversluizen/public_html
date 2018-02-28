<?php

	/*
	Plugin Name: Real 3D Flipbook
	Plugin URI: http://codecanyon.net/user/creativeinteractivemedia/portfolio?ref=creativeinteractivemedia
	Description: Premium Responsive Real 3D FlipBook  
	Version: 3.3.0
	Author: creativeinteractivemedia
	Author URI: http://codecanyon.net/user/creativeinteractivemedia?ref=creativeinteractivemedia
	*/

	// define( 'WP_DEBUG', true );
	define('REAL3D_FLIPBOOK_DIR', plugin_dir_url( __FILE__ ));
	define('REAL3D_FLIPBOOK_VERSION', '3.3.0');
	
	function trace($var){
		echo("<pre style='background:#fcc;color:#000;font-size:12px;font-weight:bold'>");
		print_r($var);
		echo("</pre>");
	}

	if(!is_admin()) {
		include("includes/plugin-frontend.php");
	}
	else {
		include("includes/plugin-admin.php");
		// register_deactivation_hook( __FILE__, "deactivate_real3d_flipbook");
		add_filter("plugin_action_links_" . plugin_basename(__FILE__), "real3d_flipbook_admin_link");
	}
	
	function real3d_flipbook_admin_link($links) {
		array_unshift($links, '<a href="' . get_admin_url() . 'options-general.php?page=real3d_flipbook_admin">Admin</a>');
		return $links;
	}
	
	function deactivate_real3d_flipbook() {
	}

