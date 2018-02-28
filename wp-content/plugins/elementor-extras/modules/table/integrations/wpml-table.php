<?php
namespace ElementorExtras\Modules\Table\Widgets\Table;

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
			return 'rows';
		}

		/**
		 * @return array
		 */
		public function get_fields() {
			return array(
				'cell_text', 					// Row cell content
				'cell_header', 					// Mobile cell header
				'link' => array( 'url' ), 		// Cell link
			);
		}

		/**
		 * @param string $field
		 * @since 1.8.0
		 *
		 * @return string
		 */
		protected function get_title( $field ) {
			if ( 'cell_text' === $field ) {
				return esc_html__( 'Table: cell text', 'elementor-extras' );
			}

			if ( 'cell_header' === $field ) {
				return esc_html__( 'Table: cell mobile header', 'elementor-extras' );
			}

			if ( 'url' === $field ) {
				return esc_html__( 'Table: cell link', 'elementor-extras' );
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
				case 'cell_text':
				case 'cell_header':
				case 'url':
					return 'LINE';
		 
				default:
					return '';
			 }
		}
	}
}