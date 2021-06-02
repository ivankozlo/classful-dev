<?php
/**
 * Single post
 */

global $post;

// Get post data
$post_id = $post->ID;
$post_title = $post->post_title;
$post_content_raw = jiv_content_with_formatting($post->post_content);
$post_content = jiv_content_with_formatting(strip_shortcodes($post->post_content));
$post_excerpt = substr($post_content, strpos($post_content, '<p'), strpos($post_content, '</p>') + 4);

// Get post category
$post_category = get_the_category($post_id);

if (!empty($post_category))
{
    $post_category = $post_category[0];
    $post_category_id = $post_category->term_id;
    $post_category_name = $post_category->name;
    $post_category_url = get_category_link($post_category_id);
}

get_header(); ?>

<div class="banner-top-blog-single section">
    <button class="btn-mobile-nav" onclick="window.history.back();">
        <img src="<?php echo get_template_directory_uri() . '/assets/img/icon-back-arrow.svg'; ?>" alt="">
    </button>
    
    <div class="container">
        <article class="banner-top-blog-single__inner featured-post">
            <div class="row">
                <div class="col-lg-6 d-flex align-items-center">
                    <div class="featured-post__content">
                        <h3 class="blog-category"><?php echo $post_category_name; ?></h3>
                        
                        <h1 class="entry-title"><?php echo $post_title; ?></h1>
                        
                        <div class="entry-content">
                            <p>
                                <?php echo $post_excerpt; ?>
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-6">
                    <div class="featured-post__img">
                        <img class="featured-post__img-1" src="<?php echo get_the_post_thumbnail_url($post_id, 'blog-large'); ?>" alt="<?php echo $post_title; ?>" />
                    </div>
                </div>
            </div>
        </article>
    </div>
</div>


<main class="blog-single-wrapper blog-single-main">
    <div class="container">
        <div class="blog-single-main__content">
            <ul class="blog-single-socials sticky-socials">
                <li><a href="#share" title="Share on Facebook" onclick="window.open('http://www.facebook.com/sharer.php?u=<?php the_permalink(); ?>', 'popupFacebook', 'width=650, height=270, resizable=0, toolbar=0, menubar=0, status=0, location=0, scrollbars=0'); return false;"><i class="fab fa-facebook"></i></a></li>
                <li><a href="#share" title="Share on Twitter" onclick="window.open('https://twitter.com/intent/tweet?text=<?php the_title(); ?>&url=<?php the_permalink(); ?>', 'popupTwitter', 'width=500, height=370, resizable=0, toolbar=0, menubar=0, status=0, location=0, scrollbars=0'); return false;"><i class="fab fa-twitter"></i></a></li>
                <li><a href="#share" title="Share on Pinterest" onclick="window.open('http://pinterest.com/pin/create/button/?url=<?php the_permalink(); ?>&media=<?php the_post_thumbnail_url(); ?>&description=<?php the_title(); ?>', 'popupPinterest', 'width=750, height=265, resizable=0, toolbar=0, menubar=0, status=0, location=0, scrollbars=0'); return false;"><i class="fab fa-pinterest"></i></a></li>
            </ul>
            
            <div style="width:100%; flex-basis:100%;">
                <div class="content-inner content-inner-first">
                    <?php
                    echo $post_content_raw;
                    ?>
                </div>
            </div>
        </div>

        <div class="sticky-stopper"></div>
        
        <div class="blog-related-posts">
            <div class="blog-main__category">
                <div class="blog-main__header">
                    <h2 class="text-secondary">Related Articles<img src="<?php echo get_template_directory_uri() . '/assets/img/blog/icon-back-arrow.svg'; ?>" alt="Arrow Icon"></h2>
                    
                    <div class="slider-control" id="slider-control-blog-related"></div>
                </div>
                
                <div class="slider-blog--double slick-carousel--from-right2" id="slider-blog-related">
                    <?php
                    $posts = new WP_Query(array(
                    	'post_type' => 'post',
                    	'post_status' => 'publish',
                    	'posts_per_page' => 4,
                    	'orderby' => 'date',
                    	'order' => 'DESC',
                        'cat' => $post_category_id,
                        'post__not_in' => array($post_id)
                    ));
                    
                    if ($posts->have_posts())
                    {
                    	while ($posts->have_posts())
                    	{
                    		$posts->the_post();
                    		$post_id = get_the_ID();
                            $post_excerpt = jiv_truncate_string(strip_shortcodes(strip_tags(get_the_content())), 20);
                    		?>
                            <article class="blog-main__article">
                                <a href="<?php the_permalink(); ?>">
                                    <h2 class="entry-title"><?php the_title(); ?></h2>
                                    
                                    <div class="entry-content">
                                        <p>
                                            <?php echo $post_excerpt; ?>...
                                        </p>
                                    </div>
                                    
                                    <img class="thumb" src="<?php echo get_the_post_thumbnail_url($post_id, 'blog-large'); ?>" alt="<?php the_title(); ?>" />
                                </a>
                            </article>
                            <?php
                    	}
                    }
                    ?>
                </div>
            </div>
        </div>
    
    </div>
</main>

<script>
    jQuery(document).ready(function($){

        var arrowIconSlider = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">';
        arrowIconSlider += '<g id="back_arrow" data-name="back arrow" transform="translate(40) rotate(180)">';
        arrowIconSlider += '<path id="Path" d="M-5,10,0,5-5,0" transform="translate(16.972 -15) rotate(-180)" fill="none" stroke="#050505" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"/>';
        arrowIconSlider += '</g></svg>';
        
        // Related posts slider
        $('#slider-blog-related').slick({
            dots: false,
            arrows: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            centerMode: false,
            centerPadding: '0px',
            infinite: false,
            appendArrows: '#slider-control-blog-related',
            prevArrow: '<button class="prev-btn">' + arrowIconSlider + '</button>',
            nextArrow: '<button class="next-btn">' + arrowIconSlider + '</button>',
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows:false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        centerMode: true,
                        centerPadding: '40px',
                    }
                }
            ]
        });
        
        // Hide first CTA
        $('.blog-single-main__content .blog-single-main__cta:first').hide();

    });
</script>

<?php get_footer(); ?>
