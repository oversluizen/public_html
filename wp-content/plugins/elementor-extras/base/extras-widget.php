<?php

namespace ElementorExtras\Base;

use Elementor\Widget_Base;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

abstract class Extras_Widget extends Widget_Base {

	protected $_is_edit_mode = false;

	public function __construct( $data = [], $args = null ) {

		parent::__construct( $data, $args );

		// Set edit mode
		$this->_is_edit_mode = \Elementor\Plugin::instance()->editor->is_edit_mode();

		// Add WPML support
		$this->add_wpml_support();
	}

	public function add_helper_render_attribute( $key, $name = '' ) {

		if ( ! $this->_is_edit_mode )
			return;

		$this->add_render_attribute( $key, [
			'data-ee-helper' 	=> $name,
			'class'				=> 'ee-editor-helper',
		] );
	}

	/**
	 * Method for setting widget dependancy on Elementor Pro plugin
	 *
	 * When returning true it doesn't allow the widget to be registered
	 *
	 * @access public
	 * @since 1.6.0
	 * @return bool
	 */
	public static function requires_elementor_pro() {
		return false;
	}

	/**
	 * Add WPML translation support
	 *
	 * @access public
	 * @since 1.8.0
	 */
	public function add_wpml_support() {
		add_filter( 'wpml_elementor_widgets_to_translate', [ $this, 'wpml_widgets_to_translate_filter' ] );
	}

	/**
	 * Adds the current widget's fields to WPML translatable widgets
	 *
	 * @access public
	 * @since 1.8.0
	 * @return array
	 */
	public function wpml_widgets_to_translate_filter( $widgets ) {
		return $widgets;
	}

}
