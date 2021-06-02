<?php

/**
 * ------> /parts/post/loop-single.php
 */

$cats = get_the_category();
$cats_array = array();

if ( ! empty( $cats ) ) {
  foreach ( $cats as $cat ) {
    $cats_array[] = '<a href="' . get_category_link( $cat->term_id ) . '">' . $cat->name . '</a>';
  }
}

$cats_output = ( ! empty( $cats_array ) ) ? ' ' . join( ', ', $cats_array ) : '';

$date = sprintf( '<time class="entry-date" datetime="%1$s"><span class="single-post__date-day">%2$s</span><span class="single-post__date-month">%3$s</span><span class="single-post__date-year">%4$s</span></time>',
  esc_attr( get_the_date( 'c' ) ),
  esc_html( get_the_date( 'j' ) ),
  esc_html( get_the_date( 'M' ) ),
  esc_html( get_the_date( 'Y' ) )
);

?>
<article <?php post_class( array( 'hentry', 'single-post' ) ); ?>>
  <div class="entry-header">
    <?php if ( has_post_thumbnail() ): ?>
      <div class="entry-featured"><?php the_post_thumbnail( 'entry-large' ); ?></div>
    <?php endif; ?>
  </div>
  <div class="entry-content entry-content--content">
    <h1 class="entry-title"><?php the_title(); ?></h1>
    <?php tfnew_post_meta(); ?>
    <?php the_content(); ?>
    <?php
    $tags = get_the_tags();
    $tags_array = array();

    if ( ! empty( $tags ) ): ?>
      <div class="post-tags">
        <span><?php _e( 'Tags', TFTEXTDOMAIN ); ?>:</span>
        <?php foreach ( $tags as $tag ): ?>
          <a href="<?php echo get_tag_link( $tag->term_id ); ?>"><?php echo $tag->name; ?></a>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>
</article>