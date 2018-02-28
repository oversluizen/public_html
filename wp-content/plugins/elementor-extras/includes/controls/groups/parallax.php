<?php
namespace ElementorExtras;

use Elementor\Group_Control_Base;
use Elementor\Controls_Manager;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Custom parallax group control
 *
 * @since 1.1.4
 */
class Group_Control_Parallax extends Group_Control_Base {

	protected static $fields;

	public static function get_type() {
		return 'parallax';
	}

	protected function init_fields() {
		$controls = [];

		$controls['enable'] = [
			'label'			=> _x( 'Parallax', 'Parallax Control', 'elementor-extras' ),
			'type' 			=> Controls_Manager::SWITCHER,
			'default' 		=> '',
			'label_on' 		=> __( 'Yes', 'elementor-extras' ),
			'label_off' 	=> __( 'No', 'elementor-extras' ),
			'return_value' 	=> 'yes',
			'separator'		=> 'before',
			'frontend_available' => true,
		];

		$controls['relative'] = [
			'label' 		=> _x( 'Relative to', 'Parallax Control', 'elementor-extras' ),
			'description' 	=> _x( 'Use "Start position" when the element is visible inside the viewport before scroll.', 'Parallax Control', 'elementor-extras' ),
			'type' 			=> Controls_Manager::SELECT,
			'default' 		=> 'middle',
			'options' 			=> [
				'middle' 		=> __( 'Viewport middle', 'elementor-extras' ),
				'position' 		=> __( 'Start position', 'elementor-extras' ),
			],
			'condition' => [
				'enable!' => '',
			],
			'frontend_available' => true,
		];

		$controls['disable_on'] = [
			'label' 	=> _x( 'Disable for', 'Parallax Control', 'elementor-extras' ),
			'type' 		=> Controls_Manager::SELECT,
			'default' 	=> 'mobile',
			'options' 			=> [
				'none' 		=> __( 'None', 'elementor-extras' ),
				'tablet' 	=> __( 'Mobile and tablet', 'elementor-extras' ),
				'mobile' 	=> __( 'Mobile only', 'elementor-extras' ),
			],
			'condition' => [
				'enable!' => '',
			],
			'frontend_available' => true,
		];

		$controls['speed'] = [
			'responsive'	=> true,
			'label' 		=> _x( 'Speed', 'Parallax Control', 'elementor-extras' ),
			'type' 			=> Controls_Manager::SLIDER,
			'default'		=> [
				'size'		=> 0
				],
			'range' 		=> [
				'px' 		=> [
					'min'	=> -1,
					'max' 	=> 1,
					'step'	=> 0.01,
				],
			],
			'condition' => [
				'enable!' => '',
			],
			'frontend_available' => true,
		];

		return $controls;
	}

	/**
	 * @access protected
	 */
	protected function get_default_options() {
		return [
			'popover' => false,
		];
	}
}
