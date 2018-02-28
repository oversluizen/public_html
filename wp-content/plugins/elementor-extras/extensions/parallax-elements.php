<?php

namespace ElementorExtras\Extensions;

use ElementorExtras\Base\Extension_Base;
use Elementor\Controls_Manager;
use ElementorExtras\Group_Control_Parallax;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * Parallax extenstion
 *
 * Adds parallax on widgets and columns
 *
 * @since 1.1.3
 */
class Extension_Parallax_Elements extends Extension_Base {

	/**
	 * Is Common Extension
	 *
	 * Defines if the current extension is common for all element types or not
	 *
	 * @since 1.8.0
	 * @access private
	 *
	 * @var bool
	 */
	protected $is_common = true;

	/**
	 * A list of scripts that the widgets is depended in
	 *
	 * @since 1.8.0
	 **/
	public function get_script_depends() {
		return [
			'parallax-element',
		];
	}

	/**
	 * The description of the current extension
	 *
	 * @since 1.8.0
	 **/
	public static function get_description() {
		return __( 'Adds options to move a column or a widget vertically asynchronously when scrolling the page. Can be found under Advanced &rarr; Extras &rarr; Parallax.', 'elementor-extras' );
	}

	/**
	 * Add common sections
	 *
	 * @since 1.8.0
	 *
	 * @access protected
	 */
	protected function add_common_sections_actions() {

		// Activate sections for widgets
		add_action( 'elementor/element/common/_section_style/after_section_end', function( $element, $args ) {

			$this->add_common_sections( $element, $args );

		}, 10, 2 );

		// Activate sections for columns
		add_action( 'elementor/element/column/section_advanced/after_section_end', function( $element, $args ) {

			$this->add_common_sections( $element, $args );

		}, 10, 2 );

	}

	/**
	 * Add Actions
	 *
	 * @since 1.1.3
	 *
	 * @access private
	 */
	private function add_controls( $element, $args ) {

		$element_type = $element->get_type();

		$element->add_group_control(
			Group_Control_Parallax::get_type(), [ 'name' => 'parallax_element' ]
		);

	}

	/**
	 * Add Actions
	 *
	 * @since 1.1.3
	 *
	 * @access private
	 */
	protected function add_actions() {

		// Activate controls for widgets
		add_action( 'elementor/element/common/section_elementor_extras_advanced/before_section_end', function( $element, $args ) {

			$this->add_controls( $element, $args );

		}, 10, 2 );

		// Activate controls for columns
		add_action( 'elementor/element/column/section_elementor_extras_advanced/before_section_end', function( $element, $args ) {

			$this->add_controls( $element, $args );

		}, 10, 2 );

	}

}