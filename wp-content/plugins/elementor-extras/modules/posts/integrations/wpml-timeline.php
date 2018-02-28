<?php
namespace ElementorExtras\Modules\Posts\Widgets\Timeline;

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
			return 'items';
		}

		/**
		 * @return array
		 */
		public function get_fields() {
			return array(
				'date', 					// Timeline item date
				'content', 					// Mobile cell header
				'link' => array( 'url' ), 	// Timeline item link
			);
		}

		/**
		 * @param string $field
		 * @since 1.8.0
		 *
		 * @return string
		 */
		protected function get_title( $field ) {
			if ( 'date' === $field ) {
				return esc_html__( 'Timeline: date', 'elementor-extras' );
			}

			if ( 'content' === $field ) {
				return esc_html__( 'Timeline: content', 'elementor-extras' );
			}

			if ( 'url' === $field ) {
				return esc_html__( 'Timeline: link', 'elementor-extras' );
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
				case 'date':
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