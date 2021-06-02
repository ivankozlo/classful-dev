<?php

/**
* Part: Hero
*
* ------> library/part/hero.php
*/

// Classes
$classes_arr = array( 'section' );

// Conditional to either show the hero or not.
$enabled = true;

get_header();

if ( $enabled ): ?>
    
<section class="<?php echo tfnew_join_classes( $classes_arr ); ?>">
	<div class="content">
		<div class="container">
			<h1 class="h2 mbs">Error 404: Page Not Found</h1>
            
			<h2 class="h3 mbs">You may not be able to find the page or file because of:</h2>
            
			<ol class="mbs">
                <li>This page may be set to private</li>
				<li>An <strong>out-of-date bookmark/favorite</strong></li>
				<li>A search engine that has an <strong>out-of-date listing for this site</strong></li>
				<li>A <strong>mis-typed address</strong></li>
			</ol>
            
			<a href="<?php echo home_url(); ?>" class="button button--primary">Go back home</a>
		</div>
	</div>
</section>
    
<?php endif; get_footer(); ?>
