<?php
/**
 * Page
 */

global $post;

// Post vars
$post_id = $post->ID;
$post_title = $post->post_title;

$is_login = false;
$is_portal = false;
$show_header_normal = true;

// Set the header
if (preg_match('/^\/dashboard\//i', $_SERVER['REQUEST_URI']) && !is_user_logged_in())
{
    // Login header
    get_header('login');
    $is_login = true;
    $show_header_normal = false;
}
elseif (preg_match('/^\/dashboard\//i', $_SERVER['REQUEST_URI']) && is_user_logged_in())
{
    // Portal
    $is_portal = true;
}

// Normal header
if ($show_header_normal)
{
    get_header();
}
?>

<?php
// Only show page header for "pages"
if (!preg_match('/^\/dashboard\//i', $_SERVER['REQUEST_URI']))
{
    ?>
    <div class="banner-top-default section section--radius">
        <div class="banner-top-default__inner">
            <h1 class="page-title"><?php echo $post_title; ?></h1>
        </div>
        
        <img class="banner-top-default__img" src="<?php echo get_template_directory_uri() . '/assets/img/decorative-brush-white.svg'; ?>" alt="">
    </div>
    <?php
}
?>

<?php
if (!$is_login && !$is_portal)
{
    ?>
    <div class="default-page-wrapper">
        <div class="container-fluid container-fluid--max">
        <?php
}
?>

<?php
while (have_posts())
{
    the_post();
    the_content();
}
?>
        
<?php
if (!$is_login && !$is_portal)
{
        ?>
        </div>
    </div>
    <?php
}
?>

<?php
if ($is_login)
{
    // Login footer
    get_footer('portal');
}
elseif ($is_portal)
{
    // Portal footer
    get_footer('portal');
}
else
{
    // Normal footer
    get_footer();
}
?>
