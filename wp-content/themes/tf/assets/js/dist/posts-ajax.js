/**
 * News Post Filters
 */
jQuery(document).ready( function($) {

  var $postsCont   = $('.posts'),
      $posts       = $('.posts__inner'),
      $postsLoader = $('.posts__loader'),
      $moreLink    = $('.pagination__link--prev'),
      $backToTop   = $('.pagination__link--next'),
      $filtersCont = $('.post-filters'),
      $filterItems = $('.post-filters__item--link'),
      $filterLinks = $('.post-filters__item--link > a'),
      $searchForm  = $('.post-filters #searchform'),
      $searchClear = $('.post-filters .clear-search'),
      $wpadminbar  = $('#wpadminbar');

  // Readjust posts height
  function readjustPostsHeight() {
    $('.posts__item .post-card__text-wrap').matchHeight({ property: 'min-height' });
  }

  // On Clicking more link.
  $moreLink.click( function(e) {
    e.preventDefault();

    var $this = $(this),
        catId = $filterItems.find('.active').data('category-id');

    var data = {
      'action': 'teacherfunderpostsajax',
      'query': tfnew_posts_params.posts, // that's how we get params from wp_localize_script() function
      'page' : tfnew_posts_params.current_page,
      'cat'  : catId
    };

    $.ajax({
      url : tfnew_posts_params.ajaxurl, // AJAX handler
      data : data,
      type : 'POST',
      beforeSend : function ( xhr ) {
        console.log( 'Loading...' ); // change the $this text, you can also add a preloader image
        $postsCont.addClass( 'posts--loading' );
        $postsLoader.fadeIn();
      },
      success : function( response ) {
        if ( response.success ) {
          // tfnew_posts_params.posts = response.data.args;
          tfnew_posts_params.current_page++;

          if ( response.data.posts ) {
            setTimeout( function() {
              $posts.append( response.data.posts );
              readjustPostsHeight();

              if ( tfnew_posts_params.current_page == tfnew_posts_params.max_page ) {
                $this.fadeOut();
              }
            }, 1000);
          } else {
            $this.fadeOut();
          }
        } else {
          $this.fadeOut();
        }
      }
    }).always( function() {
      setTimeout( function() {
        $postsLoader.fadeOut();
        $postsCont.removeClass( 'posts--loading' );
      }, 1000);
      console.log('always runn....');
    });
  });

  $backToTop.click( function(e) {
    e.preventDefault();

    $('html,body').animate({
      scrollTop: $filtersCont.offset().top - $wpadminbar.outerHeight()
    }, 500);
  });

  // On Clicking the Post Filters.
  $filterLinks.click( function(e) {
    e.preventDefault();

    var $this = $(this),
        catId = $this.data('category-id');

    console.log( 'hahahah', tfnew_posts_params.posts );
    // tfnew_posts_params.current_page = '1';

    // Switch link active class.
    $filterItems.find('.active').removeClass('active');
    $this.addClass('active');

    // Prepare data to be sent via AJAX request.
    var data = {
      'action' : 'teacherfunderpostsajax',
      'query': tfnew_posts_params.posts, // that's how we get params from wp_localize_script() function
      'search_term' : tfnew_posts_params.search_term,
      // 'page' : tfnew_posts_params.current_page,
      'cat'  : catId
    };

    // Send an AJAX request.
    $.ajax({
      url : tfnew_posts_params.ajaxurl, // AJAX handler
      data : data,
      type : 'POST',
      // Before sending the ajax request.
      beforeSend : function ( xhr ) {
        console.log( 'Loading...' ); // change the $this text, you can also add a preloader image
        $postsCont.addClass( 'posts--loading' );
        $postsLoader.fadeIn();
      },
      success : function( response ) {
        console.log( response );

        if ( response.success && response.data.posts ) {
          console.log( 'Load more news' ); // insert new posts
          tfnew_posts_params.posts = response.data.args;
          tfnew_posts_params.current_page = '1';
          $moreLink.fadeIn();

          setTimeout( function() {
            $posts.html( response.data.posts );
            readjustPostsHeight();
          }, 1000);
        }
      }
    }).always( function() {
      setTimeout( function() {
        $postsLoader.fadeOut();
        $postsCont.removeClass( 'posts--loading' );
      }, 1000);
      console.log('always runn....');
    });
  });

  // On Clicking the Post Filters.
  $searchForm.submit( function(e) {
    e.preventDefault();

    var $this = $searchForm,
        $searchField = $searchForm.find('[name="s"]'),
        searchTerm = $searchField.val();

    console.log( 'hahahah', tfnew_posts_params.posts, searchTerm );

    if ( searchTerm ) {
      $filterItems.find('.active').removeClass('active');
      tfnew_posts_params.search_term = searchTerm;
      $searchClear.fadeIn();

      // Prepare data to be sent via AJAX request.
      var data = {
        'action'      : 'teacherfunderpostsajax',
        'query'       : tfnew_posts_params.posts, // that's how we get params from wp_localize_script() function
        'search_term' : tfnew_posts_params.search_term
      };

      // Send an AJAX request.
      $.ajax({
        url : tfnew_posts_params.ajaxurl, // AJAX handler
        data : data,
        type : 'POST',
        // Before sending the ajax request.
        beforeSend : function ( xhr ) {
          console.log( 'Loading...' ); // change the $this text, you can also add a preloader image
          $postsCont.addClass( 'posts--loading' );
          $postsLoader.fadeIn();
        },
        success : function( response ) {
          console.log( response );

          if ( response.success ) {
            console.log( 'Load more news' ); // insert new posts
            tfnew_posts_params.posts = response.data.args;

            setTimeout( function() {
              $posts.html( response.data.posts );
              readjustPostsHeight();
            }, 1000);
            // tfnew_posts_params.current_page++;
          }
        }
      }).always( function() {
        setTimeout( function() {
          $postsLoader.fadeOut();
          $postsCont.removeClass( 'posts--loading' );
        }, 1000);
        console.log('always runn....');
      });
    } else {

    }

    return false;
  });

  // On Clicking the Post Filters.
  $searchClear.submit( function(e) {
    e.preventDefault();

    var $this = $(this),
        $searchField = $searchForm.find('[name="s"]');

    console.log( 'hahahah', tfnew_posts_params.posts, searchTerm );

    tfnew_posts_params.search_term = '';
    $searchClear.fadeOut();

    $('.post-filters__item--link .active').click();
  });

});