<?php
 /*
 Template Name: Full Width
 */
 ?>
<?php get_header(); ?>
<section id="content" role="main">
	<?php //do_action( 'eletheme_before_main_content' ); ?>
	<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
		<?php the_content(); ?>
	<?php endwhile; endif; ?>
	<?php //do_action( 'eletheme_after_main_content' ); ?>
</section>
<?php get_footer(); ?>