<?php

/**
 * ------> search.php
 */

get_header(); ?>

  <section class="section content-sidebar">
    <div class="container">
      <?php
      $content_class = array( 'content', 'content--is-full' );
      $content_class_output = tfnew_join_classes( $content_class );
      ?>
      <div class="<?php echo $content_class_output; ?>">
        <?php if ( have_posts() ): ?>
          <div class="row">
            <?php $count = 1; while ( have_posts() ): the_post(); ?>
              <div class="col col--4">
                <?php echo get_template_part( 'loop' ); ?>
              </div>
              <?php
              if ( $count % 3 === 0 ) {
                echo '</div><div class="row">';
              }
              ?>
            <?php $count++; endwhile; ?>
          </div>
          <div class="pagination">
            <?php wp_pagenavi(); ?>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </section>

<?php get_footer(); ?>