<?php
namespace ElementorExtras\Modules\Hotspots\Widgets\Hotspots;

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
			return 'hotspots';
		}

		/**
		 * @return array
		 */
		public function get_fields() {
			return array(
				'text', 					// Hotspot label
				'content', 					// Tooltip content
				'link' => array( 'url' ), 	// Hotspot link
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
				return esc_html__( 'Hotspots: hotspot text', 'elementor-extras' );
			}

			if ( 'content' === $field ) {
				return esc_html__( 'Hotspots: tooltip content', 'elementor-extras' );
			}

			if ( 'url' === $field ) {
				return esc_html__( 'Hotspots: link', 'elementor-extras' );
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
				case 'url':
					return 'LINE';
		 
				case 'content':
					return 'VISUAL';
		 
				default:
					return '';
			 }
		}
	}
}