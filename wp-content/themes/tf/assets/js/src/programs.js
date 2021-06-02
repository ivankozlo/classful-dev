/**
 * Programs js part
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    var DATE_FORMAT = 'F jS, Y';
    var $doc = $(document);
    var $html = $('html');
    var $form = $('#program-form');
    var $preview = $('#program-preview');
    var is_ajax_saving = false;
    var $cover_box = $('.program-preview-box');

    var form_data = {
        program_for_type: 'grades',
        type: 'paid',
        days_type: 'one-time',
        one_time_day_data: {},
        repeat_days_data: {},
        specific_days_data: {
            dates: [], // default
        },
        free_types_count: 0,
        paid_types_count: 0,
        donation_types_count: 0,
        paid_types: [],
        donation_types: [],
        free_type: [],
    };

    var paidTypes = new ProgramTypeCollection();
    var freeTypes = new ProgramTypeCollection();
    var donationTypes = new ProgramTypeCollection();

    /**
     * Ajax: Update program
     * 
     * @param {object} submit_el 
     * @param {string} status
     * @param {bool} is_flash_message
     * @param {bool} is_redirect
     */
    function ajax_update_program( submit_el, status, is_flash_message, is_redirect ){

        var $id = $form.find('[name="id"]');

        if( ! $id.length ) return false;

        if( is_ajax_saving ) return false;

        is_ajax_saving = true;

        var data = form_data;
        data.id = $id.val();
        data.save_status = status;
        data.ajax_update_program = true;
        data.nonce = $form.find('[name="nonce"]').val();
        data.is_flash_message = is_flash_message ? 1 : 0;

        // program types        
        if( data.type === 'paid' ){
            data.types = paidTypes.toArray();
        }
        else if( data.type === 'donation' ){
            data.types = donationTypes.toArray();
        }
        else if( data.type === 'free' ){
            data.types = freeTypes.toArray();
        }
                
        // remove error classes and error notices
        $form.find('.error').removeClass('error');

        // check name
        if( ! data.hasOwnProperty('name') || data.name === "" ){
            
            $form.find('[name="name"]').addClass('error');
            is_ajax_saving = false;

            $('html, body').animate({
                scrollTop: $form.find('[name="name"]').offset().top - 60
            }, 500);
            
            submit_el.removeAttr('disabled', 'disabled').prop('disabled', false);

            return false;
        }
        
        // disabled submit button
        submit_el.attr('disabled', 'disabled');

        $.ajax({
            method: "POST",
            data: data,
            cache: false,
        }).done(function( response ) {
            
            is_ajax_saving = false;
        
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
                                scrollTop: panel_el.offset().top - 20
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
            else{

                $form.find('[name="save_status"]').val(status); // set status to prevent auto save

                submit_el.removeAttr('disabled', 'disabled').prop('disabled', false);

                if( is_redirect ){
                    location.href = '/dashboard/programs/';
                }
            }
        });
    }

    //
    // Create new draft
    //
    $form.find('[name="name"]').on('blur', function(e){
        
        var $self = $(this);

        // do not save as a draft when editing
        if( $form.find('[name="id"]').val() != 0 ) return false;
        if( ! $self.val().length ) return false;
        if( is_ajax_saving ) return false;

        is_ajax_saving = true;

        var data = {};
        data.name = $self.val();
        data.ajax_create_program_draft = true;
        data.nonce = $form.find('[name="nonce"]').val();

        $.ajax({
            method: "POST",
            data: data,
            cache: false,
        }).done(function( response ) {            

            is_ajax_saving = false;

            if( ! response.success ) return;

            $form.prepend('<input type="hidden" name="save_status" value="draft" >');
            $form.prepend('<input type="hidden" name="id" value="'+response.data.id+'" >');

            change_cover_box_urls( response.data.id, response.data.slug );
            
            $self.off('blur');
        });
    });

    function change_cover_box_urls( id, slug ){

        var url = PROGRAM_PARAMS.base_url + '/programs/' + slug;

        $cover_box.find('.__program_url').attr( 'href', url );

        $cover_box.find('.__program_fb_share').attr( 'href', url );

        $cover_box.find('.__program_tw_share').attr( 'href', url );
    }

    //
    // Update draft
    //
    var draft_update_timer;
    $doc.on('change input', '.program-form [name]', ajax_update_draft);
    
    function ajax_update_draft(){
        
        var $save_status = $form.find('[name="save_status"]');
        
        if( $form.find('[name="id"]').val() == 0 ) return false;
        if( is_ajax_saving ) return;
        if( ! $save_status.length ) return;
        if( $save_status.val() !== 'draft' ) return;

        clearTimeout( draft_update_timer );

        draft_update_timer = setTimeout(function(){
            ajax_update_program( $form.find('button[type="submit"]'), 'draft', false, false );
        }, 4000 );
    }

    // when "save for later" is clicked
    $form.find('[data-action="program-create-save"]').on('click', function(e){
        e.preventDefault();
        ajax_update_program( $(this), 'draft', true, true );
    });

    // when "publish" is clicked
    $form.find('[data-action="program-create-publish"]').on('click', function(e){
        e.preventDefault();        
        ajax_update_program( $(this), 'published', true, true );
    });

    // when "program name" is changed
    $form.find('[name="name"]').on('input', function(e){
        form_data.name = $(this).val();
        $preview.find('.event-cover-title').text( form_data.name );
    });

    // when "program for type" is changed
    $form.find('[name="program_for_type"]').on('input', function(){

        form_data.program_for_type = $(this).val();

        if( form_data.program_for_type === 'grades' ){
            $form.find('.program-grade-list').removeClass('__hidden');
            $form.find('.program-class-list').addClass('__hidden');
            $form.find('.program-class-create').addClass('__hidden');
        }
        else{
            $form.find('.program-grade-list').addClass('__hidden');
            $form.find('.program-class-list').removeClass('__hidden');
            $form.find('.program-class-create').removeClass('__hidden');
        }
        
    });

    // when "selected grades" are changed
    $form.find('.program-grade-list .custom-control-input').on('change', function(e){

        form_data.grades = [];

        $form.find('.program-grade-list .custom-control-input:checked').each(function(){
            form_data.grades.push( $(this).val() );
        });
    });

    // when "seleted classes" are changed
    $doc.on('change', '.program-form .program-class-list .custom-control-input', function(e){

        form_data.classes = [];

        $form.find('.program-class-list .custom-control-input:checked').each(function(){
            form_data.classes.push( $(this).val() );
        });
    });
    
    // when "address" is changed
    $form.find('[name="address"]').on('input', function(e){

        form_data.address = $(this).val();
        
        var text = form_data.address;

        if( form_data.address_extra && form_data.address_extra !== '' ){
            text = text + '<br>' + form_data.address_extra;
        }

        if( form_data.address === '' ){
            text = text.replace('<br>', '');
        }

        $preview.find('.__where_area p').html( text );

        if( text !== '' ){
            $preview.find('.__where_area .event-preview-notice').addClass( '__hidden' );
        }
        else {
            $preview.find('.__where_area .event-preview-notice').removeClass( '__hidden' );
        }

    });

    // when "address_extra" is changed
    $form.find('[name="address_extra"]').on('input', function(e){
        form_data.address_extra = $(this).val();

        var text = form_data.address_extra;

        if( form_data.address && form_data.address !== '' ){
            text = form_data.address + '<br>' + text;
        }

        $preview.find('.__where_area p').html( text );

        if( text !== '' ){
            $preview.find('.__where_area .event-preview-notice').addClass( '__hidden' );
        }
        else {
            $preview.find('.__where_area .event-preview-notice').removeClass( '__hidden' );
        }
    });

    // when "description" is changed
    $form.find('[name="description"]').on('input', function(e){
        form_data.description = $(this).val();

        $preview.find('.__description_area p').text( form_data.description );

        if( form_data.description !== '' ){
            $preview.find('.__description_area .event-preview-notice').addClass( '__hidden' );
        }
        else {
            $preview.find('.__description_area .event-preview-notice').removeClass( '__hidden' );
        }
    });

    // when "days type" is changed
    $form.find('[name="days_type"]').on('input', function(){
        form_data.days_type = $(this).val();
    });

    // when "program type" is changed
    if( $form.find('[name="type"]').val() == 'paid' && paidTypes.count() === 0 ){
        form_data.program_types_count = 1;
        $form.find('[name="program_types_count"]').val( form_data.program_types_count );
        $form.find('.hoot-component-number span').text( form_data.program_types_count );

        paidTypes.add( new ProgramType( 1, { id: 0, type: 'paid' }) );
    }

    $form.find('[name="type"]').on('input', function(){

        form_data.type = $(this).val();

        if( form_data.type === 'paid' ){

            form_data.program_types_count = paidTypes.count();
            $form.find('.program-create-paid-types').removeClass('__hidden');
            $form.find('.program-create-free-types').addClass('__hidden');
            $form.find('.program-create-donation-types').addClass('__hidden');

            if( paidTypes.count() === 0 ){
                paidTypes.add( new ProgramType( 1, { id: 0, type: 'paid' }) );
                form_data.program_types_count = 1;
            }

            var price_str = $('[name="type-paid-1-min_price"]').val() === '' ? '$000.00' : '$' + $('[name="type-paid-1-min_price"]').val();
            $cover_box.find('.__program_price').text( price_str );

            update_donation_box('paid');
        }
        else if( form_data.type == 'free' ){

            form_data.program_types_count = freeTypes.count();
            $form.find('.program-create-free-types').removeClass('__hidden');
            $form.find('.program-create-paid-types').addClass('__hidden');
            $form.find('.program-create-donation-types').addClass('__hidden');
            
            if( freeTypes.count() === 0 ){
                freeTypes.add( new ProgramType( 1, { id: 0, type: 'free' }) );
                form_data.program_types_count = 1;
            }

            $cover_box.find('.__program_price').text( 'Free' );

            update_donation_box('free');
        }
        else{
            
            form_data.program_types_count = donationTypes.count();
            $form.find('.program-create-donation-types').removeClass('__hidden');
            $form.find('.program-create-paid-types').addClass('__hidden');
            $form.find('.program-create-free-types').addClass('__hidden');

            if( donationTypes.count() === 0 ){
                donationTypes.add( new ProgramType( 1, { id: 0, type: 'donation' }) );
                form_data.program_types_count = 1;
            }

            var price_str = $('[name="type-donation-1-min_price"]').val() === '' ? '$000.00' : '$' + $('[name="type-donation-1-min_price"]').val();
            $cover_box.find('.__program_price').text( price_str );

            update_donation_box('donation');
        }

        $form.find('[name="program_types_count"]').val( form_data.program_types_count );
        $form.find('.hoot-component-number span').text( form_data.program_types_count );
    });

    /**
     * Updation donation box
     * 
     * @param {string} type 
     */
    function update_donation_box( type ){

        if( type === 'paid' ){

            $preview.find('.donation-box__donate').attr('value', 'Buy a ticket');
    
            var lowest_price = 0;
            var types = paidTypes.toArray();
    
            if( types.length ){
                lowest_price = parseFloat(types[0].min_price);
            }
    
            types.map(function( item ){
                if( parseFloat(item.min_price) < lowest_price ){
                    lowest_price = parseFloat(item.min_price);
                }
            });
    
            if( lowest_price === 0 || isNaN(lowest_price) ){
                $preview.find('.donation-box__title').text('Paid');
            }
            else{
                $preview.find('.donation-box__title').text('$' + lowest_price);
            }
        }
        else if( type === 'donation' ){

            $preview.find('.donation-box__donate').attr('value', 'Make a donation');
    
            var lowest_price = 0;
            var types = donationTypes.toArray();
    
            if( types.length ){
                lowest_price = parseFloat(types[0].min_price);
            }
    
            types.map(function( item ){
                if( parseFloat(item.min_price) < lowest_price ){
                    lowest_price = parseFloat(item.min_price);
                }
            });
    
            if( lowest_price === 0 || isNaN(lowest_price) ){
                $preview.find('.donation-box__title').text('Donation');
            }
            else{
                $preview.find('.donation-box__title').text('$' + lowest_price);
            }
        }
        else if( type === 'free' ){

            $preview.find('.donation-box__donate').attr('value', 'Reserve');
            $preview.find('.donation-box__title').text('Will you be attending?');
        }
    }

    // when "program types count" is changed
    $form.find('[name="program_types_count"]').on('change', function(e){

        var $this = $(this);
        var $parent = $('.program-create-'+form_data.type+'-types');
        var value = $this.val();
        var count = $parent.find('.program-create-types-type').length;

        // add
        if( value > count ){
            
            var newType = new ProgramType( value, { id: 0, type: form_data.type });

            if( form_data.type === 'paid' ){
                paidTypes.add( newType );
            }
            else if( form_data.type === 'donation' ){
                donationTypes.add( newType );
            }
            else{
                freeTypes.add( newType );
            }

            $('html, body').animate({
                scrollTop: newType.$el.offset().top - 20
            }, 500);
        }
        // remove
        else{

            if( ! confirm('Are you sure?') ){
                e.preventDefault();

                $this.closest('.hoot-component-number').find('span').text(count);
                $this.val(count);

                return false;
            }
    
            if( form_data.type === 'paid' ){
                paidTypes.removeLast();

                if( value == 0 ){
                    $cover_box.find('.__program_price').text( '$000.00' );
                }
            }
            else if( form_data.type === 'donation' ){
                donationTypes.removeLast();

                if( value == 0 ){
                    $cover_box.find('.__program_price').text( '$000.00' );
                }
            }
            else{
                freeTypes.removeLast();

                if( value == 0 ){
                    $cover_box.find('.__program_price').text( 'Free' );
                }
            }
        }
    });

    // when first type price is changed
    $html.on('program_type_is_updated', function(e, data){
        if( data.index == 1 && data.element.is('.type_min_price') ){
            var value = data.element.val() === '' ? '000.00' : data.element.val();
            $cover_box.find('.__program_price').text( '$' + value );
            update_donation_box( $form.find('[name="type"]').val() );
        }
    });

    // when "is_min_order_enabled" is changed
    $form.find('[name="is_min_order_enabled"]').on('input', function(){
        form_data.is_min_order_enabled = $(this).val();
    });

    // when "minimum order" is changed
    $form.find('[name="min_order"]').on('input', function(){
        form_data.min_order = $(this).val();
    });

    // when "maximum order" is changed
    $form.find('[name="max_order"]').on('input', function(){
        form_data.max_order = $(this).val();
    });

    // when "is_reg_code_required" is changed
    $form.find('[name="is_reg_code_required"]').on('input', function(){
        form_data.is_reg_code_required = $(this).val();
    });

    // when "reg_code" is changed
    $form.find('[name="reg_code"]').on('input', function(){
        form_data.reg_code = $(this).val();
    });

    // when "show_remaining_slots" is changed
    $form.find('[name="show_remaining_slots"]').on('input', function(){
        form_data.show_remaining_slots = $(this).val();
        
        if( form_data.show_remaining_slots == 1 ){
            $cover_box.find('.__program_remaining').removeClass('__hidden');
        }
        else{
            $cover_box.find('.__program_remaining').addClass('__hidden');
        }
    });

    // when "is_pdf_included" is changed
    $form.find('[name="is_pdf_included"]').on('input', function(){
        form_data.is_pdf_included = $(this).val();
    });

    // when "is_pdf_included checkboxes" are changed
    $form.find('[name="include_pdf_on[]"]').on('change', function(){

        form_data.include_pdf_on = [];
        
        $form.find('[name="include_pdf_on[]"]:checked').each(function(){
            form_data.include_pdf_on.push( $(this).val() );
        });
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
    
    // prepare modals
    $('.modal-program-repeat-days-holder').html( $('#modal-program-repeat-days-tmpl').html() );
    $('.modal-program-specific-days-holder').html( $('#modal-program-specific-days-tmpl').html() );
    $('.modal-program-one-time-holder').html( $('#modal-program-one-time-tmpl').html() );

    var $modal_one_time = $('#modal-program-one-time');
    var $modal_repeat_days = $('#modal-program-repeat-days');
    var $modal_specific_days = $('#modal-program-specific-days');
    var $one_time_preview = $form.find('.program-days-preview-area[data-for="one-time"]');
    var $repeat_days_preview = $form.find('.program-days-preview-area[data-for="repeat-days"]');
    var $specific_days_preview = $form.find('.program-days-preview-area[data-for="specific-days"]');

    var $repeat_start_date_datepicker = new HOOT.SingleDatePickerModal({
        selector: '#modal-program-repeat-days .repeat_days_start_date',
        hideButtons: true,
        autoSelect: true,
        closeOnSelect: true,
    });

    var $repeat_end_date_datepicker = new HOOT.SingleDatePickerModal({
        selector: '#modal-program-repeat-days .repeat_days_end_date',
        hideButtons: true,
        autoSelect: true,
        closeOnSelect: true,
    });

    var $one_time_datepicker = new HOOT.SingleDatePickerModal({
        selector: '#modal-program-one-time .one_time_datepicker',
        hideButtons: true,
        autoSelect: true,
        visible: true,
    });

    var $specific_days_datepicker = new HOOT.MultipleDatePickerModal({
        selector: '#modal-program-specific-days .specific_days_datepicker',
        hideButtons: true,
        autoSelect: true,
        closeOnSelect: true,
        visible: true,
    });

    // when "add another" button is clicked
    $form.find('.hoot-component-add-another').on('click', function(e){
        e.preventDefault();

        var days_type = $('.program-form [name="days_type"]').val();

        if( days_type == 'one-time' ){
            $modal_one_time.addClass('show');
        }
        else if( days_type == 'repeat' ){
            $modal_repeat_days.addClass('show');
        }
        else{
            $modal_specific_days.addClass('show');
        }
    });

    // close "one-time" modal
    $('[data-action="close-one-time-modal"]').on('click', function(e){
        e.preventDefault();
        $modal_one_time.removeClass('show');
    });
    
    // close "repeat days" modal
    $('[data-action="close-repeat-days-modal"]').on('click', function(e){
        e.preventDefault();
        $modal_repeat_days.removeClass('show');
    });

    // close "specific days" modal
    $('[data-action="close-specific-days-modal"]').on('click', function(e){
        e.preventDefault();
        $modal_specific_days.removeClass('show');
    });

    // when "repeat days modal" save is clicked 
    $('[data-action="save-repeat-days-modal"]').on('click', function(e){
        e.preventDefault();
        after_repeat_modal_save_is_clicked();
        ajax_update_draft();
    });

    function after_repeat_modal_save_is_clicked(){

        $repeat_days_preview.find('ul').html('');

        form_data.repeat_days_data.days = [];

        $modal_repeat_days.find('[name="repeat_days[]"]:checked').each(function(){
            form_data.repeat_days_data.days.push( $(this).val() );
        });

        form_data.repeat_days_data.start_date = $modal_repeat_days.find('[name="repeat_days_start_date"]').val(); 
        form_data.repeat_days_data.end_date = $modal_repeat_days.find('[name="repeat_days_end_date"]').val(); 

        form_data.repeat_days_data.repeat = $modal_repeat_days.find('[name="repeat_days_repeat"]').val(); 
        form_data.repeat_days_data.exclude_holidays = $modal_repeat_days.find('[name="repeat_days_exclude_holidays"]').val(); 
        form_data.repeat_days_data.exclude_no_school_days = $modal_repeat_days.find('[name="repeat_days_exclude_no_school_days"]').val(); 

        form_data.repeat_days_data.start_time = {
            hour: $modal_repeat_days.find('[name="repeat_days_start_hour"]').val(),
            minute: $modal_repeat_days.find('[name="repeat_days_start_minute"]').val(),
            pam: $modal_repeat_days.find('[name="repeat_days_start_pam"]').val(),
        };

        form_data.repeat_days_data.end_time = {
            hour: $modal_repeat_days.find('[name="repeat_days_end_hour"]').val(),
            minute: $modal_repeat_days.find('[name="repeat_days_end_minute"]').val(),
            pam: $modal_repeat_days.find('[name="repeat_days_end_pam"]').val(),
        };

        // Preview
        var start_date_object = HOOT.parse_date(
            form_data.repeat_days_data.start_date + ' 12:00 AM'
        );

        var end_date_object = HOOT.parse_date(
            form_data.repeat_days_data.end_date + ' 12:00 AM'
        );

        start_date_object = HOOT.prepare_date(
            start_date_object.year,
            start_date_object.month,
            start_date_object.day,
            start_date_object.hour,
            start_date_object.minute
        );

        end_date_object = HOOT.prepare_date(
            end_date_object.year,
            end_date_object.month,
            end_date_object.day,
            end_date_object.hour,
            end_date_object.minute
        );

        form_data.repeat_days_data.start_date_object = start_date_object;
        form_data.repeat_days_data.end_date_object = end_date_object;

        $repeat_days_preview.find('.__start_date span').text( start_date_object.format( DATE_FORMAT ) );
        $repeat_days_preview.find('.__end_date span').text( end_date_object.format( DATE_FORMAT ) );

        $repeat_days_preview.find('ul').html('');
        $repeat_days_preview.find('.__days span').text( form_data.repeat_days_data.days.join(', ') );
                
        $repeat_days_preview.removeClass('__hidden');
        $modal_repeat_days.removeClass('show');

        // Sidebar preview
        var html = '<span class="text-muted">Starts:</span> ' + start_date_object.format('F jS, Y h:ia') + '<br>';
        html += '<span class="text-muted">Ends:</span> ' + end_date_object.format('F jS, Y h:ia') + '<br>';
        html += '<span class="text-muted">Days:</span> <span class="text-capitalize">' + form_data.repeat_days_data.days.join(', ') + '</span>';

        $preview.find('.__when_area p').html(html);
        $preview.find('.__when_area .event-preview-notice').addClass('__hidden');
    }

    // when "one-time modal" save is clicked 
    $('[data-action="save-one-time-modal"]').on('click', function(e){
        e.preventDefault();
        after_one_time_modal_save_is_clicked();
        ajax_update_draft();
    });

    function after_one_time_modal_save_is_clicked(){

        var selected_date = $one_time_datepicker.getDateObject();

        var start_time = {
            hour: $modal_one_time.find('[name="one_time_start_hour"]').val(),
            minute: $modal_one_time.find('[name="one_time_start_minute"]').val(),
            pam: $modal_one_time.find('[name="one_time_start_pam"]').val(),
        };

        var end_time = {
            hour: $modal_one_time.find('[name="one_time_end_hour"]').val(),
            minute: $modal_one_time.find('[name="one_time_end_minute"]').val(),
            pam: $modal_one_time.find('[name="one_time_end_pam"]').val(),
        };

        form_data.one_time_day_data = {
            date: selected_date.format('Y-m-d'),
            date_formated: selected_date.format( DATE_FORMAT ),
            start_time: start_time,
            end_time: end_time,
        };

        var start_time_str = start_time.hour + ':' + start_time.minute + ' ' + start_time.pam;
        var end_time_str = end_time.hour + ':' + end_time.minute + ' ' + end_time.pam;

        $one_time_preview.find('ul').html(
            '<li>'+
                '<span class="__start_time">'+start_time_str+'</span>'+
                '<span class="__date">'+form_data.one_time_day_data.date_formated+'</span>'+
                '<span class="__end_time">'+end_time_str+'</span>'+
            '</li>'
        );

        $one_time_preview.removeClass('__hidden');
        $modal_one_time.removeClass('show');

        // Sidebar preview
        var html = '<span class="text-muted">Starts:</span> ' + selected_date.format('F jS, Y') + ' ' + start_time_str.toLowerCase().replace(' ', '') + '<br>';
        html += '<span class="text-muted">Ends:</span> ' + selected_date.format('F jS, Y') + ' ' + end_time_str.toLowerCase().replace(' ', '');

        $preview.find('.__when_area p').html(html);
        $preview.find('.__when_area .event-preview-notice').addClass('__hidden');
    }
    
    // when "specific days modal" save is clicked 
    $('[data-action="save-specific-days-modal"]').on('click', function(e){
        e.preventDefault();
        after_specific_modal_save_is_clicked();
        ajax_update_draft();
    });

    function after_specific_modal_save_is_clicked(){

        var selected_dates_objs = $specific_days_datepicker.getDatesObjects();        
        var selected_dates = $specific_days_datepicker.getDates();
        var selected_dates_formated = selected_dates_objs.map(function( date ){
            return date.format( DATE_FORMAT );
        });

        var start_time = {
            hour: $modal_specific_days.find('[name="specific_days_start_hour"]').val(),
            minute: $modal_specific_days.find('[name="specific_days_start_minute"]').val(),
            pam: $modal_specific_days.find('[name="specific_days_start_pam"]').val(),
        };

        var end_time = {
            hour: $modal_specific_days.find('[name="specific_days_end_hour"]').val(),
            minute: $modal_specific_days.find('[name="specific_days_end_minute"]').val(),
            pam: $modal_specific_days.find('[name="specific_days_end_pam"]').val(),
        };

        var data = {
            dates: selected_dates,
            dates_formated: selected_dates_formated,
            start_time: start_time,
            end_time: end_time,
        };

        form_data.specific_days_data = data;

        var start_time_str = start_time.hour + ':' + start_time.minute + ' ' + start_time.pam;
        var end_time_str = end_time.hour + ':' + end_time.minute + ' ' + end_time.pam;

        $specific_days_preview.find('ul').html('');

        data.dates_formated.map(function( date, index ){
    
            $specific_days_preview.find('ul').append(
                '<li>'+
                    '<span class="__start_time">'+start_time_str+'</span>'+
                    '<span class="__date">'+date+'</span>'+
                    '<span class="__end_time">'+end_time_str+'</span>'+
                '</li>'
            );

        });

        form_data.specific_days_data.repeat = $modal_specific_days.find('[name="specific_days_repeat"]').val(); 
        form_data.specific_days_data.exclude_holidays = $modal_specific_days.find('[name="specific_days_exclude_holidays"]').val(); 
        form_data.specific_days_data.exclude_no_school_days = $modal_specific_days.find('[name="specific_days_exclude_no_school_days"]').val(); 

        $specific_days_preview.removeClass('__hidden');
        $modal_specific_days.removeClass('show');

        // Sidebar preview
        var html = '';

        selected_dates_objs.map(function(date){
            html += date.format('F jS, Y') + ' <span class="text-muted">Starts:</span> ' + start_time_str.toLowerCase().replace(' ', '') + ' - <span class="text-muted">Ends:</span> ' + end_time_str.toLowerCase().replace(' ', '') + '<br>';
        });

        $preview.find('.__when_area p').html(html);
        $preview.find('.__when_area .event-preview-notice').addClass('__hidden');
    }

    // when "repeat days modal start & end dates" are changed
    $modal_repeat_days.find('[name="repeat_days_start_date"], [name="repeat_days_end_date"]').on('input', function(){

        if( $(this).is('[name="repeat_days_start_date"]') ){
            $('.repeat_days_start_date_preview').text( $repeat_start_date_datepicker.getDateObject().format(DATE_FORMAT));
        }
        else{
            $('.repeat_days_end_date_preview').text( $repeat_end_date_datepicker.getDateObject().format(DATE_FORMAT));
        }
    });

    // when "days type" is changed
    $form.find('[name="days_type"]').on('input', function(){

        var value = $(this).val();

        $('.program-days-preview-area').addClass('__hidden');

        if( value == 'one-time' && form_data.one_time_day_data.hasOwnProperty('date') ){
            $one_time_preview.removeClass('__hidden');
        }
        else if( value == 'repeat' && form_data.repeat_days_data.hasOwnProperty('days') ){
            $repeat_days_preview.removeClass('__hidden');
        }
        else if( value == 'specific' && form_data.specific_days_data.hasOwnProperty('days') ){
            $specific_days_preview.addClass('__hidden');
        }
        
    });

    function create_prog_toggle_hidden_area(){   
        
        var _self = $(this);
        var $area = _self.closest('.program-create-toggle-area').find('.__area_to_toggle');

        if( $(this).val() == 0 ){
            $area.addClass('__hidden');
        }
        else{
            $area.removeClass('__hidden');
        }
    }

    // when "Is there a minimum order per person?" is changed
    $form.find('[name="is_min_order_enabled"]').on('change', create_prog_toggle_hidden_area);

    // when "Add code for registration requirement?" is changed
    $form.find('[name="is_reg_code_required"]').on('change', create_prog_toggle_hidden_area);

    // when "Include PDF?" is changed
    $form.find('[name="is_pdf_included"]').on('change', create_prog_toggle_hidden_area);

    // when "Show people attending" is changed
    $form.find('[name="show_people_attending"]').on('change', create_prog_toggle_hidden_area);

    // open "create class" modal
    var $modal_create_class = $('#modal-add-class');

    $('[data-action="open-create-class-modal"]').on('click', function(e){
        e.preventDefault();
        $modal_create_class.modal('show');
    });

    // when "create class" save button is clicked
    $('[data-action="save_new_class"]').on('click', function(e){

        $modal_create_class.find('.error').removeClass('error');

        var $name = $modal_create_class.find('[name="class_name"]');
        var slug = get_slug( $name.val() );

        if( ! $name.val().length ){
            $name.addClass('error');
            return false;
        }

        $form.find('.program-class-list').length

        if( $form.find('.program-class-list #class-' + slug ).length ){
            $name.addClass('error');
            alert('Class exists.');
            return false;
        }

        var $el = $( get_class_markup( $name.val(), true ) );

        $form.find('.program-class-list').append( $el );

        // trigger change helps saving it to db when the program status is a draft
        $el.find('[name]').trigger('change'); 

        $modal_create_class.find('[name="class_name"]').val('');
        $modal_create_class.modal('hide');
    });

    function get_slug( value ){
        return $.trim( value.toLowerCase().replace(/ /g, '-') );
    }

    function get_class_markup( value, is_checked ){

        var slug = get_slug( value );

        var markup = 
        '<li>'+
            '<div class="custom-control custom-checkbox">'+
                '<input type="checkbox" '+ ( is_checked ? 'checked' : '' ) +' value="'+value+'" name="program_class[]" id="class-'+slug+'" class="custom-control-input" >'+
                '<label for="class-'+slug+'" class="custom-control-label">'+value+'</label>'+
            '</div>'+
        '</li>';

        return markup;
    }

    /// ==============================================================================================
    /// Program Edit Page
    /// ==============================================================================================

    if( window.hasOwnProperty('PROGRAM') ){        

        if( PROGRAM.program_for_type === '' || ! PROGRAM.program_for_type ) PROGRAM.program_for_type = 'grades';
        if( PROGRAM.days_type === '' || ! PROGRAM.days_type ) PROGRAM.days_type = 'one-time';
        if( PROGRAM.type === '' || ! PROGRAM.type ) PROGRAM.type = 'paid';
        if( PROGRAM.program_for === '' || ! PROGRAM.program_for ) PROGRAM.program_for = [];
        if( PROGRAM.days === '' || ! PROGRAM.days ) PROGRAM.days = [];

        form_data = PROGRAM;

        change_cover_box_urls( PROGRAM.id, PROGRAM.slug );

        // Program for        
        if( PROGRAM.program_for_type === 'grades' ){

            form_data.grades = [];

            PROGRAM.program_for.map(function( grade ){
                $form.find('.program-grade-list .custom-control-input[value="'+ grade +'"]').attr('checked', 'checked');
                form_data.grades.push(grade);
            });

            $form.find('.program-class-list').addClass('__hidden');
            $form.find('.program-class-create').addClass('__hidden');
            $form.find('.program-grade-list').removeClass('__hidden');
        }
        else{

            form_data.classes = [];
            
            if( PROGRAM.program_for && PROGRAM.program_for !== '' ){
                PROGRAM.program_for.map(function( class_name ){
                    $form.find('.program-class-list').append( get_class_markup( class_name, true ) );
                    form_data.classes.push( class_name );
                });
            }

            $form.find('.program-class-list').removeClass('__hidden');
            $form.find('.program-class-create').removeClass('__hidden');
            $form.find('.program-grade-list').addClass('__hidden');
        }

        // Days type
        form_data.repeat_days_data = {};
        form_data.one_time_day_data = {};
        form_data.specific_days_data = {};
        
        if( PROGRAM.days_type === 'one-time' && PROGRAM.days.hasOwnProperty('date') ){
            
            form_data.days_type = 'one-time';
            form_data.one_time_day_data = PROGRAM.days;

            $one_time_datepicker.setDate(PROGRAM.days.date);

            $form.find('[name="one_time_start_hour"]').val(PROGRAM.days.start_time.hour).trigger('input');
            $form.find('[name="one_time_start_minute"]').val(PROGRAM.days.start_time.minute).trigger('input');
            $form.find('[name="one_time_start_pam"]').val(PROGRAM.days.start_time.pam).trigger('input');

            $form.find('[name="one_time_end_hour"]').val(PROGRAM.days.end_time.hour).trigger('input');
            $form.find('[name="one_time_end_minute"]').val(PROGRAM.days.end_time.minute).trigger('input');
            $form.find('[name="one_time_end_pam"]').val(PROGRAM.days.end_time.pam).trigger('input');

            after_one_time_modal_save_is_clicked();
        }
        else if( PROGRAM.days_type === 'repeat' && PROGRAM.days.hasOwnProperty('days') ){

            form_data.days_type = 'repeat';
            form_data.repeat_days_data = PROGRAM.days;

            PROGRAM.days.start_date_object = new Date( PROGRAM.days.start_date_object );
            PROGRAM.days.end_date_object = new Date( PROGRAM.days.end_date_object );
            
            $repeat_start_date_datepicker.setDate(PROGRAM.days.start_date);
            $repeat_end_date_datepicker.setDate(PROGRAM.days.end_date);

            $form.find('.repeat_days_start_date_preview').text(PROGRAM.days.start_date_object.format(DATE_FORMAT));
            $form.find('.repeat_days_end_date_preview').text(PROGRAM.days.end_date_object.format(DATE_FORMAT));

            $form.find('[name="repeat_days_start_hour"]').val(PROGRAM.days.start_time.hour).trigger('input');
            $form.find('[name="repeat_days_start_minute"]').val(PROGRAM.days.start_time.minute).trigger('input');
            $form.find('[name="repeat_days_start_pam"]').val(PROGRAM.days.start_time.pam).trigger('input');

            $form.find('[name="repeat_days_end_hour"]').val(PROGRAM.days.end_time.hour).trigger('input');
            $form.find('[name="repeat_days_end_minute"]').val(PROGRAM.days.end_time.minute).trigger('input');
            $form.find('[name="repeat_days_end_pam"]').val(PROGRAM.days.end_time.pam).trigger('input');

            $form.find('[name="repeat_days_repeat"]').val( PROGRAM.days.repeat ).trigger('input');
            $form.find('[name="repeat_days_exclude_holidays"]').val( PROGRAM.days.exclude_holidays ).trigger('input');
            $form.find('[name="repeat_days_exclude_no_school_days"]').val( PROGRAM.days.exclude_no_school_days ).trigger('input');

            if( ! parseInt( PROGRAM.days.repeat ) ){
                $form.find('[name="repeat_days_repeat"]').removeAttr('checked');
            }

            if( ! parseInt( PROGRAM.days.exclude_holidays ) ){
                $form.find('[name="repeat_days_exclude_holidays"]').removeAttr('checked');
            }

            if( ! parseInt( PROGRAM.days.exclude_no_school_days ) ){
                $form.find('[name="repeat_days_exclude_no_school_days"]').removeAttr('checked');
            }

            PROGRAM.days.days.map(function( day_name ){
                $modal_repeat_days.find('[name="repeat_days[]"][value="'+day_name+'"]').attr('checked', 'checked');
            });

            after_repeat_modal_save_is_clicked();
        }
        else if( PROGRAM.days_type === 'specific' && PROGRAM.days.hasOwnProperty('dates') ){

            form_data.days_type = 'specific';
            form_data.specific_days_data = PROGRAM.days;

            $specific_days_datepicker.setDates( PROGRAM.days.dates );
            
            var start_time_str = PROGRAM.days.start_time.hour + ':' + PROGRAM.days.start_time.minute + ' ' + PROGRAM.days.start_time.pam;
            var end_time_str = PROGRAM.days.end_time.hour + ':' + PROGRAM.days.end_time.minute + ' ' + PROGRAM.days.end_time.pam;
    
            PROGRAM.days.dates_formated.map(function( date ){
                
                $specific_days_preview.find('ul').append(
                    '<li>'+
                        '<span class="__start_time">'+start_time_str+'</span>'+
                        '<span class="__date">'+date+'</span>'+
                        '<span class="__end_time">'+end_time_str+'</span>'+
                    '</li>'
                );

            });    

            $specific_days_preview.removeClass('__hidden');
        }

        // Toggle areas
        $form.find('.program-create-toggle-area .hoot-component-toggle [type="checkbox"]').each(function(){

            var $self = $(this);

            if( $self.val() == 1 ){
                $self.attr('checked', 'checked');
                $self.closest('.program-create-toggle-area').find('.__area_to_toggle').removeClass('__hidden');
            }
            else{
                $self.removeAttr('checked');
                $self.closest('.program-create-toggle-area').find('.__area_to_toggle').addClass('__hidden');
            }
        });

        // PDF checkboxes
        $form.find('[name="include_pdf_on[]"]').removeAttr('checked');

        if( PROGRAM.include_pdf_on && PROGRAM.include_pdf_on !== '' ){
            PROGRAM.include_pdf_on.map(function( item ){
                $form.find('[name="include_pdf_on[]"][value="'+item+'"]').attr('checked', 'checked');
            });
        }

        // Program type
        if( PROGRAM.type === 'paid' ){
            $form.find('.program-create-paid-types').removeClass('__hidden');
            $form.find('.program-create-donation-types').addClass('__hidden');
            $form.find('.program-create-free-types').addClass('__hidden');
        }
        else if( PROGRAM.type === 'donation' ){
            $form.find('.program-create-donation-types').removeClass('__hidden');
            $form.find('.program-create-paid-types').addClass('__hidden');
            $form.find('.program-create-free-types').addClass('__hidden');
        }
        else if( PROGRAM.type === 'free' ){
            $form.find('.program-create-free-types').removeClass('__hidden');
            $form.find('.program-create-paid-types').addClass('__hidden');
            $form.find('.program-create-donation-types').addClass('__hidden');
        }
        
        // Types
        if( PROGRAM.hasOwnProperty('types') ){

            form_data.program_types_count = PROGRAM.types.length;
            $form.find('[name="program_types_count"]').val( form_data.program_types_count );
            $form.find('.hoot-component-number span').text( form_data.program_types_count );

            paidTypes.reset();
            freeTypes.reset();
            donationTypes.reset();

            PROGRAM.types.map(function( item, index ){

                if( item.type === 'paid' ){
                    paidTypes.add( new ProgramType( (index + 1), item ) );
                }
                else if( item.type === 'free' ){
                    freeTypes.add( new ProgramType( (index + 1), item ) );
                }
                else if( item.type === 'donation' ){
                    donationTypes.add( new ProgramType( (index + 1), item ) );
                }                
            });
        }

        update_donation_box(form_data.type);
    }

    /// ==============================================================================================
    /// Program List Page
    /// ==============================================================================================

    // when tooltip pause button is clicked
    $('.program-items .program-item-tooltip .__pause').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();

        if( ! confirm('Are you sure?') ){
            return false;
        }

        var $self = $(this);

        $.ajax({
            url: PROGRAM_PARAMS.program_base_url + 'create/',
            method: "POST",
            data: {
                ajax_pause_program: true,
                nonce: PROGRAM_PARAMS.nonce,
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
    // check before deleting a program
    $('.program-items .program-item-tooltip .__delete').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();

        var $self = $(this);

        $.ajax({
            url: PROGRAM_PARAMS.program_base_url + 'create/', 
            method: "POST",
            data: {
                ajax_before_delete_program: true,
                nonce: PROGRAM_PARAMS.nonce,
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
                delete_program($self.attr('data-id'));
            }
            // show a warning
            else{
                $model_sa_delete_modal.find('[data-action="delete_item_now"]').attr('data-id', $self.attr('data-id'));
                $model_sa_delete_modal.modal('show');
            }            
        });

    });

    // when delete program now is clicked
    $('[data-action="delete_item_now"]').on('click', function(e){
        e.preventDefault();
        delete_program($(this).attr('data-id'));
    });

    /**
     * Delete program
     * @param {int} id 
     */
    function delete_program( id ){
        $.ajax({
            url: PROGRAM_PARAMS.program_base_url + 'create/', 
            method: "POST",
            data: {
                ajax_delete_program: true,
                nonce: PROGRAM_PARAMS.nonce,
                id: id,
            },
            cache: false,
        }).done(function( response ) { 
            location.reload();
        });
    }
    
    // when tooltip edit button is clicked
    $('.program-items .program-item-tooltip .__edit').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        location.href = $(this).find('a').attr('href');
    });

    // when item tooltip is clicked
    $('.program-items .program-item-tooltip').on('click', function(e){
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
        var is_post_tooltip = _self.is('.custom-tooltip--program') 
            || _self.is('.tooltip-trigger--program')
            || _self.closest('.custom-tooltip--program').length;
                
        if( ! is_post_tooltip ){
            $('.custom-tooltip--program').removeClass('show');
        }
    });

    $('.program-items .program-item').on('click', function(){

        var $this = $(this);
        var id = $this.attr('data-id');
        var status = $this.attr('data-status');

        $this.addClass('active').siblings().removeClass('active');
        
        // update preview
        PROGRAMS.map(function( item ){

            if( item.id == id ){

                if( status === 'published' ){
                    $preview.removeClass('inactive').addClass('active');
                }
                else{
                    $preview.removeClass('active').addClass('inactive');
                }

                $preview.find('.__preview_btn').attr( 'href', PROGRAM_PARAMS.base_url + '/programs/' + item.slug );
                $preview.find('.__preview_name span').text( item.name );
                $preview.find('.__preview_desc').text( item.description );
                $preview.find('.__preview_address').html( 
                    item.school_name + 
                    '<br>' + 
                    item.school_address + ', ' + item.school_state + ', ' + item.school_zip
                );

                var ul_content = $this.find('.program-item-left-section ul').html();
                $preview.find('.program-item-left-section ul').html(ul_content);

                $('html, body').animate({
                    scrollTop: $preview.offset().top - 20
                }, 500);
            }
        });
    });

})( jQuery );