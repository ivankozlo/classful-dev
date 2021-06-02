<?php

/**
 * ------> content.php
 */

?>
<div class="content">
  <?php if ( have_posts() ): ?>
    <?php while ( have_posts() ): the_post(); ?>
      <?php get_template_part( 'loop-single' ); ?>
    <?php endwhile; ?>
  <?php endif; ?>
</div>