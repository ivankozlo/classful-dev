<?php

/**
 * ------> sections.php
 */

if ( have_rows('_sections') ) : while ( have_rows('_sections') ) : the_row();
  // Include page sections
  if ( locate_template( 'library/sections/' . get_row_layout() . '.php' ) ) :
    // global section variables
    $section_number = (int) get_row_index();

    // Get ACF Advanced Fields
    $adv_fields = tfnew_get_acf_advanced_style();

    // global section classes
    $classes = array(
      'section',
      'section-' . (int) $section_number
    );

    // If it has background image, add custom class.
    if ( isset( $adv_fields['bg_image'] ) && $adv_fields['bg_image'] ) {
      $classes_arr[] = 'section--bg-image';
    }

    // If it has background image, add custom class.
    if ( isset( $adv_fields['dark_bg'] ) && $adv_fields['dark_bg'] ) {
      $classes_arr[] = 'section--dark';
    }

    // Section ID.
    $section_id = 'section-' . (int) $section_number;

    // include template
    if ( locate_template( 'library/sections/' . get_row_layout() . '.php' ) ) :
      include( locate_template( 'library/sections/' . get_row_layout() . '.php' ) );
    endif;
  endif;

endwhile; endif;
?>