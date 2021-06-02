<?php
if (!defined('ABSPATH')) exit;

if (!comments_open()) return;
?>

<section class="sp-section sp-reviews">
	<h2 class="section-title">Reviews</h2>
	<div class="section-content">
		<?php comments_template(); ?>
	</div>	
</section>