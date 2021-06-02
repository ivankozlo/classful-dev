/**
 * -----> assets/js/tf-ajax.js
 *
 * AJAX Handler File
 *
 * This function can contain any JS related to the AJAX
 * functions.
 */

/**
 * Load More Posts
 */
jQuery(document).ready(function($) {
    
    var $win         = $(window),
        $postsCont   = $('.blog-articles'),
        $posts       = $('.blog-articles > .container > .row'),
        $postsLoader = $('.posts__loader'),
        $moreLink    = $('.ajax-more-posts'),
        $wpadminbar  = $('#wpadminbar');
    
    // On Clicking more link.
    $moreLink.click( function(e) {
        e.preventDefault();
        
        var $this = $(this);
        
        var data = {
            action: 'tf_load_more_posts',
            ajax_nonce: tf_posts_params.ajax_nonce,
            page: parseInt( tf_posts_params.current_page ) + 1,
            cat: tf_posts_params.current_cat,
            tag: tf_posts_params.current_tag
        };
        
        $.ajax({
            url : tf_posts_params.ajax_url, // AJAX handler
            data : data,
            type : 'POST',
            beforeSend : function ( xhr ) {
                // console.log( 'Loading...' ); // change the $this text, you can also add a preloader image
                $postsCont.addClass( 'posts--loading' );
                $postsLoader.fadeIn();
                $moreLink.addClass( 'loading disabled' ).attr('disabled', 'disabled');
            },
            success : function( response ) {
                if ( response.success ) {
                    tf_posts_params.current_page = response.data.current_page;
                    
                    if ( response.data.posts ) {
                        setTimeout( function() {
                            $items = $( response.data.posts );
                            $posts.append( $items );
                            
                            if ( tf_posts_params.current_page == tf_posts_params.max_page ) {
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
                $moreLink.removeClass( 'loading disabled' ).removeAttr('disabled');
                $postsLoader.fadeOut();
                $postsCont.removeClass( 'posts--loading' );
            }, 1000);
        });
    });

    let triggerAJAXOnScroll = debounce(function() {
        let hT = $moreLink.offset().top,
            hH = $moreLink.outerHeight(),
            wH = $win.height(),
            wS = $(this).scrollTop();

        if ( wS > (hT+hH-wH) && (hT > wS) && (wS+wH > hT+hH) ) {
            $moreLink.click();
        }
    }, 250);

    if ( $moreLink.length ) {
        $win.scroll( triggerAJAXOnScroll );
    }
});

/**
 * Load More Testimonials
 */
jQuery(document).ready(function($) {
    
    var $win         = $(window),
        $postsCont   = $('.testimonials'),
        $posts       = $('.testimonials'),
        $postsLoader = $('.posts__loader'),
        $moreLink    = $('.ajax-more-testimonials'),
        $wpadminbar  = $('#wpadminbar');
    
    // On Clicking more link.
    $moreLink.click( function(e) {
        e.preventDefault();
        
        var $this = $(this);
        
        var data = {
            action: 'tf_load_more_testimonials',
            ajax_nonce: tf_testimonials_params.ajax_nonce,
            page: parseInt( tf_testimonials_params.current_page ) + 1
        };
        
        $.ajax({
            url : tf_testimonials_params.ajax_url, // AJAX handler
            data : data,
            type : 'POST',
            beforeSend : function ( xhr ) {
                // console.log( 'Loading...' ); // change the $this text, you can also add a preloader image
                $postsCont.addClass( 'posts--loading' );
                $postsLoader.fadeIn();
                $moreLink.addClass( 'loading disabled' ).attr('disabled', 'disabled');
            },
            success : function( response ) {
                if ( response.success ) {
                    tf_testimonials_params.current_page = response.data.current_page;
                    
                    if ( response.data.posts ) {
                        setTimeout( function() {
                            $items = $( response.data.posts );
                            $posts.append( $items );
                            $('.testimonial .testimonial__text').matchHeight({ property: 'min-height' });
                            
                            if ( tf_testimonials_params.current_page == tf_testimonials_params.max_page ) {
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
                $moreLink.removeClass( 'loading disabled' ).removeAttr('disabled');
                $postsLoader.fadeOut();
                $postsCont.removeClass( 'posts--loading' );
            }, 1000);
        });
    });

    let triggerAJAXOnScroll = debounce(function() {
        let hT = $moreLink.offset().top,
            hH = $moreLink.outerHeight(),
            wH = $win.height(),
            wS = $(this).scrollTop();

        if ( wS > (hT+hH-wH) && (hT > wS) && (wS+wH > hT+hH) ) {
            $moreLink.click();
        }
    }, 250);

    if ( $moreLink.length ) {
        $win.scroll( triggerAJAXOnScroll );
    }
});

/**
 * Load More Related Posts
 */
jQuery(document).ready(function($) {
    
    if ( $('body').hasClass('single-post') ) {
        
        var $win         = $(window),
            $postsCont   = $('.related-articles'),
            $posts       = $('.related-articles > .container > .row'),
            $postsLoader = $('.related-articles__loader'),
            $moreLink    = $('.ajax-more-posts'),
            $wpadminbar  = $('#wpadminbar');
        
        // On Clicking more link.
        function loadMoreRelatedPostsOnScroll() {
            if (!$postsLoader.length) return;
            var data = {
                action: 'tf_load_more_related_posts',
                ajax_nonce: tf_posts_params.ajax_nonce,
                page: parseInt( tf_posts_params.current_page ) + 1,
            };
            
            $.ajax({
                url : tf_posts_params.ajax_url, // AJAX handler
                data : data,
                type : 'POST',
                beforeSend : function ( xhr ) {
                    // console.log( 'Loading...' ); // change the $this text, you can also add a preloader image
                    $postsCont.addClass( 'posts--loading' );
                    $postsLoader.animate({
                        opacity: 1
                    });
                },
                success : function( response ) {
                    if ( response.success ) {
                        tf_posts_params.current_page = response.data.current_page;
                        
                        if ( response.data.posts ) {
                            setTimeout( function() {
                                $items = $( response.data.posts );
                                $posts.append( $items );
                                
                                if ( tf_posts_params.current_page == tf_posts_params.max_page ) {
                                    // $this.fadeOut();
                                    // $postsLoader.animate({
                                    //     opacity: 0
                                    // });
                                    if ($('.related-articles__loader').length) {
                                        $('.related-articles__loader').remove();
                                        $postsLoader = [];
                                    }
                                }

                                if ( response.data.has_more_posts === false ) {
                                    $('.related-articles__loader').remove();
                                    $postsLoader = [];
                                }
                            }, 1000);
                        }
                    }
                }
            }).always( function() {
                setTimeout( function() {
                    // $postsLoader.fadeOut();
                    if ($postsLoader.length) {
                        $postsLoader.animate({
                            opacity: 0
                        });
                    }
                    $postsCont.removeClass( 'posts--loading' );
                }, 1000);
            });
        }
    
        let triggerAJAXOnScroll = debounce(function(e) {
            let hT = $posts.offset().top,
                hH = $posts.outerHeight(),
                wH = $win.height(),
                wS = $(this).scrollTop();
    
            // console.log(e, 'LOLOL', hT, hH, wH, wS );
            
            if ( $postsLoader.length ) {
                if ( ( hT + ( hH / 2.5 ) ) < wS ) {
                    loadMoreRelatedPostsOnScroll();
                    // console.log('LOLOL WORKING', ( hT + ( hH / 2.5 ) ), wS );
                } else {
                    // console.log('LOLOL', hT, hH, wH, wS );
                }
            }
            
            // if ( wS > (hT+hH-wH) && (hT > wS) && (wS+wH > hT+hH) ) {
            //     console.log('LOLOL WOrked');
            //     loadMoreRelatedPostsOnScroll();
            // }
        }, 250);
    
        if ( $postsCont.length ) {
            $win.scroll( triggerAJAXOnScroll );
        }
    }
});

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

jQuery(document).ready(function($) {
    
    /**
     * Comment Voting
     */
    $(document).on('click', '.comment-likes, .comment__likes', function (e) {
        
        e.preventDefault();
        
        var $this = $(this),
        commentID = $this.data('comment-id'),
        $count = $this.find('.comment-cta-box-right, .comment__likes-right');
        
        if ( commentID ) {
            // console.log('comment id is', commentID, 'tf_ajax_handler');
            
            $.ajax({
                
                url: tf_ajax.ajax_url,
                type: 'post',
                data: {
                    action: 'tf_ajax_handler',
                    handler: 'comment_vote_up',
                    ajax_nonce: tf_ajax.ajax_nonce,
                    comment_id: commentID
                },
                
                // Before Sending
                beforeSend: function() {
                    // console.log('before sending the AJAX request');
                },
                
                // On Success
                success: function( res ) {
                    // console.log( res );
                    
                    var data = res.data;
                    
                    // On Success
                    if ( res.success ) {
                        if ( data.vote ) {
                            $count.text( data.vote );
                        } else if ( data.type === 'voted' && data.msg ) {
                            $count.text( data.msg );
                            // $this.replaceWith( $('<span class="comment-likes">' + data.msg + '<span>') );
                        }
                    }
                },
                
                // On Error
                error: function( error ) {
                    // console.log( 'request failed', error );
                }
                
            });
            
        }
    });
});
