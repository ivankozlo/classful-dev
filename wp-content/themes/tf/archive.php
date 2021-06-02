<?php
/**
 * Archive
 */

// Posts to exlude for each WP Query
$posts_exclude = array();

// Current page
$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

// Get current category
$category = get_queried_object();
$category_id = $category->term_id;
$category_name = $category->name;

get_header(); ?>

<div class="banner-top-blog section bg-primary section--radius">
    <div class="container">
        <article class="banner-top-blog__inner featured-post">
            <div class="row">
                <?php
                $posts = new WP_Query(array(
                    'post_type' => 'post',
                    'post_status' => 'publish',
                    'posts_per_page' => 1,
                    'orderby' => 'date',
                    'order' => 'DESC',
                    'paged' => $paged,
                    'cat' => $category_id
                ));
                
                if ($posts->have_posts())
                {
                    while ($posts->have_posts())
                    {
                        $posts->the_post();
                        $posts_exclude[] = get_the_ID();
                        $post_excerpt = jiv_truncate_string(strip_shortcodes(strip_tags(get_the_content())), 20);
                        ?>
                        <div class="col-md-6 d-flex align-items-center">
                            <div class="featured-post__content">
                                <a href="<?php the_permalink(); ?>">
                                    <h3><?php echo $category_name; ?></h3>
                                    
                                    <h2 class="entry-title"><?php the_title(); ?></h2>
                                    
                                    <div class="entry-content">
                                        <p>
                                            <?php echo $post_excerpt; ?>...
                                        </p>
                                    </div>
                                </a>
                                
                                <a href="<?php the_permalink(); ?>" class="blog-read-more">Read More</a>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="featured-post__img">
                                <a href="<?php the_permalink(); ?>"><img class="featured-post__img-1" src="<?php echo get_the_post_thumbnail_url('blog-large'); ?>" alt="<?php the_title(); ?>" /></a>
                                <img class="featured-post__img-2" src="<?php echo get_template_directory_uri() . '/assets/img/blog/decorative-brush-blog.svg'; ?>" alt="Brush" />
                            </div>
                        </div>
                        <?php
                    }
                }
                ?>
            </div>
        </article>
    </div>
</div>

<main class="blog-page-wrapper blog-main">
    <div class="container">
        <div class="blog-main__category">
            <div class="slider-blog--double slick-carousel--from-right2" id="slider-blog-most-popular">
                <?php
                $posts = new WP_Query(array(
                    'post_type' => 'post',
                    'post_status' => 'publish',
                    'posts_per_page' => 9,
                    'orderby' => 'date',
                    'order' => 'DESC',
                    'paged' => $paged,
                    'cat' => $category_id,
                    'post__not_in' => $posts_exclude
                ));
                
                if ($posts->have_posts())
                {
                    while ($posts->have_posts())
                    {
                        $posts->the_post();
                        $post_excerpt = jiv_truncate_string(strip_shortcodes(strip_tags(get_the_content())), 20);
                        ?>
                        <article class="col-md-4 blog-main__article match-height">
                            <a href="<?php the_permalink(); ?>">
                                <h2 class="entry-title"><?php the_title(); ?></h2>
                                
                                <div class="entry-content">
                                    <p>
                                        <?php echo $post_excerpt; ?>...
                                    </p>
                                </div>
                                
                                <img class="thumb" src="<?php echo get_the_post_thumbnail_url('blog-large'); ?>" alt="<?php the_title(); ?>" />
                            </a>
                        </article>
                        <?php
                    }
                }
                ?>
            </div>
            
            <div class="clearfix"></div>
        </div>
    </div>
</main>

<?php wp_pagenavi(); ?>

<?php get_footer(); ?>
