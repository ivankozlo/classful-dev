/**
 * Outreach email page js part
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    var body = $('body');
    var post_el = HOOT.preview_el.find('.hoot-preview-post');

    // when facebook page change
    HOOT.editor_el.find('.hoot-editor-input-facebook-page').on('change', function(e){

        var _self = $(this);
        var id = _self.val();
        var queue_date = HOOT.editor_el.find('.hoot-component-datetime-submit [type="hidden"]').val();
        var img_el = post_el.find('.__page_picture');
        var name_el = post_el.find('.__page_name');
        var date_el = post_el.find('.__queue_date');
        
        date_el.show();

        if( id == 0 ){
            img_el.hide();    
            name_el.hide();    
        }
        else{
            img_el.attr('src', HOOT_CONNECTS.facebook.pages[ id ].picture ).show();    
            name_el.text( HOOT_CONNECTS.facebook.pages[ id ].name ).show();  
            date_el.text( queue_date ).show();  
        }
    });

    // when date queue change
    HOOT.editor_el.find('.hoot-component-datetime-submit [type="hidden"]').on('change', function(){
        var queue_date = $(this).val();
        var date_el = post_el.find('.__queue_date');
        date_el.text( queue_date );
    });

    // when video title change
    HOOT.editor_el.find('.hoot-editor-input-video-title').on('input', function(){

        var value = $(this).val();

        if( value === '' ){
            post_el.find('.hoot-preview-post-body .__video_title').text( value ).hide();
        }
        else{
            post_el.find('.hoot-preview-post-body .__video_title').text( value ).show();
        }
    });
    
    // when url change
    HOOT.editor_el.find('.hoot-editor-input-url').on('input', function(){

        var value = $(this).val();

        if( value === '' ){
            post_el.find('.hoot-preview-post-body .__link').text( value ).attr( 'href', value ).hide();
        }
        else{
            post_el.find('.hoot-preview-post-body .__link').text( value ).attr( 'href', value ).show();
        }
    });
    
    // when text
    HOOT.editor_el.find('.hoot-editor-input-text-preview').on('keyup', function(){

        var $this = $(this);
        var value = $this.text();

        // socials
        if( body.hasClass('outreach-socials') ){
            
            if( value == '' ){
                post_el.find('.hoot-preview-post-body .__text').html( value ).hide();
            }
            else{
                post_el.find('.hoot-preview-post-body .__text').html( HOOT.hashtag_highlighter(value) ).show();
            }

        }
        // email/thank you
        else if( body.hasClass('outreach-email') ){
            var el = HOOT.preview_el.find('.hoot-preview-text');

            el.text( value );
    
            if( value == '' ){
                el.hide();
            }
            else{
                el.show();
            }    
        }

    });
    
    // media
    HOOT.editor_el.find('#hoot-uploaded-file-url').on('change', function(){

        var _self = $(this);

        // empty
        if( _self.val() === '' ){
            HOOT.preview_el.find('.hoot-preview-media').html('');
            return false;
        }

        if( HOOT.editor_el.attr('data-type') === 'image' ){
            HOOT.preview_el.find('.hoot-preview-media').html(
                '<img src="' + _self.val() + '">'
            );
        }
        else{
            HOOT.preview_el.find('.hoot-preview-media').html(
                '<video src="' + _self.val() + '"></video>'
            );
        }

    });

    // video title
    HOOT.editor_el.find('.hoot-editor-input-video-title').on('input', function(){
        HOOT.preview_el.find('.hoot-preview-title').text( $(this).val() );
    });

})( jQuery );