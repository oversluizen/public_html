<?php
namespace ElementorExtras\Modules\Buttons\Widgets\Buttons;

use WPML_Elementor_Module_With_Items;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

if ( class_exists( 'WPML_Elementor_Module_With_Items' ) ) {

	/**
	 * Class WPML
	 */
	class WPML extends WPML_Elementor_Module_With_Items {

		/**
		 * @since 1.8.0
		 * @return string
		 */
		public function get_items_field() {
			return 'buttons';
		}

		/**
		 * @return array
		 */
		public function get_fields() {
			return array(
				'text',
				'tooltip_content',
				'link' => array( 'url' ),
				'button_effect_text',
			);
		}

		/**
		 * @param string $field
		 * @since 1.8.0
		 *
		 * @return string
		 */
		protected function get_title( $field ) {
			if ( 'text' === $field ) {
				return esc_html__( 'Buttons: text', 'elementor-extras' );
			}

			if ( 'tooltip_content' === $field ) {
				return esc_html__( 'Buttons: tooltip content', 'elementor-extras' );
			}

			if ( 'url' === $field ) {
				return esc_html__( 'Buttons: link', 'elementor-extras' );
			}

			if ( 'button_effect_text' === $field ) {
				return esc_html__( 'Buttons: effect text', 'elementor-extras' );
			}

			return '';
		}

		/**
		 * @param string $field
		 * @since 1.8.0
		 *
		 * @return string
		 */
		protected function get_editor_type( $field ) {

			switch( $field ) {
				case 'text':
				case 'tooltip_content':
				case 'url':
				case 'button_effect_text':
					return 'LINE';
		 
				default:
					return '';
			 }
		}
	}
}