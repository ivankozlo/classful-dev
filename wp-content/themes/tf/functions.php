<?php
/**
 * Start session
 */
session_start();

/**
 * Global vars
 */
$tf_current_user = wp_get_current_user();
$tf_current_user_id = $tf_current_user->ID;
$tf_site_url = site_url();
$tf_theme_path = TEMPLATEPATH;
$tf_theme_uri = get_bloginfo('stylesheet_directory');

/**
 * Theme setup
 */
add_action('after_setup_theme', 'tf_setup', 99);
function tf_setup()
{
    // Theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');

    // Menus
    register_nav_menus(array(
        'primary' => __('Primary Menu'),
        'portal-menu' => __('Portal Menu')
    ));

    // Image cropping sizes
    add_image_size('avatar', 500, 500, true);
    add_image_size('avatar-uncropped', 750, 750);
    add_image_size('home-teacher-featured', 425, 460, true);
    add_image_size('teacher-gallery', 1520, 1013, true);
    add_image_size('entry', 800, 9999, false);
    add_image_size('blog-large', 970, 912, true);
    add_image_size('blog-small', 390, 320, true);
    add_image_size('outreach-email-header', 700, 350, true);
}

/**
 * Scripts and styles
 */
add_action('wp_enqueue_scripts', 'tf_styles_scripts', 99);
function tf_styles_scripts()
{
    global $wp_query, $tf_theme_uri, $tf_theme_path;


    // Set the versions for the files based on last modified time
    $version_style = filemtime($tf_theme_path . '/assets/css/main.css');
    $version_style_responsive = filemtime($tf_theme_path . '/assets/css/main-responsive.css');
    $version_js_vendor = filemtime($tf_theme_path . '/assets/js/dist/vendor.js');
    $version_js_main = filemtime($tf_theme_path . '/assets/js/dist/main.js');

    // Styles
    wp_enqueue_style('tf-css-slick', $tf_theme_uri . '/assets/css/slick.css', array(), false);
    wp_enqueue_style('tf-css-style', $tf_theme_uri . '/assets/css/main.css', array(), $version_style);
    wp_enqueue_style('tf-css-style-responsive', $tf_theme_uri . '/assets/css/main-responsive.css', array(), $version_style_responsive);
    wp_enqueue_style('tf-css-remodal', $tf_theme_uri . '/assets/js/remodal/remodal.css', array());
    wp_register_style('cropper', $tf_theme_uri . '/assets/css/vendor/cropper.min.css', array());
    wp_register_style('croppie', $tf_theme_uri . '/assets/css/vendor/croppie.css', array());

    wp_enqueue_style('custom-style', $tf_theme_uri . '/assets/css/custom.css', array());

    // Scripts
    wp_enqueue_script('jquery');
    wp_enqueue_script('tf-js-number-format', $tf_theme_uri . '/assets/js/src/number_format.min.js', array(), '', true);
    wp_enqueue_script('tf-js-autocomplete', $tf_theme_uri . '/assets/js/autocomplete.min.js', array('jquery'), '', true);
    wp_enqueue_script('tf-js-remodal', $tf_theme_uri . '/assets/js/remodal/remodal.min.js', array('jquery'), '', true);
    wp_enqueue_script('tf-js-matchheight', $tf_theme_uri . '/assets/js/jquery.matchHeight-min.js', array('jquery'), '', true);
    wp_enqueue_script('tf-js-vendor', $tf_theme_uri . '/assets/js/dist/vendor.js', array('jquery'), $version_js_vendor, true);
    wp_enqueue_script('tf-js-main', $tf_theme_uri . '/assets/js/dist/main.js', array('jquery'), $version_js_main, true);
    wp_enqueue_script('tf-js-main-custom', $tf_theme_uri . '/assets/js/main-custom.js', array('jquery'), $version_js_main, true);
    wp_localize_script('tf-js-main-custom', 'ajax_object', array( 'ajax_url' => admin_url( 'admin-ajax.php' )) );

    // Scripts - register to be queued later
    wp_register_script('tf-js-chart', $tf_theme_uri . '/assets/js/dist/vendor/Chart.bundle.js', array('jquery'), '', true);
    wp_register_script('tf-js-croppie', $tf_theme_uri . '/assets/js/dist/vendor/croppie.min.js', array('jquery'), '', true);
    wp_register_script('tf-js-cropper', $tf_theme_uri . '/assets/js/dist/vendor/cropper.min.js', array('jquery'), '', true);
    wp_register_script('tf-js-jquery-cropper', $tf_theme_uri . '/assets/js/dist/vendor/jquery-cropper.min.js', array('jquery'), '', true);

    wp_register_script('tf-js-cc-validation', $tf_theme_uri . '/assets/js/jquery.creditCardValidator.js', array('jquery'), '', true);

    // Comments
    if (is_singular() && comments_open() && get_option('thread_comments'))
    {
        wp_enqueue_script('comment-reply');
    }

    // Single Product page
    if (class_exists('WooCommerce') && is_product())
    {
        // enqueue single product page styles
        $version_single_product_css = filemtime($tf_theme_path . '/assets/css/single-product.css');
        wp_enqueue_style('tf-css-single-product', $tf_theme_uri . '/assets/css/single-product.css', array(), $version_single_product_css);

        // enqueue single product page scripts
        $version_single_product_js = filemtime($tf_theme_path . '/assets/css/single-product.css');
        wp_enqueue_script('tf-js-single-product', $tf_theme_uri . '/assets/js/single-product.js', array('jquery'), $version_single_product_js, true);

        // require single product page hooks
        require_once $tf_theme_path . '/inc/hooks-single-product-template.php';
    }
}

