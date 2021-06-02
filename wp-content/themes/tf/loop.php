<?php

/**
 * ------> loop.php
 */

$cats = get_the_category();
$cats_array = array();
$category_color = '';

if ( ! empty( $cats ) ) {
  $cats_array[] = '<a href="' . get_category_link( $cats[0]->term_id ) . '" class="post-card__cat">' . $cats[0]->name . '</a>';
  $category_color = get_field( '_category_color', $cats[0] );
}

$cats_output = ( ! empty( $cats_array ) ) ? ' ' . join( ', ', $cats_array ) : '';
$img_id      = get_post_thumbnail_id();
$image       = wp_get_attachment_image( $img_id, 'entry' );
$image_url   = tfnew_get_image_url( $img_id, 'entry' );

$date = sprintf( '<time class="entry-date" datetime="%1$s"><span class="post-card__date-day">%2$s</span><span class="post-card__date-month">%3$s</span><span class="post-card__date-year">%4$s</span></time>',
  esc_attr( get_the_date( 'c' ) ),
  esc_html( get_the_date( 'j' ) ),
  esc_html( get_the_date( 'M' ) ),
  esc_html( get_the_date( 'Y' ) )
);

if ( true ): ?>
  <article <?php post_class(); ?>>
    <div class="post-card">
      <?php if ( has_post_thumbnail() ): ?>
        <div class="post-card__image entry-featured">
          <a href="<?php the_permalink(); ?>" <?php echo tfnew_bg_image_style( $image_url ); ?> class="cover-image"><?php the_post_thumbnail( 'entry' ); ?></a>
        </div>
      <?php endif; ?>
      <div class="post-card__text-wrap entry-wrap" <?php if ( $category_color ): ?>style="background-color: <?php echo $category_color; ?>;"<?php endif ?>>
        <span class="post-card__date"><?php echo $date; ?></span>
        <h2 class="post-card__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
        <p class="post-card__text"><?php echo get_the_excerpt(); ?></p>
        <div class="post-card__footer">
          <a href="<?php the_permalink(); ?>" class="read-more"><?php _e( 'Read more >>', TFTEXTDOMAIN ); ?></a>
          <?php echo $cats_output; ?>
        </div>
      </div>
    </div>
  </article>
<?php endif; ?>