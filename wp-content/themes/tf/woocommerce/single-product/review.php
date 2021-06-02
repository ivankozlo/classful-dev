<?php
/**
 * Review Comments Template
 *
 * Closing li is left out on purpose!.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/single-product/review.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 2.6.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $tf_theme_uri;
?>
<li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>">

	<div id="comment-<?php comment_ID(); ?>" class="comment_container">

		<?php if ( empty($comment->comment_parent) ) { ?>
		<div class="review-rating">
			<?php woocommerce_review_display_rating(); ?>			
			<div class="was-helpful">Was this helpful? <a class="helpful-btn"><img src="<?php echo $tf_theme_uri; ?>/assets/img/single-product/helpful.png" alt="helpful" /></a></div>
			<div class="clear"></div>
		</div>
		<?php } ?>

		<div class="review-author">
			<?php woocommerce_review_display_gravatar($comment); ?>
			<?php
				if ( !empty($comment->comment_parent) ) {
					woocommerce_review_display_comment_text();
				}
			?>
			<?php woocommerce_review_display_meta(); ?>
			<div class="clear"></div>
		</div>

		<?php if ( empty($comment->comment_parent) ) { ?>
		<div class="review-text">
			<?php woocommerce_review_display_comment_text(); ?>
		</div>
		<?php } ?>
	</div>
