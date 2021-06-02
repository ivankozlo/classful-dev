/**
* Custom jQuery Code
*/
jQuery(document).ready(function($) {

  var $heroContact = $('.hero-contact');

  $('.hero-contact__scroll').on('click', function(e) {
    e.preventDefault();

    $('html,body').animate({
      scrollTop: $heroContact.outerHeight() + $heroContact.offset().top
    });
  });

  $('.footer__scroll-top').on('click', function(e) {
    e.preventDefault();

    $('html,body').animate({
      scrollTop: 0
    });
  });

  // Initialize AOS animations.
  AOS.init({
    once: true,
    delay: 100,
    duration: 800
  });

  // Features Matchheight
  $('.feature__icon').matchHeight({ property: 'min-height' });

  // Portal boxes content.
  $('.portal-box__content').matchHeight({ property: 'min-height' });

  // Fancybox defaults
  $('[data-fancybox="gallery"], [data-fancybox="photos-gallery"]').fancybox({
    thumbs: {
      autoStart: true,
      axis: 'x'
    }
  });

  // Apply autogrow functionality to the textarea message field.
  $('.followers-message__field').autogrow();
});

/**
 * Fix Navbar on Scroll
 *
 * replace {.navbar} width your header CSS class selector
 * replace {navbar-fixed-top} with your CSS class for fixed header
 */
jQuery(document).ready(function($) {
  var $body = $('body'),
      $window = $(window);

  if ( ! $('.navbar').hasClass( 'navbar--is-sticky' ) ) {
    $window.ready( fixNavbarOnScroll ).resize(function() {
      fixNavbarOnScroll();
    });

    $window.load( fixNavbarOnScroll );

    function fixNavbarOnScroll( width ) {
      var $navbar = $('.navbar'),
          $wpadminbar = $('#wpadminbar'),
          navbarTop, $navbarWrapper;

      if ( ! $navbar.parent('.navbar-wrapper').length ) {
        $navbar.wrapAll('<div class="navbar-wrapper"></div>');
      }

      $navbarWrapper = $navbar.closest('.navbar-wrapper');

      navbarTop = $navbarWrapper.offset().top - $wpadminbar.outerHeight();

      $navbarWrapper.css({
        minHeight: $navbar.outerHeight()
      });

      $window.scroll(function() {

        if ( $(this).scrollTop() >= navbarTop ) {
          $navbar.addClass('navbar-fixed-top');
        } else {
          $navbar.removeClass('navbar-fixed-top');
        }

      });
    }
  }
});

/**
 * Smooth Bottom
 *
 * This works with the anchor links in the URL too. It also changes the
 * URL hash
 *
 * Replace .offset_element_selector with the offset element, e.g., .navbar
 */
jQuery(document).ready(function ($) {

  let $scroll = $('.section__scroll'),
      $navbar = $('.navbar'),
      $wpadminbar = $('#wpadminbar');

  $scroll.on('click', function (e) {
    e.preventDefault();

    let $this = $(this),
        $section = $this.closest('.section'),
        offset = $wpadminbar.outerHeight();


    if ( $section.length > 0 ) {
      scrollPastSection( $section );
    }
  });

  function scrollPastSection($el) {
    let offset = $wpadminbar.outerHeight();

    if ( ! $navbar.hasClass('navbar--is-transparent') )
      offset += $navbar.outerHeight();

    $('html, body').animate({
      scrollTop: $el.offset().top + $el.outerHeight() - offset
    }, 500);
  }
});

/**
 * Smooth Anchor Links
 *
 * This works with the anchor links in the URL too. It also changes the
 * URL hash
 *
 * Replace .offset_element_selector with the offset element, e.g., .navbar
 */
jQuery(document).ready(function ($) {

  var hash = window.location.hash,
      $links = $('a[href^="#"]'),
      $wpadminbar = $('#wpadminbar'),
      offset = 0,
      $navbar = $('.navbar:not(.navbar--is-transparent):not(.navbar--is-sticky)');

  // Check if URL has hash and smooth scroll to that.
  if (hash && false) {
    var $hashEl = $(hash);
    if ($hashEl.length) {
      scrollToAnchor($hashEl);
      $(window).load(function () {
        scrollToAnchor($hashEl);
      });
    }
  }

  $links.on('click', function (e) {
    var $this = $(this),
      thisHref = $this.attr('href');

    if (thisHref !== '#') {
      if ($(thisHref).length) {
        e.preventDefault();
        scrollToAnchor($(thisHref));
      }
    }
  });

  function scrollToAnchor($el) {
    offset = $wpadminbar.outerHeight() + $navbar.outerHeight();
    $('html, body').animate({
      scrollTop: $el.offset().top - offset
    }, 500);
  }
});

/**
 * FullScreen Navbar
 */
jQuery(document).ready(function($) {

  var $body = $('body'),
      $navbar = $('.navbar-nav'),
      $navbarBtn = $('.navbar__btn'),
      $navbarClose = $('.navbar-nav__close');

  // $navbar.hide();
  $navbarBtn.on('click', function(e) {
    e.preventDefault();

    if ( $navbar.hasClass('navbar-nav--active') ) {
      $navbar.removeClass('navbar-nav--active').fadeOut();
      $body.removeClass('navbar-active');
      $navbarBtn.removeClass('navbar__btn--active');
    } else {
      $navbar.addClass('navbar-nav--active').fadeIn();
      $body.addClass('navbar-active');
      $navbarBtn.addClass('navbar__btn--active');
    }
  });

  $navbarClose.on('click', function(e) {
    e.preventDefault();

    if ( $navbar.hasClass('navbar-nav--active') ) {
      $navbar.removeClass('navbar-nav--active').fadeOut();
      $body.removeClass('navbar-active');
      $navbarBtn.removeClass('navbar__btn--active');
    }
  });

});

/**
 * Crop Image
 */
jQuery(document).ready(function($) {

  if ( typeof croppie != 'function' ) return;

  var $image = $('img.crop-image, .crop-image > img');

  $image.croppie( {
    viewport: { width: 225, height: 250, type: 'square' }
  } );

  // $image.cropper({
  //   aspectRatio: 16 / 9,
  //   crop: function(event) {
  //     console.log(event.detail.x);
  //     console.log(event.detail.y);
  //     console.log(event.detail.width);
  //     console.log(event.detail.height);
  //     console.log(event.detail.rotate);
  //     console.log(event.detail.scaleX);
  //     console.log(event.detail.scaleY);
  //   }
  // });

  // // Get the Cropper.js instance after initialized
  // var cropper = $image.data('cropper');

});
