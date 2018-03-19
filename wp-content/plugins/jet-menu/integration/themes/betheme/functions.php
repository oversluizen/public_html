<?php

add_filter( 'wp_nav_menu_args', 'jet_menu_betheme_fix_menu_args', 100000 );

/**
 * Fix nav menu arguments
 * @return array
 */
function jet_menu_betheme_fix_menu_args( $args ) {

	if ( ! isset( $args['menu_class'] ) || 'jet-menu' !== $args['menu_class'] ) {
		return $args;
	}

	$args['link_before'] = '';
	$args['link_after']  = '';

	return $args;
}
