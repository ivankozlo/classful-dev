/**
 * Events js part
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    var MYSQL_DATE_FORMAT = 'Y-m-d H:i:s';
    var PREVIEW_DATE_FORMAT = 'l, F d, Y h:ia';

    var $doc = $(document);
    var $form = $('#event-form');
    var $preview = $('#event-preview');
    var form_data = {};

    var state = {
        status: 'draft',
        is_ajax_saving: false,
        is_cover_changed: false,
        is_original_cover_changed: false,
    };

    var croppa = null;
    var croppaData = {
        image_url: null,
        container: '#event-form .__drop_area_edit_crop',
        container_size: [ 800, 600 ],
        crop_box_size: [ 700, 350 ],
        crop_box_resize: true,
        show_zoomer: false,
        cross_origin: true,
    };

    var $start_date = new HOOT.dateTimePickerModal({
        selector: '#event-form .start_date_component',
    });

    var $end_date = new HOOT.dateTimePickerModal({
        selector: '#event-form .end_date_component',
    });
    
    if( $('#event-form .start_date_component').length ){
        form_data.start_date_obj = $start_date.getDateObject();
        form_data.start_date = form_data.start_date_obj.format(MYSQL_DATE_FORMAT);
            
        // when start_date is changed
        $start_date.on( 'close', function( dateObject ){
    
            form_data.start_date = dateObject.format(MYSQL_DATE_FORMAT);
            form_data.start_date_obj = dateObject;
    
            update_preview_when();
        });
    }

    if( $('#event-form .end_date_component').length ){

        form_data.end_date_obj = $end_date.getDateObject();
        form_data.end_date = form_data.end_date_obj.format(MYSQL_DATE_FORMAT);

        // when end_date is changed
        $end_date.on( 'close', function( dateObject ){
    
            form_data.end_date = dateObject.format(MYSQL_DATE_FORMAT);
            form_data.end_date_obj = dateObject;
    
            update_preview_when();
        });
    }

    function update_preview_when(){

        var date_str = '';

        // same day
        if( form_data.end_date_obj.format('Y-m-d') === form_data.start_date_obj.format('Y-m-d') ){
            
            date_str = form_data.start_date_obj.format(PREVIEW_DATE_FORMAT);
            date_str += '-' + form_data.end_date_obj.format('h:ia');

            $preview.find('.__when_area p').html( date_str );
        }
        else{

            date_str += form_data.start_date_obj.format(PREVIEW_DATE_FORMAT);
            date_str += '<br>' + form_data.end_date_obj.format(PREVIEW_DATE_FORMAT);
            
            $preview.find('.__when_area p').html( date_str );
        }

        $preview.find('.__when_area .event-preview-notice').addClass('__hidden');
        $form.find('.event-create-date-preview.__start_date').text(form_data.start_date_obj.format('F jS, Y h:ia'));
        $form.find('.event-create-date-preview.__end_date').text(form_data.end_date_obj.format('F jS, Y h:ia'));
    }
    
    // when title is changed
    $form.find('[name="title"]').on('input', function(){
        form_data.title = $(this).val();
        $preview.find('.event-cover-title').text( form_data.title );
    });

    // when "Show profile image & name" is changed
    $form.find('[name="show_profile_image_and_name"]').on('change', function(){
        form_data.show_profile_image_and_name = $(this).val();

        if( form_data.show_profile_image_and_name == 1 ){
            $preview.find('.event-cover-avatar').removeClass( '__hidden' );
        }
        else{
            $preview.find('.event-cover-avatar').addClass( '__hidden' );
        }
    });

    // when "event type" is changed
    $form.find('[name="type"]').on('input', function(){
        form_data.type = $(this).val();
        event_type_actions();
    });

    function event_type_actions(){


        if( form_data.type === 'free' ){
            
            $form.find('.__price_area').addClass('__hidden');
            $form.find('.__per_student_or_family_area').addClass('__hidden');
            $form.find('.__goal_area').addClass('__hidden');

            $preview.find('.donation-box__text').addClass('__hidden');
            $preview.find('.donation-box__title').text('Will you be attending?');            
            $preview.find('.donation-box__goal').addClass('__hidden');
        }
        else{
            
            $form.find('.__price_area').removeClass('__hidden');
            $form.find('.__per_student_or_family_area').removeClass('__hidden');
            $form.find('.__goal_area').removeClass('__hidden');

            $preview.find('.donation-box__title').text( '$' + (form_data.price || 0) );
            $preview.find('.donation-box__text').removeClass('__hidden').text( 'Per ' + (form_data.per_student_or_family || 'student') );

            if( form_data.is_goal_enabled == 1 ){
                $preview.find('.donation-box__goal').removeClass('__hidden');
            }
        }
    }

    // when "price" is changed
    $form.find('[name="price"]').on('input', function(){
        form_data.price = $(this).val();
        $preview.find('.donation-box__title').text('$' + form_data.price);
    });

    // when "per student or family" is changed
    $form.find('[name="per_student_or_family"]').on('input', function(){
        form_data.per_student_or_family = $(this).val();
        $preview.find('.donation-box__text').text( 'Per ' + form_data.per_student_or_family );
    });

    // when "set goal" is changed
    $form.find('[name="is_goal_enabled"]').on('input', function(){
        form_data.is_goal_enabled = $(this).val();
        event_goal_actions();
    });

    function event_goal_actions(){
        if( form_data.is_goal_enabled == 1 ){
            $form.find('.__goal_price_area').removeClass('__hidden');
            $preview.find('.donation-box__goal').removeClass('__hidden');
        }
        else{
            $form.find('.__goal_price_area').addClass('__hidden');
            $preview.find('.donation-box__goal').addClass('__hidden');
        }

        $preview.find('.donation-goal__price').text( '$' + ( form_data.goal || 0 ) );
    }

    // when "goal" is changed
    $form.find('[name="goal"]').on('input', function(){
        form_data.goal = $(this).val();
        $preview.find('.donation-goal__price').text( '$' + form_data.goal );
    });

    // when "Location name" is changed
    $form.find('[name="location_name"]').on('input', function(){

        form_data.location_name = $(this).val();
        form_data.address = form_data.address || '';

        var $notice = $preview.find('.__where_area .event-preview-notice');

        if( form_data.location_name === '' && form_data.address === '' ){
            $notice.removeClass('__hidden');
            $preview.find('.__where_area p').html(''); // it removes the <br> tag
        }
        else{
            $notice.addClass('__hidden');
            $preview.find('.__where_area p').html( form_data.location_name + '<br>' + form_data.address );
        }

    });

    // when "address" is changed
    $form.find('[name="address"]').on('input', function(){

        form_data.address = $(this).val();
        form_data.location_name = form_data.location_name || '';
        
        var $parent = $preview.find('.__where_area');
        var $notice = $parent.find('.event-preview-notice');
    
        if( form_data.location_name === '' && form_data.address === '' ){
            $notice.removeClass('__hidden');
            $parent.find('p').html(''); // it removes the <br> tag
        }
        else{
            $notice.addClass('__hidden');
            $parent.find('p').html( form_data.location_name + '<br>' + form_data.address );
        }

    });

    // when "description" is changed
    $form.find('[name="description"]').on('input', function(){
        form_data.description = $(this).val();

        var $desc_notice = $preview.find('.__description_area .event-preview-notice');

        if( form_data.description === '' ){
            $desc_notice.removeClass('__hidden');
        }
        else{
            $desc_notice.addClass('__hidden');
        }

        $preview.find('.__description_area p').text( form_data.description );
    });

    // when "show_people_attending" is changed
    $form.find('[name="show_people_attending"]').on('input', function(){
        form_data.show_people_attending = $(this).val();

        if( form_data.show_people_attending == 1 ){
            $preview.find('.__people_attending_area').removeClass('__hidden');
        }
        else{
            $preview.find('.__people_attending_area').addClass('__hidden');
        }
    });

    /// ==============================================================================================
    /// Croppa
    /// ==============================================================================================

    // when delete is clicked
    $doc.find('#event-form [data-action="delete-photo"]').on('click', function( e ){
        e.preventDefault();

        $form.find('.__drop_area').removeAttr('data-status');

        form_data.cover_image = '';        
        state.is_cover_changed = true;

        if( croppa ){
            croppa.destroy();
            croppa = null;
        }

        ajax_update_event( state.status, false, false );
    });
    
    // when save is clicked
    $form.find('[data-action="upload-coppie-image"]').on('click', function(e){
        e.preventDefault();

        var image = croppa.result();

        form_data.cover_image = image;
        state.is_cover_changed = true;

        $form.find('.__drop_area_preview img').attr('src', image);
        $form.find('.__drop_area').attr('data-status', 'preview');
        $preview.find('.event-cover-bg').css('background-image', 'url('+form_data.cover_image+')');

        $('html, body').animate({
            scrollTop: $form.find('.hoot-component-image-croppa').offset().top - 20
        }, 300);

        ajax_update_event( state.status, false, false );
    });

    // when edit is clicked
    $form.find('[data-action="image-edit-mode"]').on('click', function(e){
        e.preventDefault();
        $form.find('.__drop_area').attr('data-status', 'edit');
        
        if( ! croppa && state.cover_image ){
            croppaData.image_url = state.cover_image;
            croppa = new Croppa( croppaData );
        }
    });
    
    // when rotate left is clicked
    $form.find('[data-action="rotate-left"]').on('click', function(e){
        e.preventDefault();
        croppa.rotate_left();
    });
    
    // when rotate right is clicked
    $form.find('[data-action="rotate-right"]').on('click', function(e){
        e.preventDefault();
        croppa.rotate_right();
    });

    // drag events
    $form.find('.__drop_area_drop').on('dragenter', function(e){
        e.preventDefault();
    });

    $form.find('.__drop_area_drop').on('dragover', function(e){
        e.preventDefault();
    });
    
    // Action when an image is dropped
    $form.find('.__drop_area_drop').on('drop', function(e){
        e.preventDefault();

        var files = e.originalEvent.dataTransfer.files;

        readImage( files );
    });
        
    // Open dialog window
    $doc.on( 'click', '#event-form .__drop_area_drop', function(e){
        $form.find('[name="cover_image"]').trigger('click');
    });
    
    // "when cover image" is changed
    $form.find('[name="cover_image"]').on('change', function(e){

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

        $form.find('.__drop_area').attr('data-status', 'uploading');
        $form.find('[type="submit"]').attr('disabled', 'disabled');

        // FileReader support
        if( FileReader && files && files.length ){

            var fr = new FileReader();

            // when file is loaded
            fr.onload = function () {

                $form.find('[type="submit"]').removeAttr('disabled');
                $form.find('.__drop_area').attr('data-status', 'edit');
                $form.find('.__drop_area_preview img').attr('src', fr.result );

                state.cover_image = fr.result;

                croppaData.image_url = fr.result;
                croppa = new Croppa( croppaData );
                
            }

            fr.readAsDataURL(files[0]);
        }

        // Not supported
        else {
            alert('Please use a modern browser');
        }
    };

    /// ==============================================================================================
    /// Create draft
    /// ==============================================================================================

    /**
     * Ajax: Create new draft
    **/
    $form.find('[name="title"]').on('blur', function(e){
        
        var $self = $(this);

        // do not save as a draft when editing
        if( $form.find('[name="id"]').val() != 0 ) return false;
        if( ! $self.val().length ) return false;
        if( state.is_ajax_saving ) return false;
        
        state.is_ajax_saving = true;

        var data = {};
        data.title = $self.val();
        data.ajax_create_event_draft = true;
        data.nonce = EVENT_PARAMS.nonce;

        $.ajax({
            method: "POST",
            data: data,
            cache: false,
        }).done(function( response ) {     
            
            state.is_ajax_saving = false;

            if( ! response.success ) return;

            $form.find('[name="id"]').val( response.data.id );            
            $form.find('[name="save_status"]').val( 'draft' );            

            $self.off('blur');
        });
    });

    /**
     * Ajax: Update draft 
    **/
    var draft_update_timer;

    $doc.on('change input', '#event-form [name]', function(){
        
        if( $form.find('[name="id"]').val() == 0 ) return false;
        if( state.is_ajax_saving ) return false;
        if( state.status !== 'draft' ) return false;        
        if( $(this).is('[name="cover_image"]') ) return false;
        
        clearTimeout( draft_update_timer );

        draft_update_timer = setTimeout(function(){
            ajax_update_event( 'draft', false, false );
        }, 4000 );
    });  
    
    /// ==============================================================================================
    /// Update event
    /// ==============================================================================================

    /**
     * 
     * Ajax: Update event
     * @param {object} submit_el 
     * @param {bool} is_flash_message
     * @param {bool} is_redirect
     */
    function ajax_update_event( status, is_flash_message, is_redirect ){

        var $id = $form.find('[name="id"]');

        if( ! $id.length ) return false;

        if( state.is_ajax_saving ) return false;

        // we are ajaxing!
        // after id check
        state.is_ajax_saving = true;

        var data = form_data;
        data.nonce = EVENT_PARAMS.nonce;
        data.is_flash_message = is_flash_message ? 1 : 0;
        data.is_cover_changed = state.is_cover_changed,
        data.is_original_cover_changed = state.is_original_cover_changed,
        data.id = $id.val();
        data.save_status = status;
        data.ajax_update_event = true;
        
        // no need to re-save the cover again
        if( ! state.is_cover_changed ){
            data.cover_image = 0;
        }

        // remove error classes and error notices
        $form.find('.error').removeClass('error');

        // disabled submit button
        var submit_el = $form.find('[type="submit"]');
        submit_el.attr('disabled', 'disabled');
        
        $.ajax({
            method: "POST",
            data: data,
            cache: false,
        }).done(function( response ) {
            
            state.is_ajax_saving = false;
            state.is_cover_changed = false;
            state.is_original_cover_changed = false;

            if( ! response.success ){

                if( response.data.hasOwnProperty('errors') ){
                
                    response.data.errors.map(function( error ){
                        
                        if( error.type === 'refresh' ){
                            location.reload();
                        }
                        else if( error.type === 'alert' ){
                            alert( error.message );
                        }
                        else if( error.type === 'input' ){
                            $form.find(error.input).addClass('error');
                        }
                        else if( error.type === 'scroll' ){
                            $('html, body').animate({
                                scrollTop: $form.offset().top - 20
                            }, 300);
                        }
                    });

                    if( $form.find('.error:first').length ){
                        $('html, body').animate({
                            scrollTop: $form.find('.error:first').offset().top - 80
                        }, 300);
                    }
                }
                                
                submit_el.removeAttr('disabled');
                return false;
            }

            state.status = status;

            if( is_redirect ){
                location.href = '/dashboard/events/';
            }
            else{
                submit_el.removeAttr('disabled');
            }
        });
    }

    // when publish is clicked
    $form.find('[data-action="publish-event"]').on('click', function(e){
        e.preventDefault();
        ajax_update_event( 'published', true, true );
    });

    // when "save for later" is clicked
    $form.find('[data-action="save-event"]').on('click', function(e){
        e.preventDefault();
        ajax_update_event( 'draft', true, true );
    });

    /// ==============================================================================================
    /// Edit mode
    /// ==============================================================================================
    if( window.hasOwnProperty('EVENT') ){

        if( EVENT.type === '' || ! EVENT.type ) EVENT.type = 'free';
        if( EVENT.per_student_or_family === '' || ! EVENT.per_student_or_family ) EVENT.per_student_or_family = 'student';
        if( EVENT.per_student_or_family === '' || ! EVENT.per_student_or_family ) EVENT.per_student_or_family = 'student';

        form_data = EVENT;

        state.status = form_data.save_status;

        event_type_actions();
        event_goal_actions();

        form_data.end_date_obj = $start_date.getDateObject();
        form_data.start_date_obj = $end_date.getDateObject();

        // Croppa
        if( EVENT_cover_image_url !== '' ){
            
            state.cover_image = EVENT_cover_image_url;
            
            $form.find('[type="submit"]').removeAttr('disabled');
            $form.find('.__drop_area').attr('data-status', 'downloading');

            var image = new Image;
            image.crossOrigin = "anonymous";
            image.onload = function(){                
                $form.find('.__drop_area').attr('data-status', 'preview');
                $form.find('.__drop_area_preview img').attr('src', this.src );
                $preview.find('.event-cover-bg').css('background-image', 'url('+this.src+')');
            }

            image.src = EVENT_cover_image_url;
        }

    }

    /// ==============================================================================================
    /// Event List
    /// ==============================================================================================

    // when tooltip pause button is clicked
    $('.event-items .program-item-tooltip .__pause').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();

        if( ! confirm('Are you sure?') ){
            return false;
        }

        var $self = $(this);

        $.ajax({
            url: EVENT_PARAMS.events_base_url + 'create/',
            method: "POST",
            data: {
                ajax_pause_event: true,
                nonce: EVENT_PARAMS.nonce,
                id: $self.attr('data-id'),
            },
            cache: false,
        }).done(function( response ) {   
            $self.closest('.program-item-tooltip').find('.custom-tooltip').removeClass('show');
            location.reload();
        });
    });
    
    var $model_sa_delete_modal = $('#modal-delete-warning');
    var $model_t_delete_modal = $('#modal-teacher-delete-info');

    // when tooltip delete button is clicked
    $('.event-items .program-item-tooltip .__delete').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();

        var $self = $(this);

        $.ajax({
            url: EVENT_PARAMS.events_base_url + 'create/',
            method: "POST",
            data: {
                ajax_before_delete_event: true,
                nonce: EVENT_PARAMS.nonce,
                id: $self.attr('data-id'),
            },
            cache: false,
        }).done(function( response ) {   

            $self.closest('.program-item-tooltip').find('.custom-tooltip').removeClass('show');

            if( ! response.success ){

                if( response.data.type === 'flash' ){
                    location.reload();
                }

                return false;
            }

            // you can delete!
            if( response.data.has_sales == 0 ){
                delete_event($self.attr('data-id'));
            }
            // show a warning
            else{
                $model_sa_delete_modal.find('[data-action="delete_item_now"]').attr('data-id', $self.attr('data-id'));
                $model_sa_delete_modal.modal('show');
            }            
        });
    });

    // when delete event now is clicked
    $('[data-action="delete_item_now"]').on('click', function(e){
        e.preventDefault();
        delete_event($(this).attr('data-id'));
    });
    
    /**
     * Delete event
     * @param {int} id 
     */
    function delete_event( id ){
        $.ajax({
            cache: false,
            url: EVENT_PARAMS.events_base_url + 'create/', 
            method: "POST",
            data: {
                ajax_delete_event: true,
                nonce: EVENT_PARAMS.nonce,
                id: id,
            },
        }).done(function( response ) {                
            location.reload();
        });
    }
    
    // when tooltip edit button is clicked
    $('.event-items .program-item-tooltip .__edit').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        location.href = $(this).find('a').attr('href');
    });

    // when item tooltip is clicked
    $('.event-item .program-item-tooltip').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        $(this).parent().find('.custom-tooltip').toggleClass('show');
    });

    /**
     * Document click event
     * 
     * Close post tooltip
     * 
     */
    $doc.on('click', function(e){

        var _self = $(e.target);        
        var is_post_tooltip = _self.is('.custom-tooltip--event') 
            || _self.is('.tooltip-trigger--event')
            || _self.closest('.custom-tooltip--event').length;
                
        if( ! is_post_tooltip ){
            $('.custom-tooltip--event').removeClass('show');
        }
    });
    
    // when event item is clicked (Event List Page)
    $('.event-items .event-item').on('click', function(){

        var $this = $(this);
        var id = $this.attr('data-id');
        var status = $this.attr('data-status');
        var $preview = $('.event-preview')
        $this.addClass('active').siblings().removeClass('active');
        
        // update preview
        EVENTS.map(function( item ){

            if( item.id == id ){

                if( status === 'published' ){
                    $preview.removeClass('inactive').addClass('active');
                }
                else{
                    $preview.removeClass('active').addClass('inactive');
                }

                $preview.find('.__preview_btn').attr( 'href', EVENT_PARAMS.base_url + '/events/' + item.slug );
                $preview.find('.__preview_name span').text( item.title );
                $preview.find('.__preview_desc').text( item.description || '' );

                var address = '';

                if( item.location_name && item.location_name !== '' ){
                    address += item.location_name + '<br>';
                }

                if( item.address && item.address !== '' ){
                    address += item.address + '<br>';
                }

                var ul_content = $this.find('.program-item-left-section ul').html();
                $preview.find('.program-item-left-section ul').html(ul_content);

                $('html, body').animate({
                    scrollTop: $preview.offset().top - 20
                }, 500);
            }
        });
    });

})(jQuery);