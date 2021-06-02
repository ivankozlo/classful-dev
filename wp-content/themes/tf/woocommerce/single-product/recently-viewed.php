<?php
if (!defined('ABSPATH')) exit;

$viewed_products = ! empty( $_COOKIE['woocommerce_recently_viewed'] ) ? (array) explode( '|', wp_unslash( $_COOKIE['woocommerce_recently_viewed'] ) ) : array();
$viewed_products = array_reverse( array_filter( array_map( 'absint', $viewed_products ) ) );
    
if (empty($viewed_products)) return;

$product_ids = implode( ",", $viewed_products );

printf(
		'<section class="recently-viewed products">
		<h2 class="section-title">Recently viewed Products</h2>
		<div class="section-content">
			%s
		</div>
	</section>',
	do_shortcode("[products ids='$product_ids' columns='6' rows='3']")
);