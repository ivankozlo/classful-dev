/**
 * Programs frontend js part
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    var $preview = $('.program-preview');

    // when program item's select button is clicked
    $('.program-item').on('click', function(e){
        e.preventDefault();
        
        var $this = $(this);
        var id = $this.attr('data-id');

        if( ! PROGRAMS.hasOwnProperty(id) ) return false;

        var program = PROGRAMS[id];

        $this.addClass('active').removeClass('inactive');
        $this.siblings().removeClass('active').addClass('inactive');
        
        $preview.find('.__preview_name span').text(program.name);
        $preview.find('.__preview_desc').text(program.description || '');

        if( program.status === 'published' ){
            $preview.removeClass('inactive').addClass('active');
        }
        else{
            $preview.removeClass('active').addClass('inactive');
        }

        var ul_content = $this.find('.program-item-left-section ul').html();
        $preview.find('.program-item-left-section ul').html(ul_content);
    });

    // when "buy a ticket, make a donation or rsvp" is clicked (single page cta)
    $('[data-action="program-single-cta"]').on('click', function(e){
        e.preventDefault();
        
        var $this = $(this);

        $this.find('img').show();
        $this.attr('disabled', 'disabled');

        $.ajax({
            url: '/programs/' + PROGRAM.slug,
            type: 'POST',
            data: {
                ajax_reserve_program: true,
                id: PROGRAM.id,
                nonce: PROGRAM.nonce,
            },
            cache: false,
        }).done(function(response){
                                    
            if( ! response.success ){

                if( response.data.type === 'flash' ){
                    location.reload();
                }

                $this.removeAttr('disabled');

                return false;
            }

            location.href = response.data.redirect_to;
        });

    });

    /// ==============================================================================================
    /// Program Registration Code Form
    /// ==============================================================================================
    
    var regCodeForm = $('#reg-code-form');

    regCodeForm.on('submit', function(e){
        e.preventDefault();

        var $regCode = regCodeForm.find('[name="reg_code"]');

        $regCode.removeClass('error');

        if( $regCode.val() === '' ){
            $regCode.addClass('error');
            return false;
        }

        $.ajax({
            method: "POST",
            url: regCodeForm.attr('action'),
            data: {
                reg_code_validation: true,
                nonce: PROGRAM.nonce,
                reg_code: $regCode.val(),
            },
            cache: false,
        }).done(function( response ) {            
            location.reload();
        });
    });

})(jQuery);