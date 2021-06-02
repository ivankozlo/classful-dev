/**
 * Events frontend js part
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    var $preview = $('.event-preview');

    // when event item's select button is clicked
    $('.event-item').on('click', function(e){
        e.preventDefault();
        
        var $this = $(this);
        var id = $this.attr('data-id');

        if( ! EVENTS.hasOwnProperty(id) ) return false;

        var event = EVENTS[id];
        
        $this.addClass('active').removeClass('inactive');
        $this.siblings().removeClass('active').addClass('inactive');
        
        $preview.find('.__preview_name span').text(event.title);
        $preview.find('.__preview_desc').text(event.description || '');

        if( event.status === 'published' ){
            $preview.removeClass('inactive').addClass('active');
        }
        else{
            $preview.removeClass('active').addClass('inactive');
        }

        var ul_content = $this.find('.program-item-left-section ul').html();
        $preview.find('.program-item-left-section ul').html(ul_content);

        $preview.find('.__preview_btn').attr('href', '/events/'+event.slug);
    });

    // when reserve button is clicked
    $('[data-action="reserve-event"]').on('click', function(e){
        e.preventDefault();

        var $this = $(this);
        var $form = $this.closest('form');

        $('.submit-donate-loader').show();

        $this.attr('disabled', 'disabled');

        $.post( 
            $form.attr('data-action'), 
            {
                reserve: true,
                nonce: $form.find('[name="event_reserve_nonce"]').val(),
            }, 
            function(response){        
                                
                if( ! response.success ){
                    $this.removeAttr('disabled');
                    return false;
                }

                if( EVENT_TYPE === 'free' ){
                    location.href = '/free/events/';
                }
                else{
                    location.href = '/donate/events/';
                }
            }
        );
    });
    
})(jQuery);