<?php
if (!defined('ABSPATH')) exit;
?>

<section class="sp-section sp-description">
	<h2 class="section-title">Description</h2>
	<div class="section-content">
		<?php the_content(); ?>
		<a class="show-more-less-link show-more-link" href="#">
			Show more
			<i class="fa fa-angle-down"></i>
		</a>
		<a class="show-more-less-link show-less-link" href="#">
			Show less
			<i class="fa fa-angle-up"></i>
		</a>
	</div>	
</section>