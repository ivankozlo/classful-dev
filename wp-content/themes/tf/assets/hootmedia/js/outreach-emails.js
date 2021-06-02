/**
 * Outreach email page js part
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    var body = $('body');

    // Only contacts page
    if( ! body.hasClass('outreach-email') ) return;
    
    var doc = $(document);
    var html = $('html');
    var panel_el = $('#hoot-email');
    var preview_el = $('#hoot-preview');
    var automate_modal_el;

    var form_data = {
        schedule_type: 'once',
        schedule_datetime: null,
        schedule_automate: {},
        contacts: [],
        message: panel_el.find('[name="hoot-input-message"]').val(),
        subject: panel_el.find('[name="hoot-input-subject"]').val(),
        button_text: panel_el.find('[name="hoot-input-button-text"]').val(),
        outreach_type: panel_el.find('[name="hoot-input-outreach-type"]').val(),
    };

    /**
     * Add email under the "Enter email(s)" field
     * Add contact to "add contacts" modal list
     * and add it to form_data.contacts, so we can use later when we submit
     * 
     * @param {object} contact 
     */
    function add_contact_el( contact ){

        if( panel_el.length && panel_el.find('.hoot-emails-selected li[data-email="'+contact.email+'"]').length ){
            return;
        }

        form_data.contacts.unshift( contact );

        if( panel_el.length ){
            panel_el.find('.hoot-emails-selected').prepend('<li data-email="'+contact.email+'"><p>'+contact.email+'</p><span class="__delete"><i class="fas fa-times"></i></span></li>');
        }
    }

    /**
     * Event: Save contacts ( add contacts modal )
     */
    html.on('outreach_save_contacts', function( e, data ){
        
        data.contacts.map(function( contact ){
            add_contact_el({
                email: contact.email,
                first_name: contact.first_name,
                last_name: contact.last_name,
            });
        });

    });

    /**
     * Open Ideas modal
     */
    $('.open-subject-ideas-modal').click(function(e){
        e.preventDefault();
        $('#hoot-modal-ideas').modal('show');
    });

    /**
     * Emails field: Button click
     */    
    panel_el.find('.hoot-input-email-group button').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();

        var el = panel_el.find('[name="hoot-input-email"]');
        var email = el.val();

        el.removeClass('error');

        if( ! HOOT.is_email_valid(email) ){
            el.addClass('error');
            return false;
        }
        
        add_contact_el({
            email: email,
            first_name: '',
            last_name: '',
        });

        el.val('');
    });

    /**
     * Emails field: Key up
     */    
    panel_el.find('[name="hoot-input-email"]').on('keyup', function(e){

        var $this = $(this);
        var content = $this.val();
        var code = e.key || e.keyCode || e.which;
        var contacts = [];

        // When enter is pressed
        if( ! ( code === 'Enter' || code === 'enter' || code === 13 || code === ',' || code === 188 ) ){
            return true;
        }

        if( content.search(',') != -1 ){
            content = content.replace(/\n/g, ',');            
            content = content.replace(',,', ',');
            content = content.split(',');
        }
        else if( content.search(';') != -1 ){
            content = content.replace(/\n/g, ';');
            content = content.replace(';;', ';');
            content = content.split(';');
        }
        else{
            content = content.split("\n");
        }

        content.map(function( email ){

            email = $.trim(email);
            
            if( ! HOOT.is_email_valid(email) ) return false;

            contacts.push( {
                email: email,
            });
        });

        if( ! contacts.length ){
            return true;
        }

        contacts.map(function( contact, index ){

            add_contact_el({
                email: contact.email,
                first_name: '',
                last_name: '',
            });
    
        });        

        $this.val('');
    });

    /**
     * Emails field: Delete email
     */
    doc.on('click', '#hoot-email .hoot-emails-selected .__delete', function(e){
        e.preventDefault();

        var _self = $(this);
        var li_el = _self.parent();
        var email = li_el.attr('data-email');

        form_data.contacts = form_data.contacts.filter(function( item ){
            return email != item.email;
        });

        li_el.remove();
    });
    
    /**
     * Submit email/thank you form
     * 
     * @param {object} e 
     */
    function submit_form( e ){

        var data = form_data;
        var form = panel_el;
        var submit_el = panel_el.find('[type="submit"]');

        form.find('input.error').removeClass('error');
        form.find('.form-notice').hide();

        submit_el.attr('disabled', 'disabled');

        data.nonce = HOOT_PARAMS.nonce;

        if( form.find('[name="is_thankyou_email"]').length ){
            data.ajax_hoot_save_thankyou_email = true;
        }
        else if( form.find('[name="id"]').length ){
            data.ajax_hoot_update_promote_emails = true;
            data.id = form.find('[name="id"]').val();
        }
        else{
            data.ajax_hoot_send_email = true;
        }

        // Old image
        data.header_image_id = form.find('[name="email_header_image_id"]').val();
        
        $.ajax({
            method: "POST",
            url: HOOT_PARAMS.tf_outreach_uri,
            data: data,
            cache: false,
        }).done(function( response ) {
            
            submit_el.removeAttr('disabled');
            
            if( ! response.success ){
                if( response.data.hasOwnProperty('errors') ){
                    response.data.errors.map(function( error ){
                        if( error.type === 'alert' ){
                            alert( error.message );
                        }
                        else if( error.type === 'input' ){
                            $(error.input).addClass('error');
                        }
                        else if( error.type === 'form_notice' ){
                            panel_el.find('.form-notice[data-id="'+error.id+'"]').show();
                        }
                        else if( error.type === 'flash' ){
                            location.reload();
                        }
                        else if( error.type === 'scroll' ){
                            $('html, body').animate({
                                scrollTop: panel_el.offset().top - 20
                            }, 300);
                        }
                    });
                }
    
                submit_el.removeAttr('disabled');
                return false;
            }
            else{
                if( data.ajax_hoot_save_thankyou_email ){
                    location.href = location.href + '?saved=true';
                }
                else if( data.schedule_type === 'now' || data.schedule_type === 'once' ){
                    location.href = HOOT_PARAMS.tf_outreach_uri + 'published/';
                }
                else{
                    location.href = HOOT_PARAMS.tf_outreach_uri + 'scheduled/';
                }
            }
        });

        // create image from base64
        // if( data.header_image != '' ){
        //     $.ajax({
        //         method: "POST",
        //         url: HOOT_PARAMS.tf_outreach_uri,
        //         data: {
        //             ajax_hoot_create_image_from_base64: true,
        //             nonce: data.nonce,
        //             image: data.header_image,
        //         },
        //         cache: false,
        //     }).done(function( response ) {
                    
        //         if( response.success ){
        //             data.header_image = response.data;
        //         }
        //         else{
        //             data.header_image = '';
        //         }

        //         console.log();
                
        //         // send_email( data, submit_el );
        //     });
        // }
        // else{
        //     send_email( data, submit_el );
        // }
    }

    // send now button click event (Thank you Form)
    panel_el.find('[data-action="send_email_now"]').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        form_data.schedule_type = 'now';
        form_data.schedule_datetime = null;
        return submit_form();        
    });

    // schedule post button click event (email form)
    panel_el.find('[data-action="send_email_automate"]').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        return submit_form( e );
    });

    // datetime picker: Change event
    panel_el.find('[name="hoot-input-datetime"]').on('input change', function(e){
        form_data.schedule_datetime = $(this).val();        
    });

    // subject: change event
    panel_el.find('[name="hoot-input-subject"]').on('input', function(e){
        var _self = $(this);
        form_data.subject = _self.val();    
        preview_el.find('.hoot-preview-title').text( _self.val() );
    });

    // message: change event
    panel_el.find('[name="hoot-input-message"]').on('input', function(e){
        var _self = $(this);
        form_data.message = _self.val();
        preview_el.find('.hoot-preview-text .__text').html( _self.val().replace(/(?:\r\n|\r|\n)/g, '<br>') );
    });

    // button text: change event
    panel_el.find('[name="hoot-input-button-text"]').on('input', function(e){
        var _self = $(this);
        form_data.button_text = _self.val();   
        preview_el.find('.hoot-preview-text .btn').text( _self.val() );
    });

    // outreach type: change event
    panel_el.find('[name="hoot-input-outreach-type"]').on('change', function(e){
        form_data.outreach_type = $(this).val();
    });

    // outreach frequency: change event
    panel_el.find('[name="hoot-input-switch"]').on('input', function(e){
        form_data.schedule_type = $(this).val() == 0 ? 'once' : 'automate';
        panel_el.attr('data-schedule', form_data.schedule_type);

        if( form_data.schedule_type === 'once' ){
            panel_el.find('.hoot-email-schedule-preview').hide();
        }
        else if( automate_modal_el.find('[name="automate_day[]"]:checked').length ){
            panel_el.find('.hoot-email-schedule-preview').show();
        }
    });

    /// ==============================================================================================
    /// Uploader (Email page)
    /// ==============================================================================================

    var croppa = null;

    // when delete is clicked
    HOOT.doc.find('[data-action="delete-photo"]').on('click', function( e ){
        e.preventDefault();

        panel_el.find('[name="email_header_image_id"]').val(0);
        preview_el.find('.hoot-preview-media').html('').hide();
        panel_el.find('.__drop_area').removeAttr('data-status');

        form_data.header_image = '';
        form_data.header_image_id = 0;

        if( croppa ){
            croppa.destroy();
            croppa = null;
        }
    });

    // when save is clicked
    panel_el.find('[data-action="upload-coppie-image"]').on('click', function(e){
        e.preventDefault();

        var image = croppa.result();

        form_data.header_image = image;

        preview_el.find('.hoot-preview-media').html('<img src="' + image + '" crossorigin="anonymous">').show();
        panel_el.find('.__drop_area_preview img').attr('src', image);
        panel_el.find('.__drop_area').attr('data-status', 'preview');
        panel_el.find('[name="email_header_image_id"]').val(0);

        panel_el.find('[data-action="image-edit-mode"]').removeClass('disabled');
    });

    // when edit is clicked
    panel_el.find('[data-action="image-edit-mode"]').on('click', function(e){
        e.preventDefault();

        var $this = $(this);

        if( $this.hasClass('disabled') ) return false;

        $this.addClass('disabled');

        if( ! croppa && window.hasOwnProperty('OUTREACH_HEADER_IMAGE') ){
            var thankYouImage = new Image();
        
            thankYouImage.onload = function(){

                panel_el.find('.__drop_area').attr('data-status', 'edit');

                croppa = new Croppa({
                    image_url: OUTREACH_HEADER_IMAGE,
                    container: '#hoot-email .__drop_area_edit_crop',
                    container_size: [ 800, 600 ],
                    crop_box_size: [ 700, 350 ],
                    crop_box_resize: true,
                    show_zoomer: false,
                    cross_origin: true,
                });
            }
    
            thankYouImage.crossOrigin = "anonymous";
            thankYouImage.src = OUTREACH_HEADER_IMAGE;
        }
        else{
            panel_el.find('.__drop_area').attr('data-status', 'edit');
        }
    });

    // when rotate left is clicked
    panel_el.find('[data-action="rotate-left"]').on('click', function(e){
        e.preventDefault();
        croppa.rotate_left();
    });

    // when rotate right is clicked
    panel_el.find('[data-action="rotate-right"]').on('click', function(e){
        e.preventDefault();
        croppa.rotate_right();
    });

    // drag events
    panel_el.find('.__drop_area_drop').on('dragenter', function(e){
        e.preventDefault();
    });

    panel_el.find('.__drop_area_drop').on('dragover', function(e){
        e.preventDefault();
    });

    // Action when an image is dropped
    panel_el.find('.__drop_area_drop').on('drop', function(e){
        e.preventDefault();

        var files = e.originalEvent.dataTransfer.files;

        readImage( files );
    });
    
    // Open dialog window
    doc.on( 'click', '.__drop_area_drop', function(e){
        panel_el.find('[name="hoot-input-file"]').trigger('click');
    });

    // Handle croppa errors
    window.onerror = function( msg, url, line, colno, error ) {

        if( ! error.hasOwnProperty('type') ) return true;
        if( error.type !== 'croppa' ) return true;

        panel_el.find('.__drop_area').removeAttr('data-status');
        panel_el.find('.__drop_area_preview img').attr('src', '');
        preview_el.find('.hoot-preview-media').html('<img src="" crossorigin="anonymous">').hide();

        if( error.code == 6 || error.code == 7 ){
            alert( 'Please select a bigger image.' );
        }
    }

    // Action when image is selected from file dialog
    doc.on('change', '#hoot-email [name="hoot-input-file"]', function(e){
        
        e.preventDefault();

        var tgt = e.target || window.event.srcElement,
        files = tgt.files;

        readImage( files );
    });

    /**
     * ReadImage & Init croppa
     * 
     * @param {FileList} files 
     */
    var readImage = function( files ){

        panel_el.find('.__drop_area').attr('data-status', 'uploading');
        panel_el.find('[type="submit"]').attr('disabled', 'disabled');
        preview_el.find('.hoot-preview-media-loading').show();

        // FileReader support
        if( FileReader && files && files.length ){

            var fr = new FileReader();

            // when file is loaded
            fr.onload = function () {

                panel_el.find('[type="submit"]').removeAttr('disabled');
                preview_el.find('.hoot-preview-media-loading').hide();

                panel_el.find('.__drop_area').attr('data-status', 'edit');
                panel_el.find('.__drop_area_preview img').attr('src', fr.result );

                preview_el.find('.hoot-preview-media').html('<img src="' + fr.result + '" crossorigin="anonymous">').show();

                croppa = new Croppa({
                    image_url: fr.result,
                    container: '#hoot-email .__drop_area_edit_crop',
                    container_size: [ 800, 600 ],
                    crop_box_size: [ 700, 350 ],
                    crop_box_resize: true,
                    show_zoomer: false,
                    cross_origin: true,
                });  
            }

            fr.readAsDataURL(files[0]);
        }

        // Not supported
        else {
            alert('Please use a modern browser');
        }
    };

    /// ==============================================================================================
    /// Automate modal
    /// ==============================================================================================

    /**
     * Automate modal setup
     */
    if( $('#hoot-modal-automate-tmpl').length ){
        $('.hoot-modal-automate-container').append($('#hoot-modal-automate-tmpl').html());
        automate_modal_el = $('#hoot-modal-automate');
    }

    /**
     * Open Automate modal
     */
    $('[data-action="open_automate_modal"]').on('click', function( e ){
        e.preventDefault();
        automate_modal_el.addClass('show');
    });

    /**
     * Close Automate modal
     */
    HOOT.doc.on('click', '#hoot-modal-automate button.__cancel', function(e){
        e.preventDefault();
        automate_modal_el.removeClass('show');
    });

    /**
     * Automate modal: Add click event
     */
    HOOT.doc.on('click', '#hoot-modal-automate button.__add', function(e){
        e.preventDefault();

        var form = automate_modal_el.find('form');
        var days = [];
        var days_el = form.find('[name="automate_day[]"]:checked');
        var hour = parseInt(form.find('[name="automate_hour"]').val());
        var minute = parseInt(form.find('[name="automate_minute"]').val());
        var pam = form.find('[name="automate_pam"]').val();

        panel_el.find('.hoot-email-schedule-preview').html('').show();

        days_el.each(function(){
            days.push($(this).val());

            panel_el.find('.hoot-email-schedule-preview').append(
                '<div>'
                    + '<span>'+hour+':' + ( minute < 10 ? '0' + minute : minute) + ' ' + pam.toUpperCase() + '</span>'
                    + '<span>'+HOOT.ucfirst( $(this).val() )+'</span>'
                +'</div>'
            );
        });
        
        form_data.schedule_automate.days = days;
        form_data.schedule_automate.time = {};
        form_data.schedule_automate.time.hour = hour;
        form_data.schedule_automate.time.minute = minute;
        form_data.schedule_automate.time.pam = pam;

        if( days_el.length ){
            panel_el.find('[data-action="send_email_automate"]').removeAttr('disabled');            
        }
        else{
            panel_el.find('[data-action="send_email_automate"]').attr('disabled', 'disabled');
            panel_el.find('.hoot-email-schedule-preview').hide();
        }

        automate_modal_el.removeClass('show');
    });

    /**
     * Automate modal: when a day is clicked
     */
    var $automateModalCheckboxes = $('#hoot-modal-automate form [type="checkbox"]');

    $automateModalCheckboxes.on('click', function(e){
        e.stopPropagation();

        var $this = $(this);
        $automateModalCheckboxes.prop('checked', false).removeAttr('checked');
        $this.prop('checked', true).attr('checked', 'checked');
    });

    /**
     * Modal ideas: When subject idea is changed
     */
    var $formSubjectIdeas = $('.form_subject_ideas [type="checkbox"]');

    $formSubjectIdeas.on('click', function(e){
        e.stopPropagation();

        var $this = $(this);
        $formSubjectIdeas.prop('checked', false).removeAttr('checked');
        $this.prop('checked', true).attr('checked', 'checked');
    });

    /**
     * Modal ideas: When select buttton is clicked
     */
    $('[data-action="select_subject_idea"]').on('click', function(e){
        e.preventDefault();
        $('#hoot-email [name="hoot-input-subject"]').val( $formSubjectIdeas.filter(':checked').val() );
        $('#hoot-modal-ideas').modal('hide');
    });

    /// ==============================================================================================
    /// Edit Mode
    /// ==============================================================================================

    /**
     * Header Image Croppa Init
     */
    if( window.hasOwnProperty('OUTREACH_HEADER_IMAGE') ){
        panel_el.find('.__drop_area').attr('data-status', 'preview');
        panel_el.find('.__drop_area_preview img').attr('crossorigin', 'anonymous').attr('src', OUTREACH_HEADER_IMAGE );
        preview_el.find('.hoot-preview-media').html('<img src="' + OUTREACH_HEADER_IMAGE + '" crossorigin="anonymous">').show();  
    }

    /**
     * Contacts
     */
    if( window.hasOwnProperty('OUTREACH_CONTACTS') ){
        OUTREACH_CONTACTS.map(function(email){
            add_contact_el({
                email: email,
                first_name: '',
                last_name: '',
            });
        });
    }

    /**
     * Schedule (Automate modal)
     */
    if( window.hasOwnProperty('OUTREACH_SCHEDULE') ){

        OUTREACH_SCHEDULE.hour = parseInt(OUTREACH_SCHEDULE.hour);
        OUTREACH_SCHEDULE.minute = parseInt(OUTREACH_SCHEDULE.minute);

        automate_modal_el.find('[name="automate_hour"]').val(OUTREACH_SCHEDULE.hour);
        automate_modal_el.find('[name="automate_minute"]').val(OUTREACH_SCHEDULE.minute);
        automate_modal_el.find('[name="automate_pam"]').val(OUTREACH_SCHEDULE.pam.toUpperCase());

        OUTREACH_SCHEDULE.days.map(function(day){
            automate_modal_el.find('[value="'+day+'"]').attr('checked', 'checked');

            panel_el.find('.hoot-email-schedule-preview').append(
                '<div>'
                    + '<span>'+ OUTREACH_SCHEDULE.hour +':' + ( OUTREACH_SCHEDULE.minute < 10 ? '0' + OUTREACH_SCHEDULE.minute : OUTREACH_SCHEDULE.minute) + ' ' + OUTREACH_SCHEDULE.pam.toUpperCase() + '</span>'
                    + '<span>'+HOOT.ucfirst( day )+'</span>'
                +'</div>'
            );
        });

        panel_el.find('.hoot-email-schedule-preview').show();
        panel_el.find('.hoot-email-footer-frequency .hoot-component-switch [type="hidden"]').val(1).trigger('input');
        panel_el.find('.hoot-email-footer-frequency .hoot-component-switch button[data-key="0"]').attr('data-selected', 0);
        panel_el.find('.hoot-email-footer-frequency .hoot-component-switch button[data-key="1"]').attr('data-selected', 1);
        panel_el.find('.hoot-email-footer-buttons-automate [type="submit"]').removeAttr('disabled').prop('disabled', false);

        form_data.schedule_automate.days = OUTREACH_SCHEDULE.days;
        form_data.schedule_automate.time = {};
        form_data.schedule_automate.time.hour = OUTREACH_SCHEDULE.hour;
        form_data.schedule_automate.time.minute = OUTREACH_SCHEDULE.minute;
        form_data.schedule_automate.time.pam = OUTREACH_SCHEDULE.pam;
        form_data.schedule_type = "automate";
    }

})(jQuery);