/**
 * Remove image sizes
 */
add_filter('intermediate_image_sizes_advanced', 'tf_intermediate_image_sizes_advanced');
function tf_intermediate_image_sizes_advanced($sizes)
{
    unset($sizes['thumbnail']);
    unset($sizes['medium']);
    unset($sizes['large']);
    unset($sizes['shop_thumbnail']);
    unset($sizes['shop_catalog']);
    unset($sizes['shop_single']);

    return $sizes;
}





// Post link meta
function link_meta_box_markup($post)
{
  $value = get_post_meta( $post->ID, '_link_post_meta', true );
  echo "<a href='" . $value . "'>" . $value . "</a>";
}

function add_link_meta_box()
{
  add_meta_box("post-link-meta-box", "Post link", "link_meta_box_markup", "post", "side", "high", null);
}

add_action("add_meta_boxes", "add_link_meta_box");


// Discoverable meta
function discoverable_meta_box_markup($post)
{
  $value = get_post_meta( $post->ID, '_discoverable_post_meta', true );
  echo "Post discoverable: " . $value;
}

function add_discoverable_meta_box()
{
  add_meta_box("post-link-meta-box", "Post link", "discoverable_meta_box_markup", "post", "side", "high", null);
}

add_action("add_meta_boxes", "add_discoverable_meta_box");


function create_post_ajax(){

  $cat_id = wp_create_category('feeds');

  $post_title = $_POST["post_title"];
  $post_link = $_POST["post_link"];
  $post_tags = $_POST["post_tags"];
  $post_discoverable = $_POST["post_discoverable"];

  $post = array(
    'post_title' => $post_title,
    'tags_input' => $post_tags,
    'post_status' => 'publish',
    'post_category' => array($cat_id)
  );

  $post_id = wp_insert_post($post);
  add_post_meta($post_id, '_link_post_meta', $post_link);
  add_post_meta($post_id, '_discoverable_post_meta', $post_discoverable);

  echo $post_id;
}

add_action('wp_ajax_nopriv_create_post_ajax', 'create_post_ajax');
add_action('wp_ajax_create_post_ajax', 'create_post_ajax');
