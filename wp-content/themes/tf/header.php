<?php
global $wpdb, $tf_current_user_id, $tf_theme_uri;

// User state vars
$mobile_nav_style = '';

if (!is_user_logged_in())
{
    $mobile_nav_style = 'height: 100vh;';
}
?>
<!DOCTYPE html>

<html <?php language_attributes(); ?>>
    <head>
        <meta charset="<?php bloginfo('charset'); ?>">
        <meta name="robots" content="noodp">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <?php wp_head(); ?>
        
        <!--[if lt IE 9]>
            <script src = "<?php echo get_template_directory_uri(); ?>/js/respond.min.js" ></script>
            <script src="<?php echo get_template_directory_uri(); ?>/js/PIE.js"></script>
        <![endif]-->
    </head>
    <body <?php body_class(); ?>>

        <div class="overlay-clickable"></div>

        <div class="site">
            <header class="header-main">
				<div class="container-fluid d-flex justify-content-between align-items-center">
					<a class="navbar-brand" href="">
						<img src="/wp-content/themes/tf/assets/images/logo-cf.png" alt="TeacherFunder" width="168" height="33">
					</a>

					<nav class="main-nav d-flex align-items-center justify-content-end">
						<div class="menu-main-menu-container"><ul id="menu-main-menu" class="menu d-none d-xl-block"><li id="menu-item-500661" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-500661"><a href="/teachers/">Teachers</a></li>
							<li id="menu-item-500663" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-500663"><a href="/about/">About Us</a></li>
							<li id="menu-item-45" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-45"><a href="/dashboard/">Login</a></li>
							</ul>
						</div>        
						
						<!-- desktop search form -->
						<form method="post" action="/search/" class="navbar-search mr-0 mr-lg-4 d-none d-xl-block">
							<input type="hidden" name="home_search" value="1">
							
							<label for="txtSearchHeader" class="sr-only">Search for your teacher</label>
							<input type="search" name="q" id="txtSearchHeader" class="autocomplete-home autocomplete-header-top form-control navbar-search__input" placeholder="Search for your teacher" autocomplete="off">
							<input type="hidden" name="search_teacher_school" value="teachers">

							<button type="submit" name="submit_search" class="btn btn-primary btn-circle btn-icon navbar-search__toggle" id="navbar-search__toggle">
								<span class="sr-only">Search</span> <i class="icon icon-search"></i>
							</button>
						</form>

						<!-- mobile search trigger -->
						<button type="button" class="btn btn-primary btn-circle btn-icon navbar-search-mobile__toggle d-inline-block d-xl-none" id="navbar-search-mobile__toggle">
							<span class="sr-only">Search</span> <i class="icon icon-search"></i>
						</button>
													
						<a href="/register/" class="btn btn-secondary d-none d-xl-inline-block">Sign Up</a>
							
						<button class="d-inline-block d-xl-none" id="hamb-icon">
							<span></span>
							<span></span>
							<span></span>
						</button>
					</nav>
				</div>
			</header>

            <div class="main">
