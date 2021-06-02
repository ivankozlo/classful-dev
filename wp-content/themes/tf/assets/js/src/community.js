/**
 * Dashboard Community Script
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    /**
     * Toggle header notice
     */
    $('.community-notice-close').on('click', function(e){
        e.preventDefault();
        $('.community-notice').toggleClass('hide');
    });

    /**
     * When share button is clicked
     */
    $(document).on('click', '.community-post-buttons a', function(e){
        e.stopPropagation();

        var $this = $(this);
        var $parent = $this.closest('.community-post');

        $this.addClass('disabled');

        $.ajax({
            cache: false,
            url: '/ajax/community/',
            method: "POST",
            data: {
                ajax_community_share: true,
                post_id: $parent.attr('data-teacher'),
                uid: $parent.attr('data-uid'),
                social: $this.attr('data-social'),
            },
        }).done(function( response ){
            $this.removeClass('disabled');
        });
    });


    /**
     * Ajax: Get posts
     * 
     * @param {object} $btn
     */
    function ajaxLoadPosts( $btn ){

        var type = $btn.attr('data-type') === '' ? 'nearest' : $btn.attr('data-type');
        type = type.replace('-', '_');

        var pageno = parseInt( $btn.attr('data-page') );
        pageno = isNaN(pageno) ? 1 : pageno;
        pageno = pageno < 1 ? 1 : pageno;
        
        $btn.prop('disabled', true).addClass('disabled');

        var data = {};
        data.pageno = pageno;
        data['ajax_community_' + type ] = true;

        $.ajax({
            cache: false,
            url: '/ajax/community/',
            method: "POST",
            data: data,
        }).done(function( response ){

            console.log(response);
            $btn.prop('disabled', false).removeClass('disabled').show();
            
            if( ! response.success ){

                if( response.data.type === 'flash' ){
                    //location.reload();
                }

                return false;
            }

            if( response.data.output != '' ){
                $('.community-posts').append(response.data.output);
            }

            var total_pages = parseInt( response.data.total_pages );
            var total_rows = parseInt( response.data.total_rows );

            if( total_rows > 0 ){
                $('.community-posts-notice').removeClass('__hidden');
            }
            else{
                $('.community-posts-notice').addClass('__hidden');
            }

            if( pageno + 1 > total_pages || total_pages === 1 ){
                $btn.remove();
            }
            else{
                $btn.attr( 'data-page', pageno + 1 );
            }

        });
    }

    $loadMoreBtn = $('.ajax-community-load-more');

    ajaxLoadPosts( $loadMoreBtn );

    $loadMoreBtn.on('click', function(e){
        e.preventDefault();
        ajaxLoadPosts( $loadMoreBtn );
    });

})(jQuery);
