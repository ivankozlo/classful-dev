/**
 * Share modal js part
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    /**
     * Validate email
     * @param {string} email 
     * @return {boolean}
     */
    isEmailValid = function(email) {
        if (/^[\w\.\-\_]+?@[\w\-\_]+?\.\w{2,7}$/.test(email)){
            return true;
        }

        return false;
    }

    // Modal: Share profile
    $modalShareProfile = $('#modal-share');
    $modalShareProfileMenu = $modalShareProfile.find('.modal-share-menu a');
    $modalShareProfileTabs = $modalShareProfile.find('.modal-share-tab');
    $modalShareProfileIframeWidth = $modalShareProfileTabs.find('[name="modal-share-embed-width"]');
    $modalShareProfileIframeHeight = $modalShareProfileTabs.find('[name="modal-share-embed-height"]');

    // When menu item is clicked
    $modalShareProfileMenu.on('click', function(e){
        e.preventDefault();

        var $this = $(this);

        if( $this.hasClass('active') ){
            return false;
        }
        else{
            $modalShareProfileMenu.filter('.active').removeClass('active');
            $this.addClass('active');
            $modalShareProfileTabs.filter('.active').removeClass('active');
            $modalShareProfileTabs.filter('[data-tab="'+$this.attr('data-target')+'"]').addClass('active');
        }
    });

    // When copy link is clicked
    $modalShareProfileTabs.find('.modal-share-copy-url-btn').on('click', function(e){
        e.preventDefault();

        var $this = $(this);
        var oldBtnText = $this.text();
        var copyText = $modalShareProfileTabs.find('[name="modal-share-url-input"]').get(0);

        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");

        /** change btn text */
        $this.text('Copied!');

        /** change back btn text after 2 secs */
        setTimeout(function(){
            $this.text(oldBtnText);
        }, 2000 );
    });

    // When copy embed code is clicked
    $modalShareProfileTabs.find('.modal-share-copy-embed-btn').on('click', function(e){
        e.preventDefault();

        var $this = $(this);
        var oldBtnText = $this.text();
        var copyText = $modalShareProfileTabs.find('[name="modal-share-embed-code"]').get(0);

        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");

        /** change btn text */
        $this.text('Copied!');

        /** change back btn text after 2 secs */
        setTimeout(function(){
            $this.text(oldBtnText);
        }, 2000 );
    });

    // Update iframe style
    function modalShareUpdateIframeStyle(){
        var $textarea = $modalShareProfileTabs.find('[name="modal-share-embed-code"]');
        var embedCode = $textarea.val();
        var style = 'style="width: ' + $modalShareProfileIframeWidth.val() + '; height: ' + $modalShareProfileIframeHeight.val() + '; dipslay:block; border: 1px solid #dcdada; border-radius: 0.75rem;"';

        embedCode = embedCode.replace(/style=\".*?\"/i, style);
        $textarea.val(embedCode);
    }

    // When iframe width is changed
    $modalShareProfileIframeWidth.on('input', function(e){
        e.preventDefault();
        modalShareUpdateIframeStyle();
    });

    // When iframe height is changed
    $modalShareProfileIframeHeight.on('input', function(e){
        e.preventDefault();
        modalShareUpdateIframeStyle();
    });

    // When email submit button is clicked
    $modalShareProfileEmailForm = $modalShareProfile.find('.modal-share-email-form'); 
    $modalShareProfileEmailBtn = $modalShareProfileEmailForm.find('[type="submit"]');

    $modalShareProfileEmailBtn.on('click', function(e){
        e.preventDefault();

        var $this = $modalShareProfileEmailBtn;
        var $form = $modalShareProfileEmailForm;
        var $to = $form.find('[name="modal-share-emails-input"]');
        var $subject = $form.find('[name="modal-share-subject-input"]');
        var $message = $form.find('[name="modal-share-message-input"]');
        var errors = [];

        $form.find('.error').removeClass('error');
        $form.find('.form-notice').addClass('__hidden');

        if( $to.val() === '' ){
            errors.push($to);
        }

        var emails = [];

        $to.val().split(',').map(function( item ){
            
            item = $.trim(item);

            if( item === '' ) return false;
            if( ! isEmailValid(item) ) return false;

            emails.push(item);
        });

        if( ! emails.length ){
            errors.push($to);
        }

        if( $subject.val() === '' ){
            errors.push($subject);
        }

        if( $message.val() === '' ){
            errors.push($message);
        }
        
        if( errors.length ){
            errors.map(function( $item ){
                $item.addClass('error');
            });

            return false;
        }

        $this.prop('disabled', true);

        $.ajax({
            method: "POST",
            url: $form.attr('action'),
            data: {
                ajax_share_modal_message_submit: true,
                emails: emails,
                subject: $subject.val(),
                message: $message.val(),
            },
            cache: false,
        }).done(function( response ) {

            $this.prop('disabled', false);

            if( ! response.success ){

                if( response.data.type === 'input' ){
                    $(response.data.input).addClass('error');
                }

                return false;
            }

            $form.find('.form-notice').removeClass('__hidden');
            $form.trigger('reset');

        });
    });

})(jQuery);